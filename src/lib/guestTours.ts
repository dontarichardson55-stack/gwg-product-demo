/**
 * Guest walkthrough access model.
 *
 * The guest portal is deliberately partial: it exposes the priority tools a
 * visitor needs to understand the product, and nothing that belongs to a
 * company workspace. Both the landing-page entry points and the portal itself
 * read from this one definition so a walkthrough cannot drift between them.
 */

export const GUEST_PRIORITY_SURFACES = [
  "dashboard",
  "learners",
  "programs",
  "scorecards",
  "learning",
  "coach",
  "profile",
  "activity",
  "classroom",
] as const;

export type GuestSurfaceId = (typeof GUEST_PRIORITY_SURFACES)[number];

export type GuestTourId = "classroom" | "learner" | "manager" | "evidence";

export type GuestTourOption = {
  id: GuestTourId;
  label: string;
  eyebrow: string;
  description: string;
  duration: string;
  sections: readonly GuestSurfaceId[];
  start: GuestSurfaceId;
  highlights: readonly string[];
};

export const GUEST_TOUR_OPTIONS: readonly GuestTourOption[] = [
  {
    id: "classroom",
    label: "Virtual Classroom",
    eyebrow: "Flagship walkthrough",
    description:
      "Step into a facilitated session. Drive the deck, hear the slide narration, and mark up the local practice board inside a sample session built around a Fracht service line.",
    duration: "5 min",
    sections: ["classroom", "learning", "coach"],
    start: "classroom",
    highlights: ["Drive the slide deck", "Play slide narration", "Try the practice board"],
  },
  {
    id: "learner",
    label: "Learner path",
    eyebrow: "Learner view",
    description:
      "See the week a Fracht learner sees: what is due, what comes next, and where to take a real question between sessions.",
    duration: "3 min",
    sections: ["dashboard", "learning", "coach", "profile"],
    start: "learning",
    highlights: ["Learning schedule", "Manager note", "Recorded starting point"],
  },
  {
    id: "manager",
    label: "Manager view",
    eyebrow: "Team overview",
    description:
      "Read capability across desks and offices, follow program progress, and see each person's next review.",
    duration: "3 min",
    sections: ["dashboard", "learners", "programs", "activity"],
    start: "dashboard",
          highlights: ["Desk capability", "Program progress", "Next review dates"],
  },
  {
    id: "evidence",
    label: "Evidence & scorecards",
    eyebrow: "Evidence view",
    description:
      "Compare measured programs from their starting point to dated scorecards.",
    duration: "3 min",
    sections: ["scorecards", "programs", "profile"],
    start: "scorecards",
    highlights: ["Dated scorecards", "Starting point vs measured", "Program evidence"],
  },
] as const;

/** Surfaces that stay closed to guests even inside the preview portal. */
export const GUEST_LOCKED_SURFACES: readonly { label: string; detail: string }[] = [
  {
    label: "Administration",
    detail: "Members, billing, connected tools and company settings require a signed-in company account.",
  },
  {
    label: "Workforce intelligence",
    detail: "Workforce activity stays inside a signed-in company workspace.",
  },
] as const;

/** What a guest walkthrough never displays, stated on the portal itself. */
export const GUEST_EXCLUSIONS: readonly string[] = [
  "Customer and learner records",
  "Account, organization and billing settings",
  "Connected-tool details and account settings",
  "Live coaching conversations, exports and administrative actions",
] as const;

export function guestTourHref(id: GuestTourId): string {
  return `/guest?tour=${id}`;
}

export function findGuestTour(id: string | null | undefined): GuestTourOption | null {
  if (!id) return null;
  return GUEST_TOUR_OPTIONS.find((tour) => tour.id === id) ?? null;
}
