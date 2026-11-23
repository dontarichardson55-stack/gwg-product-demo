import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  Presentation,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BrandWordmark, GwgLogo } from "@/components/gwg/bits";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePublicSession } from "@/hooks/use-auth";
import { START_BASELINE_HREF } from "@/lib/accessLinks";
import { GUEST_TOUR_OPTIONS, guestTourHref } from "@/lib/guestTours";

const ease = [0.22, 1, 0.36, 1] as const;

const guestTourIcons = {
  classroom: Presentation,
  learner: GraduationCap,
  manager: LayoutDashboard,
  evidence: BadgeCheck,
} as const;

const fadeUp = {
  // Fade only: translating sections while they enter the viewport makes the
  // page feel like it is moving under the reader, especially on trackpads.
  // Opacity never changes layout position, so scrolling stays anchored.
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "0px 0px -60px 0px" },
  transition: { duration: 0.55, ease },
};

/* ------------------------------------------------------------------ */
/* Public copy: customer outcomes, not implementation details.         */
/* ------------------------------------------------------------------ */

const capabilities = [
  {
    icon: Radar,
    n: "01",
    title: "A measured starting point",
    body: "Establish what each desk, office, and shift can do today — the honest starting point for onboarding, retraining, and the next development cycle.",
  },
  {
    icon: Target,
    n: "02",
    title: "Onboarding that lands",
    body: "Bring new hires, new offices, and new service lines to working standard with a clear path from day one, and a manager who can see it.",
  },
  {
    icon: Sparkles,
    n: "03",
    title: "Training built for the role",
    body: "Map training to the responsibilities, standards, and performance expectations each role is actually held to.",
  },
  {
    icon: Users,
    n: "04",
    title: "Continuous learning",
    body: "Keep development going between programs — practice, follow-up, and somewhere to take a real question.",
  },
  {
    icon: ShieldCheck,
    n: "05",
    title: "Managers in the loop",
    body: "Give line managers and performance staff one view of assignments, progress, and who needs support before the next review.",
  },
  {
    icon: BadgeCheck,
    n: "06",
    title: "Records and dated scorecards",
    body: "Keep learning records and review history together, so progress is shown against a recorded starting point.",
  },
];

const tourTabs = [
  {
    key: "learners",
    label: "Learners",
    title: "Every person gets a path",
    body: "New hires, retraining, and long-tenured teams each get learning that fits how they work, room to practice, and a clear view of their own next step.",
    points: [
      "A recorded starting point that sets the level",
      "Learning that adapts to the person, then to the role",
      "Continuous learning between programs",
      "Support the moment a question comes up",
    ],
  },
  {
    key: "managers",
    label: "Managers",
    title: "See progress across your teams",
    body: "Spend less time assembling status updates and more time developing the people who report to you — across teams, departments, and locations.",
    points: [
      "Review progress across teams and sites in one workspace",
      "See where support is needed before it shows up in results",
      "Organize onboarding, training, and assignments",
      "Bring dated results to stakeholder and board reviews",
    ],
  },
  {
    key: "compliance",
    label: "Compliance & leadership",
    title: "Bring evidence to the conversation",
    body: "Keep dated learning records accessible for reporting and review. GWG supports your evidence process; it does not replace your compliance obligations.",
    points: [
      "Dated learning records",
      "Visibility into renewals and follow-up",
      "Review history in one workspace",
      "Exportable scorecards for stakeholders",
    ],
  },
];

const lmsRows = [
  { n: "01", topic: "Onboarding", gwg: "A measured start and a plan for every new person", lms: "A list of assigned courses" },
  { n: "02", topic: "Training", gwg: "Capability built for the role, not a course library", lms: "Course completion and attendance" },
  { n: "03", topic: "Starting point", gwg: "A recorded starting point for comparison", lms: "An enrollment date" },
  { n: "04", topic: "Continuous learning", gwg: "Practice and follow-up that continue after the program", lms: "A record of courses finished" },
  { n: "05", topic: "Evidence", gwg: "Dated scorecards and learning records", lms: "Completion dates" },
  { n: "06", topic: "Stakeholder review", gwg: "Exportable results against a recorded starting point", lms: "A summary of participation" },
];

