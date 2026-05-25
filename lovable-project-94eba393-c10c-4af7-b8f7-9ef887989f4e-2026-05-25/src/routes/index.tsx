import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Activity, Users, Sparkles, Search, Bell, Plus } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { CreditMeter } from "@/components/dashboard/CreditMeter";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { UserMenu } from "@/components/dashboard/UserMenu";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const stats = [
  { label: "Active projects", value: "24", delta: "+3 this week", icon: Sparkles },
  { label: "Team members", value: "12", delta: "2 pending invites", icon: Users },
  { label: "Tasks completed", value: "318", delta: "+18% vs last month", icon: Activity },
];

const activity = [
  { who: "Liam Patel", what: "deployed Atlas v2.4", when: "2m ago" },
  { who: "Noor Haddad", what: "invited 3 designers", when: "1h ago" },
  { who: "Theo Park", what: "closed 7 issues in Orbit", when: "3h ago" },
  { who: "Mira Okafor", what: "generated 42 AI drafts", when: "Yesterday" },
];

function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="relative hidden flex-1 max-w-md md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search projects, members, files…" className="pl-9" />
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 space-y-6 p-4 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Ava</h1>
                  <Badge variant="secondary">Pro</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Here's what's happening across your workspace today.
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New project
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold">Recent activity</h2>
                    <p className="text-xs text-muted-foreground">
                      Updates from your team in the last 24 hours
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <ul className="mt-4 divide-y">
                  {activity.map((a) => (
                    <li key={a.who + a.when} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {a.who
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{a.who}</span>{" "}
                          <span className="text-muted-foreground">{a.what}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{a.when}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <CreditMeter used={450} total={1000} variant="card" />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
