import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/generate/stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { prompt?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const apiKey = process.env.OPENAI_API_KEY || "";
        const isMock =
          !apiKey || apiKey === "mock_key" || apiKey.startsWith("sk-mock");

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
          async start(controller) {
            const send = (chunk: string) => {
              controller.enqueue(encoder.encode(chunk));
            };

            const sleep = (ms: number) =>
              new Promise((resolve) => setTimeout(resolve, ms));

            try {
              if (isMock) {
                const mockText =
                  "This is a simulated streaming response from your local boilerplate backend. It lets you test your React frontend and SSE parsing logic without spending real API credits or needing a valid provider key.";
                const words = mockText.split(" ");

                for (const word of words) {
                  if (request.signal.aborted) break;

                  const payload = {
                    id: "mock-chatcmpl",
                    object: "chat.completion.chunk",
                    created: Math.floor(Date.now() / 1000),
                    model: "mock-model",
                    choices: [
                      {
                        index: 0,
                        delta: { content: word + " " },
                        finish_reason: null,
                      },
                    ],
                  };

                  send(`data: ${JSON.stringify(payload)}\n\n`);
                  await sleep(100);
                }

                const donePayload = {
                  id: "mock-chatcmpl",
                  object: "chat.completion.chunk",
                  created: Math.floor(Date.now() / 1000),
                  model: "mock-model",
                  choices: [
                    { index: 0, delta: {}, finish_reason: "stop" },
                  ],
                };
                send(`data: ${JSON.stringify(donePayload)}\n\n`);
                send(`data: [DONE]\n\n`);
              } else {
                // Real OpenAI streaming via fetch
                const openaiRes = await fetch(
                  "https://api.openai.com/v1/chat/completions",
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${apiKey}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      model: "gpt-4o-mini",
                      messages: [{ role: "user", content: body.prompt || "" }],
                      stream: true,
                    }),
                    signal: request.signal,
                  }
                );

                if (!openaiRes.ok) {
                  const errText = await openaiRes.text();
                  send(
                    `event: error\ndata: ${JSON.stringify({ message: errText })}\n\n`
                  );
                  controller.close();
                  return;
                }

                const reader = openaiRes.body?.getReader();
                if (!reader) {
                  controller.close();
                  return;
                }

                while (true) {
                  if (request.signal.aborted) {
                    await reader.cancel();
                    break;
                  }
                  const { done, value } = await reader.read();
                  if (done) break;
                  controller.enqueue(value);
                }
              }
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Unknown stream error";
              send(
                `event: error\ndata: ${JSON.stringify({ message })}\n\n`
              );
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