const loopStages = [
  {
    n: "01",
    title: "Onboard",
    body: "Start every new hire, team, and site with a measured picture of current capability — and the goals your organization is accountable for.",
    learner: "I know where I am starting and what is expected of me.",
    workspace: "A baseline, goals, and first assignments in one place.",
    manager: "A starting point for a more useful onboarding conversation.",
  },
  {
    n: "02",
    title: "Train",
    body: "Deliver training tied to the work people actually do, with room to practice before it is judged.",
    learner: "I can build the skills my role needs.",
    workspace: "Programs, practice, and support in one place.",
    manager: "Visibility into assignments and where support is needed.",
  },
  {
    n: "03",
    title: "Keep learning",
    body: "Keep development going between programs with follow-up, practice, and reviews people can keep up with.",
    learner: "I can see what is due and what to work on next.",
    workspace: "A clear view of upcoming learning and completed work.",
    manager: "A shared view of progress to guide follow-up.",
  },
  {
    n: "04",
    title: "Prove it",
    body: "Bring dated results to the next review, and direct the following investment where it will move the number.",
    learner: "I can look back at my progress and plan my next goals.",
    workspace: "Dated scorecards that can be reviewed and exported.",
    manager: "Evidence for the next workforce decision.",
  },
];

const evidenceNodes = [
  "Onboarding",
  "Training",
  "Continuous learning",
  "Progress to review",
  "Dated scorecards",
];

const valueCards = [
  {
    name: "Built for your workforce",
    body: "Connect development to the responsibilities, standards, and performance your organization is accountable for.",
  },
  {
    name: "Training that transfers",
    body: "Give people room to practice, ask questions, and apply what they learn to real work — the same week.",
  },
  {
    name: "Managers equipped to coach",
    body: "Give leaders and operations managers a clearer view of progress, so their conversations and follow-up land.",
  },
  {
    name: "Evidence for every review",
    body: "Use dated records to show what changed, and where the next investment should go.",
  },
];

const marquee = [
  "Workforce onboarding",
  "Role-based capability",
  "Multi-site rollouts",
  "Continuous learning",
  "Manager enablement",
  "Retention you can measure",
  "Ongoing practice",
  "Progress reviews",
  "Dated scorecards",
  "Exportable results",
];

/* ================================================================== */
/* Signature brand pieces                                             */
/* ================================================================== */

/** Decorative brand mark — not a technical diagram. */
function OrbitMark({ size = 200, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="100" cy="100" r="7" className="fill-primary" />
      <circle cx="100" cy="100" r="26" stroke="currentColor" className="text-primary" strokeWidth="5" />
      <circle cx="100" cy="100" r="46" stroke="currentColor" className="text-primary/70" strokeWidth="3.5" />
      <circle cx="100" cy="100" r="66" stroke="currentColor" className="text-primary/45" strokeWidth="3" />
      <circle cx="100" cy="100" r="88" stroke="currentColor" className="text-primary/25" strokeWidth="2.5" />
      {/* the gold arc — the proven segment */}
      <path
        d="M 100 12 A 88 88 0 0 1 183 62"
        stroke="var(--gold)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Decorative hero rings with customer-benefit labels.
 * `activeStage` cycles 0→3 to animate the gold highlight.
 */
const heroStages = [
  { label: "CLEAR GOALS", side: "top" },
  { label: "RELEVANT LEARNING", side: "right" },
  { label: "ONGOING SUPPORT", side: "bottom" },
  { label: "VISIBLE PROGRESS", side: "left" },
] as const;

const heroLabelPos: Record<string, string> = {
  top: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
  // The desktop offsets push the side labels past the edge of a phone screen,
  // where the ring is only as wide as the content column. Below sm the labels
  // sit on the ring edge instead of hanging outside it.
  right: "right-0 top-1/2 -translate-y-1/2 sm:translate-x-1/3",
  // On phones the ring's bottom label would otherwise sit on the gold caption.
  bottom: "left-1/2 bottom-8 -translate-x-1/2 translate-y-1/2 sm:bottom-0",
  left: "left-0 top-1/2 -translate-y-1/2 sm:-translate-x-1/4",
};

function HeroRings() {
  // The gold highlight cycles 0→3 on a single stable timer. Living inside
  // HeroRings (not the page component) means the cycle re-renders only this
  // subtree — the 1,400-line page never re-renders on the wheel's clock.
  const [activeStage, setActiveStage] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveStage((s) => (s + 1) % 4), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease }}
      className="relative mx-auto aspect-square w-full max-w-105"
    >
      {/* soft navy field behind the rings */}
      <div className="absolute inset-0 rounded-full bg-navy" style={{ maskImage: "radial-gradient(circle at 50% 50%, black 62%, transparent 78%)" }} />

      {/* rotating outer ring group (decorative orbit) */}
      <div className="orbit-slow absolute inset-0">
        <OrbitMark size={9999} className="h-full w-full" />
      </div>

      {/* stage labels pinned to their rings — cycling gold highlight travels the loop */}
      {heroStages.map((s, i) => (
        <motion.span
          key={s.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + i * 0.15, duration: 0.6 }}
          className={cn("absolute", heroLabelPos[s.side])}
        >
          <span
            className={cn(
              "block whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] backdrop-blur-sm transition-all duration-500",
              i === activeStage
                ? "scale-110 border-gold/70 bg-gold/20 text-white shadow-[0_0_20px_-2px_rgba(255,215,0,0.55)]"
                : "border-white/15 bg-navy-soft/90 text-white/75",
            )}
          >
            {s.label}
          </span>
        </motion.span>
      ))}

      {/* core badge — the learner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5, ease }}
        className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg"
      >
        <span className="font-display text-sm font-bold tracking-[0.08em]">GWG</span>
      </motion.div>

      {/* gold arc caption */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.5 }}
        className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-gold-ink"
      >
        <span className="inline-block size-1.5 rounded-full bg-gold" />
        your growth, in focus
      </motion.div>
    </motion.div>
  );
}

