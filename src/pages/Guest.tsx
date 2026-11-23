import {
  ArrowLeft,
  BadgeCheck,
  Check,
  GraduationCap,
  LayoutDashboard,
  Lock,
  Presentation,
  ShieldCheck,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { BrandWordmark } from "@/components/gwg/bits";
import ClassroomTour from "@/components/guest/ClassroomTour";
import LearnerPath from "@/components/guest/LearnerPath";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GUEST_EXCLUSIONS,
  GUEST_LOCKED_SURFACES,
  GUEST_TOUR_OPTIONS,
  findGuestTour,
  type GuestTourId,
} from "@/lib/guestTours";
import {
  DEMO_DIVISIONS,
  DIVISION_SHORT,
  sampleDivisions,
  sampleScorecards,
  sampleTeam,
} from "@/data/guestSample";

const tourIcons = {
  classroom: Presentation,
  learner: GraduationCap,
  manager: LayoutDashboard,
  evidence: BadgeCheck,
} as const;

/**
 * Limited guest walkthrough.
 *
 * Read-only, no account, no backend: every number on this page comes from
 * `data/guestSample.ts`, which frames Fracht Group's public service lines with
 * illustrative learners, scores and records. The tours themselves are the real
 * `GUEST_TOUR_OPTIONS` definition the landing page links from, so the entry
 * points and the portal cannot drift apart.
 */
