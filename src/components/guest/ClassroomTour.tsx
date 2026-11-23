import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClassroomSession } from "@/data/guestSample";
import {
  classroomSessions,
  DEMO_DIVISIONS,
  DIVISION_SHORT,
  type Division,
} from "@/data/guestSample";

const DIVISIONS: Division[] = ["AIR", "OCEAN", "ROAD", "RAIL"];

function preferredEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  try {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((voice) => /^en(-|_)/i.test(voice.lang) && voice.localService) ??
      voices.find((voice) => /^en(-|_)/i.test(voice.lang)) ??
      null
    );
  } catch {
    return null;
  }
}

/**
 * Interactive Virtual Classroom.
 *
 * Three local interactions on illustrative data framed around Fracht Group's
 * four service lines: drive the deck, play the audio narration with a synced
 * transcript, and mark the practice board. Everything is component state — no
 * requests, no persistence, and nothing from a Fracht system.
 */
export default function ClassroomTour() {
  const [division, setDivision] = useState<Division>("AIR");
  const session =
    classroomSessions.find((entry) => entry.division === division) ?? classroomSessions[0];
  const [slideIndex, setSlideIndex] = useState(0);
  const [marks, setMarks] = useState<string[]>([]);
  const [spoken, setSpoken] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [playing, setPlaying] = useState(false);

  const total = session.slides.length;
  const slide = session.slides[slideIndex];
  const finished = spoken >= slide.narration.length;
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Voices load asynchronously in several browsers; asking for them on mount
  // means the first Play click usually has the English voice ready.
  useEffect(() => {
    if (!speechSupported) return;
    const load = () => {
      window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [speechSupported]);

  // Speak each line in an English voice and reveal it as it starts. A missing
  // voice, a failed utterance or a voice that never ends falls back to a timer
  // or a watchdog so the transcript can never stall.
  useEffect(() => {
    if (!playing) return;
    if (spoken >= slide.narration.length) {
      setPlaying(false);
      return;
    }

    const line = slide.narration[spoken];
    const voice = speechSupported ? preferredEnglishVoice() : null;
    let cancelled = false;
    let settled = false;
    let fallback: number | undefined;
    let watchdog: number | undefined;
    setRevealed(spoken + 1);

    const clearTimers = () => {
      window.clearTimeout(fallback);
      window.clearTimeout(watchdog);
    };
    const advance = () => {
      if (!cancelled) setSpoken((count) => count + 1);
    };
    const finishLine = () => {
      if (cancelled || settled) return;
      settled = true;
      clearTimers();
      advance();
    };
    const useFallback = () => {
      if (cancelled || settled) return;
      clearTimeout(watchdog);
      fallback = window.setTimeout(finishLine, 1800);
    };

    if (voice) {
      try {
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.voice = voice;
        utterance.lang = voice.lang || "en-US";
        utterance.rate = 0.98;
        utterance.onend = finishLine;
        utterance.onerror = useFallback;
        watchdog = window.setTimeout(
          finishLine,
          Math.min(12000, Math.max(5000, line.length * 90 + 2500)),
        );
        window.speechSynthesis.speak(utterance);
      } catch {
        useFallback();
      }
    } else {
      useFallback();
    }

    return () => {
      cancelled = true;
      clearTimers();
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [playing, spoken, slide, speechSupported]);

  const selectDivision = (next: Division) => {
    setDivision(next);
    setSlideIndex(0);
    setMarks([]);
    setSpoken(0);
    setRevealed(0);
    setPlaying(false);
  };

  const goTo = (next: number) => {
    setSlideIndex(next);
    setSpoken(0);
    setRevealed(0);
    setPlaying(false);
  };

  const play = () => {
    if (finished) {
      setSpoken(0);
      setRevealed(0);
    }
    setPlaying(true);
  };

  const restart = () => {
    setSpoken(0);
    setRevealed(0);
    setPlaying(false);
  };

  const toggleMark = (id: string) => {
    setMarks((current) =>
      current.includes(id) ? current.filter((mark) => mark !== id) : [...current, id],
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Session division
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
            {DEMO_DIVISIONS[session.division]} · {session.desk} · sample session
          </span>
          <span className="rounded-full border border-gold/50 bg-gold/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-gold">
            {session.duration} · {total} slides
          </span>
        </div>
        <p className="mt-3 font-display text-xl font-bold tracking-tight">{session.title}</p>
        <p className="mt-1 text-xs text-white/70">{session.facilitator}</p>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
          Session brief
        </span>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              Format
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground">
              Facilitated deck and a practice board.
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              Path
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground">
              Baseline → next session.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Slide {slide.n} of {String(total).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-label="Previous slide"
              disabled={slideIndex === 0}
              onClick={() => goTo(slideIndex - 1)}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-label="Next slide"
              disabled={slideIndex === total - 1}
              onClick={() => goTo(slideIndex + 1)}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">{slide.title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{slide.body}</p>

        <LaneVisual lane={session.lane} />

        <div className="mt-4 flex items-center gap-1.5" role="group" aria-label="Slides">
          {session.slides.map((entry, index) => (
            <button
              key={entry.n}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === slideIndex ? "true" : undefined}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === slideIndex ? "w-6 bg-navy" : "w-3 bg-border hover:bg-primary/40",
              )}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Slide narration · audio + transcript
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              {revealed} of {slide.narration.length} lines
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => (playing ? setPlaying(false) : play())}
            >
              {playing ? (
                <>
                  <Pause className="size-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-3.5" /> Play narration
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label="Restart narration"
              onClick={restart}
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        <ul aria-live="polite" className="mt-3 space-y-2">
          {slide.narration.map((line, index) => (
            <li
              key={line}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs leading-5 transition-opacity",
                index < revealed
                  ? "border-border/60 bg-background text-foreground"
                  : "border-dashed border-border/60 text-muted-foreground/50",
              )}
            >
              {index < revealed ? line : "· · ·"}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border/70 bg-background p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
              Practice board
            </span>
            <p className="mt-1 text-sm font-medium">{session.practice.prompt}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{session.practice.hint}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              {marks.length} {marks.length === 1 ? "mark" : "marks"}
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setMarks([])}
              disabled={marks.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {session.practice.zones.map((zone) => {
            const order = marks.indexOf(zone.id);
            const marked = order >= 0;
            return (
              <button
                key={zone.id}
                type="button"
                aria-pressed={marked}
                aria-label={`${zone.label} — ${zone.note}`}
                onClick={() => toggleMark(zone.id)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-left transition-colors",
                  marked
                    ? "border-gold bg-gold/10"
                    : "border-border/60 bg-card hover:border-primary/40",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium">{zone.label}</span>
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[9px]",
                      marked
                        ? "border-gold bg-gold text-navy"
                        : "border-border text-muted-foreground/50",
                    )}
                  >
                    {marked ? order + 1 : "+"}
                  </span>
                </span>
                <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">
                  {zone.note}
                </span>
              </button>
            );
          })}
        </div>

        {marks.length >= 2 && (
          <div className="mt-3 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
              Sample facilitator debrief
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              A facilitator would ask why you chose those zones and how they connect to the session
              objective.
            </p>
          </div>
        )}

        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/70">
          Marks stay in this browser tab · nothing is saved or sent
        </p>
      </div>
    </div>
  );
}

/** A deliberately simple lane sketch: enough to orient the session, not a routing plan. */
function LaneVisual({ lane }: { lane: ClassroomSession["lane"] }) {
  return (
    <figure className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-navy">
      <svg
        viewBox="0 0 320 150"
        role="img"
        aria-label={`Sample lane: ${lane.from} to ${lane.to}`}
        className="h-auto w-full"
      >
        <title>{`Sample lane: ${lane.from} to ${lane.to}`}</title>
        <g stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <circle cx="46" cy="76" r="12" />
          <circle cx="274" cy="76" r="12" />
          <path d="M60 76 H258" strokeDasharray="5 7" />
          <path d="M250 69 L260 76 L250 83" />
        </g>
        <g fill="#D4A64A">
          <circle cx="46" cy="76" r="5" />
          <circle cx="274" cy="76" r="5" />
          <circle cx="160" cy="76" r="4" />
        </g>
        <g fill="rgba(255,255,255,0.55)" fontSize="8.5" fontFamily="ui-monospace, SFMono-Regular, monospace">
          <text x="46" y="106" textAnchor="middle">ORIGIN</text>
          <text x="274" y="106" textAnchor="middle">DESTINATION</text>
          <text x="160" y="64" textAnchor="middle">MILESTONE</text>
        </g>
      </svg>
      <div className="grid gap-2 border-t border-white/10 px-3 py-2.5 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">Lane</p>
          <p className="mt-0.5 text-[11px] text-white/80">
            {lane.from} → {lane.to}
          </p>
        </div>
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">Mode</p>
          <p className="mt-0.5 text-[11px] text-white/80">{lane.mode}</p>
        </div>
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">Focus</p>
          <p className="mt-0.5 text-[11px] text-white/80">{lane.detail}</p>
        </div>
      </div>
      <figcaption className="border-t border-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
        Sample lane visual · illustrative, not a real routing plan
      </figcaption>
    </figure>
  );
}
