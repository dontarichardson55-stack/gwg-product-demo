import { Check, ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DEMO_DIVISIONS,
  DIVISION_SHORT,
  learnerPaths,
  type Division,
} from "@/data/guestSample";

const DIVISIONS: Division[] = ["AIR", "OCEAN", "ROAD", "RAIL"];

const WEEK = [
  { id: "mon", day: "Mon", label: "Assignment opened" },
  { id: "tue", day: "Tue", label: "Practice completed" },
  { id: "wed", day: "Wed", label: "Question to manager" },
  { id: "thu", day: "Thu", label: "Retrieval review" },
  { id: "fri", day: "Fri", label: "Manager check-in" },
];

type Status = "Not started" | "In practice" | "Completed";

function statusFor(doneSteps: number, totalSteps: number): Status {
  if (doneSteps === 0) return "Not started";
  if (doneSteps === totalSteps) return "Completed";
  return "In practice";
}

/**
 * Interactive learner path.
 *
 * Each service line has its own illustrative learner at a real Fracht desk, with
 * illustrative assignments and steps. Ticking a step updates that division's
 * progress locally; the assignment's status is derived from the steps, never
 * stored. No requests, no persistence.
 */
export default function LearnerPath() {
  const [division, setDivision] = useState<Division>("AIR");
  const path = learnerPaths.find((entry) => entry.division === division) ?? learnerPaths[0];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [week, setWeek] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(path.assignments[0].id);

  const key = (stepId: string) => `${division}:${stepId}`;

  const allSteps = path.assignments.flatMap((assignment) => assignment.steps);
  const totalSteps = allSteps.length;
  const doneSteps = allSteps.filter((step) => done[key(step.id)]).length;
  const percent = totalSteps === 0 ? 0 : Math.round((doneSteps / totalSteps) * 100);

  const selectDivision = (next: Division) => {
    const nextPath = learnerPaths.find((entry) => entry.division === next) ?? learnerPaths[0];
    setDivision(next);
    setOpenId(nextPath.assignments[0].id);
  };

  const toggleStep = (stepId: string) => {
    setDone((current) => ({ ...current, [key(stepId)]: !current[key(stepId)] }));
  };

  const resetDivision = () => {
    setDone((current) => {
      const next = { ...current };
      for (const step of allSteps) delete next[key(step.id)];
      return next;
    });
    setWeek([]);
  };

  const toggleWeek = (id: string) => {
    setWeek((current) =>
      current.includes(id) ? current.filter((day) => day !== id) : [...current, id],
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Learner division
        </span>
        {DIVISIONS.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === division}
            onClick={() => selectDivision(item)}
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
              item === division
                ? "border-navy bg-navy text-white"
                : "border-border/80 bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {DIVISION_SHORT[item]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-navy/80 bg-navy p-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
              {DEMO_DIVISIONS[path.division]} · {path.desk}
            </span>
            <p className="mt-2 font-display text-xl font-bold tracking-tight">{path.learner}</p>
            <p className="mt-0.5 text-xs text-white/70">{path.role}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/55">
              Starting point → target
            </p>
            <p className="mt-1 font-display text-lg font-bold tabular-nums">
              {path.baseline} <span className="text-white/50">→</span>{" "}
              <span className="text-gold">{path.target}</span>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-white/60">
            <span>
              {doneSteps} of {totalSteps} steps complete
            </span>
            <span>{percent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-white/70">{path.coachNote}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          This week
        </h3>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={resetDivision}
          disabled={doneSteps === 0 && week.length === 0}
        >
          <RotateCcw className="size-3.5" /> Reset {DIVISION_SHORT[path.division]} progress
        </Button>
      </div>

      <ul className="flex flex-wrap gap-2">
        {WEEK.map((day) => {
          const checked = week.includes(day.id);
          return (
            <li key={day.id}>
              <button
                type="button"
                aria-pressed={checked}
                onClick={() => toggleWeek(day.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors",
                  checked
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border/60 bg-background text-muted-foreground hover:border-primary/30",
                )}
              >
                <span
                  className={cn(
                    "flex size-3.5 items-center justify-center rounded-full border",
                    checked ? "border-primary bg-primary text-white" : "border-border",
                  )}
                >
                  {checked ? <Check className="size-2.5" /> : null}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em]">{day.day}</span>
                {day.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2">
        {path.assignments.map((assignment) => {
          const stepsDone = assignment.steps.filter((step) => done[key(step.id)]).length;
          const status = statusFor(stepsDone, assignment.steps.length);
          const open = openId === assignment.id;
          const assignmentPercent = Math.round((stepsDone / assignment.steps.length) * 100);
          return (
            <div
              key={assignment.id}
              className={cn(
                "rounded-xl border transition-colors",
                open ? "border-primary/40 bg-primary/[0.03]" : "border-border/70 bg-card",
              )}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : assignment.id)}
                className="flex w-full items-start justify-between gap-3 p-4 text-left"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{assignment.title}</span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em]",
                        status === "Completed" && "border-primary/40 bg-primary/10 text-primary",
                        status === "In practice" && "border-gold/50 bg-gold/15 text-gold-ink",
                        status === "Not started" &&
                          "border-border/80 bg-background text-muted-foreground",
                      )}
                    >
                      {status}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Due {assignment.due} · {assignment.note}
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <span className="h-1 w-28 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-1 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${assignmentPercent}%` }}
                      />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                      {stepsDone}/{assignment.steps.length} steps
                    </span>
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>

              {open ? (
                <ul className="space-y-1.5 border-t border-border/60 px-4 py-3">
                  {assignment.steps.map((step) => {
                    const checked = Boolean(done[key(step.id)]);
                    return (
                      <li key={step.id}>
                        <button
                          type="button"
                          aria-pressed={checked}
                          aria-label={`${assignment.title}: ${step.label}`}
                          onClick={() => toggleStep(step.id)}
                          className="flex w-full items-center gap-2.5 rounded-lg border border-border/60 bg-background px-3 py-2 text-left text-xs transition-colors hover:border-primary/40"
                        >
                          <span
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border",
                              checked
                                ? "border-primary bg-primary text-white"
                                : "border-border text-transparent",
                            )}
                          >
                            <Check className="size-2.5" />
                          </span>
                          <span className={cn(checked && "text-muted-foreground line-through")}>
                            {step.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
        Progress stays in this browser tab · nothing is saved or sent
      </p>
    </div>
  );
}
