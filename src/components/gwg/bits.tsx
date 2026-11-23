import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.svg";

/* ---------- Brand ---------- */

export function GwgLogo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <img
      src={logo}
      alt="GWG — Workforce development"
      width={size}
      height={size}
      className={cn("rounded-lg", className)}
    />
  );
}

export function BrandWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <GwgLogo size={30} />
      <div className="leading-none">
        <div className="font-display text-sm font-bold tracking-[0.18em] text-foreground">
          GWG
        </div>
        {!compact && (
          <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.24em] text-muted-foreground">
            Workforce Development Infrastructure
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Phase ---------- */

export type Phase = "baseline" | "measured" | "sealed";

const phaseConfig: Record<
  Phase,
  { label: string; className: string; step: string }
> = {
  baseline: {
    label: "Baseline",
    className: "border-chart-2/40 bg-chart-2/10 text-chart-2",
    step: "01",
  },
  measured: {
    label: "Measured",
    className: "border-primary/40 bg-primary/10 text-primary",
    step: "02",
  },
  sealed: {
    label: "Sealed",
    className: "border-foreground/20 bg-foreground/10 text-foreground",
    step: "03",
  },
};

export function PhaseBadge({ phase, className }: { phase: Phase; className?: string }) {
  const cfg = phaseConfig[phase];
  return (
    <Badge
      variant="outline"
      className={cn(
        "workspace-phase-badge gap-1.5 border font-mono text-[10px] uppercase tracking-[0.14em]",
        cfg.className,
        className,
      )}
    >
      <span className="opacity-60">{cfg.step}</span>
      {cfg.label}
    </Badge>
  );
}

/* ---------- Stat ---------- */

export function Stat({
  label,
  value,
  sub,
  icon,
  accent = false,
  suffix,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  suffix?: string;
  tone?: "ok" | "warn";
}) {
  return (
    <div
      className={cn(
        "workspace-stat card-tech corner-tick relative rounded-xl p-4",
        accent && "border-primary/30",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
        {icon && <span className={cn(accent ? "text-primary" : "text-muted-foreground")}>{icon}</span>}
      </div>
      <div
        className={cn(
          "mt-2 font-display text-2xl font-bold tabular-nums",
          accent && "text-primary",
          tone === "warn" && "text-amber-400",
        )}
      >
        {value}
        {suffix && (
          <span className="ml-1 font-mono text-xs font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

/* ---------- Section heading ---------- */

export function SectionTitle({
  kicker,
  title,
  subtitle,
  className,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("workspace-section-title space-y-1.5", className)}>
      <div className="flex items-center gap-3">
        <span className="workspace-section-rule h-px w-6 bg-primary/60" />
        {kicker && (
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            {kicker}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      {subtitle && (
        <p className="pl-9 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

/* ---------- Empty / Loading states ---------- */

export function Empty({
  icon,
  message,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  message: string;
}) {
  const Icon = icon;
  return (
    <div className="card-tech flex flex-col items-center gap-3 rounded-lg px-6 py-10 text-center">
      {Icon && <Icon className="size-7 text-muted-foreground/70" />}
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
      <span className="size-4 animate-spin rounded-full border-2 border-border border-t-primary" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Loading…</span>
    </div>
  );
}

/* ---------- Date + number formatting ---------- */

export function fmtDate(ts?: number | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function fmtNum(n: number, digits = 2): string {
  return n.toFixed(digits);
}

export function fmtDelta(n: number, digits = 2): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(digits)}`;
}
