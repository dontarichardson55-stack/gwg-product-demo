import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router";
import { BrandWordmark } from "@/components/gwg/bits";
import { Button } from "@/components/ui/button";

/**
 * Destination for links that point at signed-in or backend-backed surfaces.
 *
 * The demo has no Convex deployment, so instead of routing these CTAs back to
 * the landing page (which made the buttons look broken), each one lands here:
 * a real page that says what the surface is and where the visitor can go
 * instead. The guest walkthrough is the one interactive surface in the demo.
 */
export default function DemoNotice({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="ring-field ring-fade absolute inset-0 opacity-60"
          style={{ "--ring-cx": "80%", "--ring-cy": "10%" } as React.CSSProperties}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link to="/" aria-label="GWG demo home">
            <BrandWordmark compact />
          </Link>
          <span className="rounded-full border border-border/80 bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Product demo · sample data
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16">
        <div className="corner-tick rounded-2xl border border-border/80 bg-card p-8 shadow-sm sm:p-10">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-5" />
          </span>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{body}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 bg-navy px-6 font-semibold text-white hover:bg-navy-soft">
              <Link to="/guest">
                Take the guest walkthrough <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6 font-semibold">
              <Link to="/">
                <ArrowLeft className="size-4" /> Back to the landing page
              </Link>
            </Button>
          </div>

          <p className="mt-8 border-t border-border/60 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Self-guided demo · no sign-in · no customer records · view-only
          </p>
        </div>
      </main>
    </div>
  );
}
