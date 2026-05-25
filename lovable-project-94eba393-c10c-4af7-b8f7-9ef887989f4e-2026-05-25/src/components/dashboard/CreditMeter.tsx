import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CreditMeterProps {
  used: number;
  total: number;
  variant?: "sidebar" | "card";
}

export function CreditMeter({ used, total, variant = "sidebar" }: CreditMeterProps) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const remaining = total - used;
  const tone =
    pct >= 90
      ? "text-destructive"
      : pct >= 70
        ? "text-amber-500 dark:text-amber-400"
        : "text-primary";

  if (variant === "card") {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Zap className={`h-4 w-4 ${tone}`} />
            </div>
            <div>
              <p className="text-sm font-medium">AI Credits</p>
              <p className="text-xs text-muted-foreground">Resets in 12 days</p>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Upgrade
          </Button>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">{used.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">/ {total.toLocaleString()} used</span>
        </div>

        <div className="mt-3">
          <Progress value={pct} className="h-2" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{pct}% consumed</span>
            <span>{remaining.toLocaleString()} remaining</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-sidebar-accent/40 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Zap className={`h-3.5 w-3.5 ${tone}`} />
          <span>AI Credits</span>
        </div>
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="mt-2 h-1.5" />
      <p className="mt-2 text-[11px] text-muted-foreground">
        {used.toLocaleString()} / {total.toLocaleString()} used
      </p>
    </div>
  );
}