export default function Guest() {
  const [params, setParams] = useSearchParams();
  const active = findGuestTour(params.get("tour")) ?? GUEST_TOUR_OPTIONS[0];

  const select = (id: GuestTourId) => {
    const next = new URLSearchParams(params);
    next.set("tour", id);
    setParams(next, { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="ring-field ring-fade absolute inset-0 opacity-60"
          style={{ "--ring-cx": "88%", "--ring-cy": "8%" } as React.CSSProperties}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" aria-label="GWG demo home">
            <BrandWordmark compact />
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-border/80 bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              Fracht Group · demo workspace · illustrative
            </span>
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <ArrowLeft className="size-3.5" /> Back to landing
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          Guest walkthrough
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Walk through the platform.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          A limited, view-only look at the priority tools, framed around Fracht Group&apos;s four service
          lines. The company profile comes from Fracht&apos;s public materials; every learner, score, date
          and record on this page is illustrative, was not supplied by Fracht, and does not describe
          Fracht systems of record.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(["AIR", "OCEAN", "ROAD", "RAIL"] as const).map((division) => (
            <span
              key={division}
              className="rounded-full border border-border/80 bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              {DEMO_DIVISIONS[division]}
            </span>
          ))}
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
            Illustrative records · not Fracht systems of record
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {GUEST_TOUR_OPTIONS.map((tour) => {
            const Icon = tourIcons[tour.id];
            const isActive = tour.id === active.id;
            return (
              <button
                key={tour.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => select(tour.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-navy bg-navy text-white"
                    : "border-border/80 bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {tour.label}
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-[0.14em]",
                    isActive ? "text-white/60" : "text-muted-foreground/70",
                  )}
                >
                  {tour.duration}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          <section
            aria-label={active.label}
            className="corner-tick rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {active.eyebrow}
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight">
                  {active.label}
                </h2>
              </div>
              <span className="rounded-full border border-gold/50 bg-gold/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-gold-ink">
                illustrative · Fracht demo workspace
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">{active.description}</p>

            <ul className="mt-4 space-y-1.5">
              {active.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {active.id === "classroom" && <ClassroomTour />}
              {active.id === "learner" && <LearnerPath />}
              {active.id === "manager" && <ManagerPanel />}
              {active.id === "evidence" && <EvidencePanel />}
            </div>

            <p className="mt-6 rounded-lg bg-muted/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Illustrative records · modelled on Fracht Group&apos;s public profile
            </p>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                In this walkthrough
              </h3>
              <ul className="mt-3 space-y-2">
                {active.sections.map((section) => (
                  <li key={section} className="flex items-center gap-2 text-sm capitalize text-foreground">
                    <span className="inline-block size-1.5 rounded-full bg-primary" />
                    {section}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-navy p-5 text-white">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-gold" />
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                  Kept closed to guests
                </h3>
              </div>
              <ul className="mt-3 space-y-3">
                {GUEST_LOCKED_SURFACES.map((surface) => (
                  <li key={surface.label}>
                    <p className="text-sm font-semibold">{surface.label}</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">{surface.detail}</p>
                  </li>
                ))}
                {GUEST_EXCLUSIONS.slice(0, 2).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-white/65">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            No account · no Fracht records · view-only preview
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/#tour"
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary underline-offset-4 hover:underline"
            >
              See the product tour
            </a>
            <Link
              to="/"
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back to the landing page
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ManagerPanel() {
  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-2">
        {sampleDivisions.map((row) => (
          <div key={row.division} className="rounded-xl border border-border/70 bg-background p-3.5">
            <div className="flex items-center justify-between">
              <span className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                {DEMO_DIVISIONS[row.division]}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{row.cohort} people</span>
            </div>
            <p className="mt-2 text-sm font-semibold leading-tight">{row.desk}</p>
            <p className="text-xs text-muted-foreground">{row.program}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-lg font-bold tabular-nums">{row.baseline}</span>
              <span className="font-mono text-[10px] text-muted-foreground">baseline</span>
              <span className="font-mono text-[10px] text-primary">→ {row.measured}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70">
        <div className="hidden grid-cols-[1.1fr_1.1fr_0.7fr_0.7fr] bg-navy px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 sm:grid">
          <span>Person</span>
          <span>Role · desk</span>
          <span>Progress</span>
          <span>Next review</span>
        </div>
        {sampleTeam.map((row, i) => (
          <div
            key={row.name}
            className={cn(
              "grid gap-1 px-4 py-3 sm:grid-cols-[1.1fr_1.1fr_0.7fr_0.7fr] sm:items-center sm:gap-3",
              i % 2 === 0 ? "bg-card" : "bg-muted/40",
              "border-t border-border/50",
            )}
          >
            <span className="text-sm font-medium">{row.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.role}
              <span className="mt-0.5 block text-[11px]">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70">
                  {DIVISION_SHORT[row.division]}
                </span>{" "}
                {row.desk}
              </span>
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60 sm:hidden">
                Progress
              </span>
              {row.baseline} → <span className="text-primary">{row.current}</span>
            </span>
            <span className="text-[11px] text-muted-foreground">
              <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60 sm:hidden">
                Next review
              </span>
              {row.nextReview}
              <span
                className={cn(
                  "mt-1 block font-mono text-[9px] uppercase tracking-[0.1em]",
                  row.support === "On track" && "text-primary",
                  row.support === "Watch" && "text-gold-ink",
                  row.support === "Needs support" && "text-destructive",
                )}
              >
                {row.support}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidencePanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70">
      <div className="hidden grid-cols-[0.9fr_1.2fr_0.8fr_0.7fr_0.9fr] bg-navy px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 sm:grid">
        <span>Code</span>
        <span>Program</span>
        <span>Sealed</span>
        <span>Covered</span>
        <span>Result</span>
      </div>
      {sampleScorecards.map((row, i) => (
        <div
          key={row.code}
          className={cn(
            "grid gap-1 px-4 py-3 sm:grid-cols-[0.9fr_1.2fr_0.8fr_0.7fr_0.9fr] sm:items-center sm:gap-3",
            i % 2 === 0 ? "bg-card" : "bg-muted/40",
            "border-t border-border/50",
          )}
        >
          <span className="font-mono text-[11px] text-gold-ink">{row.code}</span>
          <span className="text-xs text-muted-foreground">
            <span className="mr-1.5 rounded border border-border/80 px-1 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em]">
              {DIVISION_SHORT[row.division]}
            </span>
            <span className="text-foreground">{row.desk}</span>
            <span className="mt-0.5 block text-[11px] text-muted-foreground">{row.program}</span>
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60 sm:hidden">
              Sealed
            </span>
            {row.sealed}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60 sm:hidden">
              Covered
            </span>
            {row.covered}
          </span>
          <span className="font-mono text-[11px]">
            <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/60 sm:hidden">
              Result
            </span>
            {row.baseline} <span className="text-muted-foreground">→</span>{" "}
            <span className="text-primary">{row.measured}</span>
            <span className="mt-0.5 block font-mono text-[9px] text-muted-foreground">{row.digest}</span>
          </span>
        </div>
      ))}
      <p className="border-t border-border/50 bg-muted/40 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        Not a compliance certification.
      </p>
    </div>
  );
}