/** Capability ticker — brand marquee with gold separators. */
function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <div className="relative overflow-hidden border-y border-border/70 bg-muted/40 py-3.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="marquee-track items-center gap-8 pr-8">
        {row.map((m, i) => (
          <span key={`${m}-${i}`} className="flex items-center gap-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {m}
            </span>
            <span className="inline-block size-1 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Live, honest data sections                                          */
/* ================================================================== */

function PulseSection() {
  // Public page: a backend that cannot answer must downgrade this panel to the
  // public view, never take the page down. `usePublicSession` reads the session
  // once and reports `unavailable` instead of throwing during render.
  const session = usePublicSession();
  const isLoading = session.status === "loading";
  const isAuthenticated = session.status === "signed_in";

  if (isLoading) {
    return (
      <PulseShell>
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-5 py-4">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            your workspace · checking sign-in…
          </span>
        </div>
      </PulseShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PulseShell>
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border/70 bg-card px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-display font-semibold">Your learning workspace</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to review your organization’s learning progress, assignments, and upcoming reviews.
            </p>
            {session.status === "unavailable" ? (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Workspace sign-in is temporarily unavailable.
              </p>
            ) : null}
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/auth?returnTo=%2Fdashboard">Sign in to your workspace</Link>
          </Button>
        </div>
      </PulseShell>
    );
  }

  return <PulseSignedIn />;
}

function PulseSignedIn() {
  // Keep the public landing page free of signed-in data. Live readings belong
  // in the member workspace, so a first-time visitor always sees the public view.
  return (
    <PulseShell>
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border/70 bg-card px-5 py-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display font-semibold">Your learning workspace</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open your workspace to review learning progress, assignments, and upcoming reviews.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link to="/dashboard">Open dashboard</Link>
        </Button>
      </div>
    </PulseShell>
  );
}

function PulseShell({ children }: { children: React.ReactNode }) {
  // min-h reserves the data-grid footprint so the loading→data and
  // signed-out→data swaps don't reflow every section below the pulse.
  return (
    <section className="relative mx-auto flex min-h-38 w-full max-w-6xl flex-col justify-center px-4 py-10">
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Tour panel visuals — illustrative, labeled, ring-styled. */
function TourPanel({ active }: { active: string }) {
  if (active === "learners") {
    return (
      <div className="corner-tick relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-60" style={{ "--ring-cx": "85%", "--ring-cy": "15%" } as React.CSSProperties} />          <div className="relative">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              learner view · illustrative
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              a clearer next step
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "A measured starting point",
              "Onboarding goals for the role",
              "Training assignments in one place",
              "Upcoming practice and reviews",
              "Progress you can discuss",
            ].map((label) => (
              <div key={label} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background px-3.5 py-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm leading-6 text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-lg bg-muted/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            illustrative view — not a real learner record
          </p>
        </div>
      </div>
    );
  }
  if (active === "managers") {
    return (
      <div className="corner-tick relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-50" style={{ "--ring-cx": "10%", "--ring-cy": "90%" } as React.CSSProperties} />          <div className="relative">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              manager view · illustrative
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              team visibility
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              "Team progress",
              "Areas needing support",
              "Upcoming reviews",
              "Program participation",
              "Development goals",
              "Learning assignments",
            ].map((label) => (
              <div key={label} className="rounded-lg border border-border/60 bg-background p-3">
                <Check className="size-4 text-primary" />
                <div className="mt-2 text-[11px] font-medium leading-tight text-foreground">{label}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">
            An illustrative overview of the information managers can use to organize learning
            and support their teams. Your organization’s records remain in its signed-in workspace.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="corner-tick relative overflow-hidden rounded-2xl border border-navy/80 bg-navy p-6 shadow-md">
      <div className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-25" style={{ "--ring-cx": "80%", "--ring-cy": "20%" } as React.CSSProperties} />
      <div className="relative">
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
            reporting view · illustrative
          </span>
          <span className="rounded-full border border-gold/50 bg-gold/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
            ready to review
          </span>
        </div>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-white/12 bg-white/5 px-4 py-3">
            <span className="text-sm text-white/80">Dated learning records</span>
            <span className="font-mono text-xs text-gold">For your review</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/12 bg-white/5 px-4 py-3">
            <span className="text-sm text-white/80">Export ready</span>
            <span className="rounded border border-white/25 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70">
              Shareable results
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/12 bg-white/5 px-4 py-3">
            <span className="text-sm text-white/80">Findings & renewals</span>
            <span className="text-xs text-white/70">Keep follow-up in view</span>
          </div>
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
          illustrative view — not a compliance certification
        </p>
      </div>
    </div>
  );
}

function TourSection() {
  const [active, setActive] = useState("learners");
  const tab = tourTabs.find((t) => t.key === active) ?? tourTabs[0];

  return (
    <section id="tour" className="relative mx-auto w-full max-w-6xl px-4 py-20" aria-label="Product tour">
      <motion.div {...fadeUp} className="flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          Product tour
        </span>          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            One platform, every role in the workforce.
          </h2>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            People, managers, and leadership work from the same records, with access appropriate to
            their responsibilities — so progress is discussed from one version of the truth.
          </p>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tourTabs.map((t) => (
          <button
            key={t.key}
            aria-pressed={active === t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === t.key
                ? "border-navy bg-navy text-white"
                : "border-border/80 bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
        <motion.div key={tab.key} {...fadeUp}>
          <h3 className="font-display text-2xl font-bold tracking-tight">{tab.title}</h3>
          <p className="mt-3 leading-7 text-muted-foreground">{tab.body}</p>
          <ul className="mt-6 space-y-3">
            {tab.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <TourPanel active={active} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function CatalogSection() {
  const session = usePublicSession();
  const isLoading = session.status === "loading";
  const isAuthenticated = session.status === "signed_in";

  if (isLoading) {
    return (
      <CatalogShell>
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-5 py-4">
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            reading catalog…
          </span>
        </div>
      </CatalogShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <CatalogShell>
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border/70 bg-card px-5 py-5 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Sign in to browse the onboarding, training, and continuous learning programs available to your organization.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to="/auth?returnTo=%2Fcontent">Browse all programs</Link>
          </Button>
        </div>
      </CatalogShell>
    );
  }

  return <CatalogPreview />;
}

function CatalogPreview() {
  return (
    <CatalogShell>
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border/70 bg-card px-5 py-5 sm:flex-row sm:items-center">
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Browse the onboarding, training, and continuous learning programs available in your workspace.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link to="/content">Browse all programs</Link>
        </Button>
      </div>
    </CatalogShell>
  );
}

function CatalogShell({ children }: { children: React.ReactNode }) {
  return (
    <section id="catalog" className="relative mx-auto w-full max-w-6xl px-4 py-20">
      <motion.div {...fadeUp} className="flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          From the catalog
        </span>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Programs built for your workforce.
        </h2>
        <p className="max-w-2xl leading-7 text-muted-foreground">
          Explore your organization’s onboarding, training, and continuous learning programs
          from a signed-in workspace.
        </p>
      </motion.div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

/**
 * The four customer-journey cards beside the decorative wheel. Each opens its
 * three-lens panel when selected. It stays put until the visitor chooses a
 * stage so the accordion never changes page height on its own while reading.
 */
function StageCards() {
  const [stageIdx, setStageIdx] = useState(0);

  return (
    <div className="space-y-3">
      {loopStages.map((s, i) => {
        const isActive = i === stageIdx;
        return (
          <motion.button
            key={s.n}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.1 }}
            onClick={() => setStageIdx(i)}
            aria-expanded={isActive}
            className={cn(
              "group w-full rounded-xl border bg-card p-5 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-md",
              isActive ? "border-primary/50 shadow-md ring-1 ring-primary/20" : "border-border/70",
            )}
          >
            <div className="flex gap-4">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-colors",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-primary/30 bg-primary/5 text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-white",
                )}
              >
                {s.n}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.body}</p>
              </div>
            </div>

            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.35, ease }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid gap-2 border-t border-border/60 pt-4 sm:grid-cols-3">
                  {([
                    ["For the learner", s.learner],
                    ["In your workspace", s.workspace],
                    ["For your manager", s.manager],
                  ] as const).map(([lens, text]) => (
                    <div key={lens} className="rounded-lg border border-border/60 bg-muted/40 p-3">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-primary">
                        {lens}
                      </p>
                      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.button>
        );
      })}
      <p className="text-center font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
        select a stage to open its detail
      </p>
    </div>
  );
}

/* Bottom-of-page guest entrance: limited, view-only access with a path for each
   kind of visitor. The Virtual Classroom leads because it is the product's
   clearest demonstration, and every option deep-links into the same portal. */
function GuestWalkthroughSection() {
  return (
    <section id="guest-walkthrough" aria-label="Guest walkthrough" className="relative mx-auto w-full max-w-6xl px-4 pb-16">
      <motion.div
        {...fadeUp}
        className="relative overflow-hidden rounded-2xl bg-navy p-8 text-white shadow-xl sm:p-12"
      >
        <div
          className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-25"
          style={{ "--ring-cx": "92%", "--ring-cy": "8%" } as React.CSSProperties}
        />
        <div className="relative">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold">
            Guest walkthrough
          </span>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Walk through the platform before you sign in.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                Limited, view-only access to the priority tools. The Virtual Classroom is the
                clearest look at how a GWG session runs, or choose the view that matches your
                role.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
                <span className="size-1.5 rounded-full bg-gold" /> Fracht Group · demonstration workspace
              </p>
              <p className="mt-3 max-w-2xl text-xs leading-6 text-white/60">
                Framed around Fracht Group&apos;s four service lines and built from its public
                company profile: founded in Basel in 1955, family-owned, 150+ offices in 50+
                countries, 2,500+ logistics experts, and a licensed and bonded NVOCC. The learners,
                scores and records are illustrative, not Fracht systems of record.
              </p>
            </div>
            <Button asChild size="lg" className="h-11 w-fit bg-white px-7 font-semibold text-navy hover:bg-white/90">
              <Link to="/guest">
                Start the guest walkthrough <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-2 rounded-xl border border-white/15 bg-white/[0.04] p-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Founded", value: "1955 · Basel, Switzerland" },
              { label: "Network", value: "150+ offices · 50+ countries" },
              { label: "People", value: "2,500+ logistics experts" },
              { label: "Service lines", value: "Air · Ocean · Road · Rail" },
            ].map((fact) => (
              <div key={fact.label}>
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/45">
                  {fact.label}
                </p>
                <p className="mt-1 text-[12px] font-medium leading-tight text-white/85">{fact.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GUEST_TOUR_OPTIONS.map((tour, index) => {
              const Icon = guestTourIcons[tour.id];
              return (
                <motion.div
                  key={tour.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.07 }}
                  className="h-full"
                >
                  <Link
                    to={guestTourHref(tour.id)}
                    className="group flex h-full flex-col rounded-xl border border-white/15 bg-white/[0.06] p-5 transition-colors duration-300 hover:border-gold/60 hover:bg-white/[0.1]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-gold">
                        <Icon className="size-4" />
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                        {tour.duration}
                      </span>
                    </div>
                    <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
                      {tour.eyebrow}
                    </p>
                    <h3 className="mt-1 font-display text-base font-bold tracking-tight">
                      {tour.label}
                    </h3>
                    <p className="mt-2 flex-1 text-xs leading-5 text-white/70">{tour.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {tour.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2 text-[11px] leading-4 text-white/65">
                          <Check className="mt-0.5 size-3 shrink-0 text-gold" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80 transition-colors group-hover:text-gold">
                      Open walkthrough <ArrowRight className="size-3" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-6 border-t border-white/15 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
            No account needed · No Fracht records · Illustrative walkthrough
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default function Landing() {
  const session = usePublicSession();
  const isAuthenticated = session.status === "signed_in";
  // The decorative wheel stays static; visitors choose their journey detail.
  const dashboardHref = isAuthenticated ? "/dashboard" : "/auth?returnTo=%2Fdashboard";
  const startHref = isAuthenticated ? "/dashboard" : START_BASELINE_HREF;
  const catalogHref = isAuthenticated ? "/content" : "/auth?returnTo=%2Fcontent";

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Backdrop — white with pale blue fields and one navy ring field */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="ring-field ring-fade absolute inset-0 opacity-70"
          style={{ "--ring-cx": "82%", "--ring-cy": "12%" } as React.CSSProperties}
        />
        <div className="absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[-160px] top-[45%] h-[360px] w-[360px] rounded-full bg-gold/10 blur-[110px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <BrandWordmark compact />
          <div className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:flex">
            <a href="#loop" className="transition-colors hover:text-foreground">Lifecycle</a>
            <a href="#capabilities" className="transition-colors hover:text-foreground">Capabilities</a>
            <a href="#tour" className="transition-colors hover:text-foreground">Tour</a>
            <a href="#science" className="transition-colors hover:text-foreground">Why GWG</a>
            <a href="#catalog" className="transition-colors hover:text-foreground">Catalog</a>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/guest">Enter as guest</Link>
            </Button>
            {isAuthenticated ? (
              <Button asChild size="sm">
                <Link to="/dashboard">
                  Open dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/auth?returnTo=%2Fdashboard">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to={startHref}>
                    Start your baseline <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — split headline over the live ring diagram */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy px-3 py-1"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-80" />
                <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/90">
                Workforce development · measure and improve
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="mt-6 font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-[3.4rem]"
            >
              Workforce development,
              <br />
              <span className="text-primary">from onboarding to continuous learning —</span>
              <br />
              measured,{" "}
              <span className="relative inline-block">
                and proven.
                <svg
                  viewBox="0 0 220 12"
                  className="absolute -bottom-1 left-0 w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M4 8 C 60 2, 160 2, 216 7"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            >
              GWG is workforce development infrastructure for organizations. We start from how
              people actually learn — not from a procedure chopped into formats — so onboarding,
              role-based training, and continuous learning adapt to each person and are measured from
              a recorded starting point, with dated scorecards your managers, learning leaders, and
              compliance teams can review and export.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-7 flex flex-wrap items-center gap-2"
            >
              {["Onboarding at scale", "Role-based capability", "Continuous learning", "Dated scorecards"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="h-11 bg-navy px-6 text-sm font-semibold text-white hover:bg-navy-soft">
                <Link to={startHref}>
                  Start your baseline <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6 font-semibold">
                <Link to="/guest">See GWG in action</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-11 px-6 font-semibold">
                <Link to="/guest">Enter as guest</Link>
              </Button>
              <Link
                to={catalogHref}
                className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                Or browse the program catalog
              </Link>
            </motion.div>
          </div>

          <HeroRings />
        </div>
      </section>

      {/* Customer benefits */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-6">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-xl border border-navy/15 bg-navy px-6 py-6 sm:px-10"
        >
          <div
            className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-25"
            style={{ "--ring-cx": "88%", "--ring-cy": "20%" } as React.CSSProperties}
          />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                Workforce development infrastructure
              </p>
              <p className="mt-2 font-display text-lg font-semibold leading-snug text-white sm:text-xl">
                Onboarding, training, and continuous learning — in one system.
              </p>
              <p className="mt-1.5 text-sm leading-6 text-white/70">
                The market's answer is a procedure chopped into formats. Ours starts with the
                learner — one place to run the whole lifecycle, with evidence attached to every
                stage.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Assess", "Onboard", "Train", "Sustain", "Prove"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <Marquee />

      <PulseSection />

      {/* Customer journey */}
      <section id="loop" className="relative mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
            The development lifecycle
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            From first day to proven progress.
          </h2>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Assess capability, onboard, train, and keep development going — with progress
            managers and leaders can review at every stage.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Orbit ladder: rings tighten as the habit forms */}
          <div className="relative mx-auto aspect-square w-full max-w-90">
            {[100, 78, 56, 34].map((size, i) => (
              <motion.div
                key={size}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7, ease }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/25"
                style={{ width: `${size}%`, height: `${size}%` }}
              />
            ))}
            <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-navy text-center">
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/60">your</span>
              <span className="font-display text-xs font-bold tracking-[0.12em] text-white">GROWTH</span>
            </div>
            {/* gold arc marker on the outermost ring */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <path d="M 50 1 A 49 49 0 0 1 97 27" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <StageCards />
        </div>

        {/* The evidence rail — every step leaves a paper trail */}
        <motion.div {...fadeUp} className="mt-16 rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="font-display text-xl font-bold tracking-tight">
              Every stage leaves a record.
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              onboarding · training · continuous learning
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-0 sm:flex-row sm:items-center">
            {evidenceNodes.map((node, i) => (
              <div key={node} className="flex items-center sm:flex-1">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold",
                      i === 0 || i === evidenceNodes.length - 1
                        ? "border-gold bg-gold/10 text-gold-ink"
                        : "border-primary/40 bg-primary/5 text-primary",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-24 text-center text-[11px] leading-tight text-muted-foreground">
                    {node}
                  </span>
                </div>
                {i < evidenceNodes.length - 1 && (
                  <div className="mb-6 hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-primary/15 sm:block" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            Keep the starting point and the dated results available for review, so your next
            workforce development decision is planned on evidence rather than recollection.
          </p>
        </motion.div>
      </section>

      {/* Customer value — no model diagrams or illustrative performance claims. */}
      <section id="science" className="relative mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
            Why GWG
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Built around people. Focused on progress.
          </h2>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Run workforce development with less admin, training that fits the work, and evidence
            leaders can review — without adding another disconnected reporting process, and without
            gambling retention on a completion count.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <motion.div
            {...fadeUp}
            className="corner-tick relative overflow-hidden rounded-2xl border border-navy/80 bg-navy p-8 text-white shadow-sm"
          >
            <div className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-25" />
            <div className="relative">
              <OrbitMark size={104} className="text-primary" />
              <span className="mt-6 block font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                Development with direction
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                More than a course completed.
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Give people a path from onboarding through continuous learning, and give
                leaders a basis for development decisions they can defend.
              </p>
              <ul className="mt-6 space-y-3">
                {["Onboarding and training paths", "Continuous learning and practice", "Dated results to review"].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-white/85">
                    <Check className="size-4 shrink-0 text-gold" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {valueCards.map((card, i) => (
              <motion.div
                key={card.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group rounded-xl border border-border/70 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-md"
              >
                <h3 className="font-display text-sm font-bold">{card.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="relative mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
            Capabilities
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            One system for the whole development lifecycle.
          </h2>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Onboarding, role-based training, continuous learning — and the dated evidence leadership
            needs to review and fund the next cycle.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div
                className="ring-field pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ "--ring-cx": "70%", "--ring-cy": "30%" } as React.CSSProperties}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-navy group-hover:text-white">
                    <c.icon className="size-5" />
                  </div>
                  <span className="font-mono text-xs text-gold-ink">{c.n}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <TourSection />

      <CatalogSection />

      {/* LMS comparison */}
      <section className="relative mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
            Beyond completion-only reporting
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Completion is a milestone. Development is the goal.
          </h2>
        </motion.div>

        <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-xl border border-border/70">
          <div className="hidden grid-cols-[80px_1fr_1.2fr_1.2fr] bg-navy px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 md:grid">
            <span />
            <span>Dimension</span>
            <span className="text-gold">GWG</span>
            <span>Completion-only reporting</span>
          </div>
          {lmsRows.map((r, i) => (
            <div
              key={r.n}
              className={`grid gap-1 px-5 py-4 md:grid-cols-[80px_1fr_1.2fr_1.2fr] md:items-center md:gap-4 ${
                i % 2 === 0 ? "bg-card" : "bg-muted/40"
              } border-t border-border/50`}
            >
              <span className="font-mono text-xs text-gold-ink">{r.n}</span>
              <span className="text-sm font-semibold">{r.topic}</span>
              <span className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {r.gwg}
              </span>
              <span className="text-sm text-muted-foreground/80">{r.lms}</span>
            </div>
          ))}
          <p className="border-t border-border/50 bg-navy px-5 py-5 text-center text-sm leading-7 text-white/85 sm:text-base">
            Training is a journey, not an event. The organization that measures the journey owns the
            outcome — the organization that counts completions owns only a receipt.
          </p>
        </motion.div>
      </section>

      <GuestWalkthroughSection />

      {/* Final CTA — the navy brand block */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-2xl bg-navy p-10 text-center text-white shadow-xl sm:p-16"
        >
          <div
            className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-30"
            style={{ "--ring-cx": "50%", "--ring-cy": "0%" } as React.CSSProperties}
          />
          <div className="relative">
            <OrbitMark size={84} className="mx-auto text-primary" />
            <span className="mt-5 block font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
              Ready when you are
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Measure. Prove. Improve.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
              Start with a measured baseline for your workforce, develop your people from onboarding
              through continuous learning, and review progress with dated, exportable scorecards — so
              the next investment is decided on evidence, not on a completion report.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-11 bg-white px-7 font-semibold text-navy hover:bg-white/90">
                <Link to={startHref}>
                  Start your baseline <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 border-white/40 bg-transparent px-6 font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to={catalogHref}>Browse the catalog</Link>
              </Button>
            </div>
            <div className="mx-auto mt-8 max-w-xl border-t border-white/15 pt-6">
              <p className="text-sm italic leading-7 text-white/80">Development sticks when people can connect it to their work, discuss their progress, and see what comes next.</p>
            </div>
            <p className="mt-6 text-xs text-white/70">
              Already have an account?{" "}
              <Link to="/auth?returnTo=%2Fdashboard" className="underline underline-offset-4 hover:text-white">
                Sign in to your workspace
              </Link>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer — navy, fully branded */}
      <footer className="relative overflow-hidden bg-navy text-white">
        <div
          className="ring-field ring-fade pointer-events-none absolute inset-0 opacity-20"
          style={{ "--ring-cx": "8%", "--ring-cy": "110%" } as React.CSSProperties}
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <GwgLogo size={36} />
                <div className="leading-none">
                  <div className="font-display text-base font-bold tracking-[0.22em]">GWG</div>
                  <div className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.24em] text-white/60">
                    Workforce development
                  </div>
                </div>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
                Workforce development infrastructure for onboarding, training, and continuous
                learning — measured from a baseline and proven with dated scorecards.
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                Measure · Prove · Improve
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Platform</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to={catalogHref} className="text-white/75 transition-colors hover:text-white">Catalog</Link></li>
                <li><Link to="/verify" className="text-white/75 transition-colors hover:text-white">Verify a credential</Link></li>
                <li><Link to="/guest" className="text-white/75 transition-colors hover:text-white">Guest walkthrough</Link></li>
                <li><Link to={dashboardHref} className="text-white/75 transition-colors hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Account</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link to="/auth?returnTo=%2Fdashboard" className="text-white/75 transition-colors hover:text-white">Sign in</Link></li>
                <li><Link to="/auth?returnTo=%2Fdashboard" className="text-white/75 transition-colors hover:text-white">Create account</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Company</p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Built for organizations that treat development as a competitive advantage.
              </p>
              <p className="mt-4 text-xs text-white/50">© 2026 GWG. All rights reserved.</p>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              GWG Platform · Measure. Prove. Improve.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
              onboarding · training · continuous learning
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-primary" />
              <span className="inline-block size-1.5 rounded-full bg-primary/60" />
              <span className="inline-block size-1.5 rounded-full bg-primary/40" />
              <span className="inline-block size-1.5 rounded-full bg-gold" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
