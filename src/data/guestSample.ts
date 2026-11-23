/**
 * ILLUSTRATIVE DATA for the public demo's guest walkthrough.
 *
 * Fracht Group is a real company: a Swiss, family-owned international freight
 * forwarder and NVOCC founded in 1955 and headquartered in Basel. The company
 * profile facts used here — founding, ownership, office and country counts,
 * service lines, the Houston project-rail team, Fracht Forward and the public
 * awards — come from Fracht Group's own website and published reports.
 *
 * Everything recorded AGAINST the company is illustrative and was created for
 * this demo: the named staff, learners, scores, dates, certificates, sealed
 * scorecards and classroom sessions. No Fracht employee supplied them, and
 * nothing here is read from or written to a Fracht system.
 *
 * Industry content (IATA DGR recurrent training, ISF/AMS filing deadlines,
 * Incoterms 2020, US de minimis suspension, EU parcel duty, Suez/Hormuz
 * routing) reflects the public rules and market as of November 2026. It is
 * training context, not legal or customs advice.
 *
 * Desks are real Fracht locations (Basel HQ, Hamburg, Houston, Singapore).
 * The desk map below is the only place they are written.
 */

export type Division = "AIR" | "OCEAN" | "ROAD" | "RAIL";

export type SampleTeamRow = {
  name: string;
  role: string;
  desk: string;
  division: Division;
  baseline: number;
  current: number;
  nextReview: string;
  support: "On track" | "Watch" | "Needs support";
};

export type SampleScorecard = {
  code: string;
  program: string;
  division: Division;
  desk: string;
  sealed: string;
  covered: number;
  baseline: number;
  measured: number;
  digest: string;
};

export type SampleDivisionRow = {
  division: Division;
  desk: string;
  program: string;
  cohort: number;
  baseline: number;
  measured: number;
  sealed: string;
};

/** The four Fracht service lines the walkthrough is built around. */
export const DEMO_DIVISIONS = {
  AIR: "Air Freight",
  OCEAN: "Ocean Freight",
  ROAD: "Road Freight",
  RAIL: "Rail Freight",
} as const satisfies Record<Division, string>;

/** Short labels for the division switcher. */
export const DIVISION_SHORT: Record<Division, string> = {
  AIR: "Air",
  OCEAN: "Ocean",
  ROAD: "Road",
  RAIL: "Rail",
};

/**
 * Real Fracht desks used by the illustrative records. Nothing here is a
 * statement about headcount or performance at that office.
 */
export const DEMO_DESKS = {
  AIR: "Basel HQ",
  OCEAN: "Hamburg",
  ROAD: "Basel HQ",
  RAIL: "Houston",
} as const satisfies Record<Division, string>;

/* --------------------------------------------------------- Virtual Classroom */

export type ClassroomSlide = {
  n: string;
  title: string;
  body: string;
  /** Spoken lines, revealed one at a time by the demo's narration control. */
  narration: string[];
};

export type ClassroomZone = {
  id: string;
  label: string;
  note: string;
};

export type ClassroomLane = {
  from: string;
  to: string;
  mode: string;
  detail: string;
};

export type ClassroomSession = {
  division: Division;
  desk: string;
  title: string;
  facilitator: string;
  duration: string;
  lane: ClassroomLane;
  slides: ClassroomSlide[];
  practice: {
    prompt: string;
    hint: string;
    zones: ClassroomZone[];
  };
};

/* -------------------------------------------------------------- learner path */

export type LearnerStep = {
  id: string;
  label: string;
};

export type LearnerAssignment = {
  id: string;
  title: string;
  due: string;
  note: string;
  steps: LearnerStep[];
};

export type LearnerPath = {
  division: Division;
  desk: string;
  learner: string;
  role: string;
  baseline: number;
  target: number;
  coachNote: string;
  assignments: LearnerAssignment[];
};

/* -------------------------------------------------------------- walkthrough */

const divisionSeeds: Omit<SampleDivisionRow, "desk">[] = [
  {
    division: "AIR",
    program: "DG acceptance — IATA DGR 7.3",
    cohort: 28,
    baseline: 46,
    measured: 82,
    sealed: "18 Nov 2026",
  },
  {
    division: "OCEAN",
    program: "NVOCC documentation & ISF/AMS filing",
    cohort: 34,
    baseline: 41,
    measured: 78,
    sealed: "13 Nov 2026",
  },
  {
    division: "ROAD",
    program: "Incoterms 2020 & cross-border quoting",
    cohort: 22,
    baseline: 38,
    measured: 74,
    sealed: "06 Nov 2026",
  },
  {
    division: "RAIL",
    program: "Project rail load engineering",
    cohort: 12,
    baseline: 35,
    measured: 81,
    sealed: "30 Oct 2026",
  },
];

export const sampleDivisions: SampleDivisionRow[] = divisionSeeds.map((row) => ({
  ...row,
  desk: DEMO_DESKS[row.division],
}));

const teamSeeds: Omit<SampleTeamRow, "desk">[] = [
  {
    name: "M. Brunner",
    role: "Air export agent",
    division: "AIR",
    baseline: 46,
    current: 71,
    nextReview: "27 Nov 2026",
    support: "On track",
  },
  {
    name: "A. Okafor",
    role: "Ocean import coordinator",
    division: "OCEAN",
    baseline: 41,
    current: 63,
    nextReview: "24 Nov 2026",
    support: "Watch",
  },
  {
    name: "J. Castillo",
    role: "Customs entry writer",
    division: "OCEAN",
    baseline: 52,
    current: 77,
    nextReview: "02 Dec 2026",
    support: "On track",
  },
  {
    name: "K. Tanaka",
    role: "Project rail engineer",
    division: "RAIL",
    baseline: 35,
    current: 58,
    nextReview: "01 Dec 2026",
    support: "Needs support",
  },
  {
    name: "S. Ferreira",
    role: "Cross-border dispatcher",
    division: "ROAD",
    baseline: 44,
    current: 69,
    nextReview: "03 Dec 2026",
    support: "On track",
  },
];

export const sampleTeam: SampleTeamRow[] = teamSeeds.map((row) => ({
  ...row,
  desk: DEMO_DESKS[row.division],
}));

const scorecardSeeds: Omit<SampleScorecard, "desk">[] = [
  {
    code: "FRT-SC-001",
    program: "DG acceptance — IATA DGR 7.3",
    division: "AIR",
    sealed: "18 Nov 2026",
    covered: 28,
    baseline: 46,
    measured: 82,
    digest: "demo:sha256:4c1a…",
  },
  {
    code: "FRT-SC-002",
    program: "NVOCC documentation & ISF/AMS filing",
    division: "OCEAN",
    sealed: "13 Nov 2026",
    covered: 34,
    baseline: 41,
    measured: 78,
    digest: "demo:sha256:9f03…",
  },
  {
    code: "FRT-SC-003",
    program: "Incoterms 2020 & cross-border quoting",
    division: "ROAD",
    sealed: "06 Nov 2026",
    covered: 22,
    baseline: 38,
    measured: 74,
    digest: "demo:sha256:2b7d…",
  },
  {
    code: "FRT-SC-004",
    program: "Project rail load engineering",
    division: "RAIL",
    sealed: "30 Oct 2026",
    covered: 12,
    baseline: 35,
    measured: 81,
    digest: "demo:sha256:6e91…",
  },
];

export const sampleScorecards: SampleScorecard[] = scorecardSeeds.map((row) => ({
  ...row,
  desk: DEMO_DESKS[row.division],
}));

const learnerSeeds: Omit<LearnerPath, "desk">[] = [
  {
    division: "AIR",
    learner: "L. Meier",
    role: "Air export agent",
    baseline: 46,
    target: 82,
    coachNote:
      "Recurrent DGR training is the gate: the 24-month clock closes in December, and lithium batteries are the next acceptance drill.",
    assignments: [
      {
        id: "air-dgr",
        title: "DGR 7.3 — recurrent acceptance",
        due: "27 Nov 2026",
        note: "The 67th edition applies from 1 January 2026; recurrent training is due within 24 months.",
        steps: [
          { id: "air-d1", label: "Read the DGR 67th edition changes" },
          { id: "air-d2", label: "Work the acceptance checklist drill" },
          { id: "air-d3", label: "Sit the 7.3 competency assessment" },
        ],
      },
      {
        id: "air-lithium",
        title: "Lithium batteries — UN3480 / UN3481",
        due: "01 Dec 2026",
        note: "Section II consignments are the most common acceptance error at the counter.",
        steps: [
          { id: "air-l1", label: "Classify the two battery types" },
          { id: "air-l2", label: "Check the state-of-charge limit" },
          { id: "air-l3", label: "Complete the acceptance checklist" },
        ],
      },
      {
        id: "air-tariff",
        title: "2026 tariff & de minimis update",
        due: "04 Dec 2026",
        note: "US de minimis is suspended and the EU parcel duty changed on 1 July 2026.",
        steps: [
          { id: "air-t1", label: "Review the effective-dated rules" },
          { id: "air-t2", label: "Re-quote two live consignments" },
        ],
      },
    ],
  },
  {
    division: "OCEAN",
    learner: "A. Okafor",
    role: "Ocean import coordinator",
    baseline: 41,
    target: 78,
    coachNote:
      "ISF is the next assessment — two late filings last month. Free-time and the Suez/Hormuz exception playbook follow.",
    assignments: [
      {
        id: "ocean-isf",
        title: "NVOCC documentation & ISF/AMS",
        due: "24 Nov 2026",
        note: "ISF and ocean AMS are both due 24 hours before loading at the foreign port.",
        steps: [
          { id: "ocean-i1", label: "Map the eight ISF data elements" },
          { id: "ocean-i2", label: "File the practice ISF" },
          { id: "ocean-i3", label: "Review the reject queue" },
        ],
      },
      {
        id: "ocean-demurrage",
        title: "Demurrage & detention control",
        due: "28 Nov 2026",
        note: "Free-time clocks start at discharge, not at booking.",
        steps: [
          { id: "ocean-d1", label: "Read the free-time matrix" },
          { id: "ocean-d2", label: "Work the exception case" },
          { id: "ocean-d3", label: "Set the alert thresholds" },
        ],
      },
      {
        id: "ocean-routing",
        title: "Suez return & Hormuz exception playbook",
        due: "02 Dec 2026",
        note: "Suez capacity is returning while Hormuz remains restricted; routing and war-risk cost both move.",
        steps: [
          { id: "ocean-r1", label: "Review the routing options" },
          { id: "ocean-r2", label: "Apply the war-risk cost line" },
          { id: "ocean-r3", label: "Draft the customer notice" },
        ],
      },
    ],
  },
  {
    division: "ROAD",
    learner: "S. Ferreira",
    role: "Cross-border dispatcher",
    baseline: 44,
    target: 76,
    coachNote:
      "Incoterms quoting is solid. ADR paperwork and transit guarantees need a check before the next cross-border lane goes live.",
    assignments: [
      {
        id: "road-incoterms",
        title: "Incoterms 2020 — quoting",
        due: "26 Nov 2026",
        note: "Moving CIF to DDP adds import duty, VAT and import clearance to the seller's side.",
        steps: [
          { id: "road-i1", label: "Review the 11 rules" },
          { id: "road-i2", label: "Re-quote the CIF lane as DDP" },
          { id: "road-i3", label: "Check the risk-transfer point" },
        ],
      },
      {
        id: "road-adr",
        title: "ADR awareness for road",
        due: "30 Nov 2026",
        note: "Road dangerous goods follow ADR, not the IATA DGR.",
        steps: [
          { id: "road-a1", label: "Read the ADR classes" },
          { id: "road-a2", label: "Complete the tunnel-code drill" },
          { id: "road-a3", label: "Check the vehicle kit" },
        ],
      },
      {
        id: "road-transit",
        title: "Customs transit — T1 & TIR",
        due: "03 Dec 2026",
        note: "A transit movement closes at the office of destination, not at the border.",
        steps: [
          { id: "road-t1", label: "Open the T1 drill" },
          { id: "road-t2", label: "Match the guarantee" },
          { id: "road-t3", label: "Close the movement" },
        ],
      },
    ],
  },
  {
    division: "RAIL",
    learner: "K. Tanaka",
    role: "Project rail engineer",
    baseline: 35,
    target: 81,
    coachNote:
      "Load engineering is strong; route clearance is the gap. The 308-tonne transformer case is the next walkthrough.",
    assignments: [
      {
        id: "rail-load",
        title: "Rail load engineering",
        due: "01 Dec 2026",
        note: "Axle load, deck height and route clearance decide the car — not the sailing schedule.",
        steps: [
          { id: "rail-l1", label: "Review the car types" },
          { id: "rail-l2", label: "Calculate the axle load" },
          { id: "rail-l3", label: "Select the car for the case" },
        ],
      },
      {
        id: "rail-transformer",
        title: "308-tonne transformer case",
        due: "05 Dec 2026",
        note: "Izmir to Houston by sea, then rail to Wyoming; 200+ complex rail moves run each year.",
        steps: [
          { id: "rail-t1", label: "Read the case pack" },
          { id: "rail-t2", label: "Mark the transshipment risks" },
          { id: "rail-t3", label: "Compare with the 260-tonne move" },
        ],
      },
      {
        id: "rail-permits",
        title: "Permits & route clearance",
        due: "08 Dec 2026",
        note: "Clearance is checked against the loaded geometry, not the empty railcar.",
        steps: [
          { id: "rail-p1", label: "Read the clearance envelope" },
          { id: "rail-p2", label: "Walk the route survey" },
          { id: "rail-p3", label: "Log the permit dependencies" },
        ],
      },
    ],
  },
];

export const learnerPaths: LearnerPath[] = learnerSeeds.map((path) => ({
  ...path,
  desk: DEMO_DESKS[path.division],
}));

/* ----------------------------------------------------------- classroom decks */

const classroomSeeds: Omit<ClassroomSession, "desk">[] = [
  {
    division: "AIR",
    title: "Accepting a DG consignment",
    facilitator: "Fracht Air · Basel DG desk",
    duration: "5 min",
    lane: {
      from: "Frankfurt (FRA)",
      to: "Houston (IAH)",
      mode: "Charter · 100 kg to 100 t",
      detail: "DG acceptance · 24-month recurrent",
    },
    slides: [
      {
        n: "01",
        title: "What this session covers",
        body: "Session two of three in the DGR 7.3 path, ending in an acceptance drill on a document pack.",
        narration: [
          "This is session two of three in the dangerous goods acceptance path.",
          "It builds on the recurrent training and ends with one acceptance drill.",
        ],
      },
      {
        n: "02",
        title: "The 24-month clock",
        body: "IATA DGR recurrent training is due within 24 months of the previous course, and training records are kept for at least 36 months.",
        narration: [
          "Recurrent training is due within twenty-four months of your last course.",
          "The record is kept for thirty-six months and must be available to the authority.",
        ],
      },
      {
        n: "03",
        title: "Practice: stop the acceptance",
        body: "Mark the two items in the pack that must stop acceptance at the counter, then compare with the DGR checklist.",
        narration: [
          "Take the document pack below and mark the two items that must stop acceptance.",
          "Nothing here is scored; your marks are compared with the checklist in the debrief.",
        ],
      },
      {
        n: "04",
        title: "Debrief and record",
        body: "The facilitator compares the marks with the acceptance checklist and records the next step on the learner path.",
        narration: [
          "In the live session the pack is reviewed against the checklist, not scored.",
          "The debrief names the error behind each mark and records one next step.",
        ],
      },
      {
        n: "05",
        title: "Questions and follow-up",
        body: "The annual DGR edition briefing sits between formal recerts; questions go to the DG desk.",
        narration: [
          "Because the DGR is republished every year, an edition briefing sits between recerts.",
          "Questions between sessions go to the DG desk.",
        ],
      },
    ],
    practice: {
      prompt: "Mark the two items that must stop acceptance.",
      hint: "Example answer: UN number missing, and packing group mismatch.",
      zones: [
        { id: "un-missing", label: "UN number missing", note: "No UN number or proper shipping name" },
        { id: "pg-mismatch", label: "Packing group mismatch", note: "PG II declared, PG III packed" },
        { id: "quantity-ok", label: "Net quantity within limit", note: "Within the cargo limit" },
        { id: "dgd-signed", label: "Shipper declaration signed", note: "Signed by a trained shipper" },
        { id: "battery-mark", label: "Lithium battery mark", note: "Present on the outer package" },
        { id: "overpack-label", label: "Overpack label", note: "Applied and visible" },
      ],
    },
  },
  {
    division: "OCEAN",
    title: "ISF and the 24-hour clock",
    facilitator: "Fracht Ocean · Hamburg import desk",
    duration: "4 min",
    lane: {
      from: "Shanghai (CNSHA)",
      to: "Hamburg (DEHAM)",
      mode: "FCL · NVOCC bill of lading",
      detail: "ISF/AMS · 24 h before loading",
    },
    slides: [
      {
        n: "01",
        title: "Session overview",
        body: "Session one of three for ocean import. The filing clock is the whole session, and it starts before the vessel loads.",
        narration: [
          "This is the first of three sessions for ocean import.",
          "The filing clock is the subject: it starts before the vessel loads.",
        ],
      },
      {
        n: "02",
        title: "Two filings, two deadlines",
        body: "ISF carries eight importer security elements and is due 24 hours before loading. Ocean AMS is also due 24 hours before loading at the foreign port.",
        narration: [
          "ISF carries eight importer security elements and is due twenty-four hours before loading.",
          "Ocean AMS is a separate carrier filing and is due twenty-four hours before loading too.",
        ],
      },
      {
        n: "03",
        title: "Practice: mark the late filings",
        body: "Mark the two filings in the queue that would miss the deadline, then compare with the clock in the debrief.",
        narration: [
          "Mark the two filings below that would miss the deadline.",
          "The facilitator compares your marks with the filing clock.",
        ],
      },
      {
        n: "04",
        title: "Debrief and record",
        body: "The debrief separates ISF from AMS, names the deadline that was missed, and records the next filing drill.",
        narration: [
          "ISF is importer security data; AMS is the carrier manifest. They are not the same filing.",
          "The next filing drill is recorded on the learner path.",
        ],
      },
      {
        n: "05",
        title: "Follow-up",
        body: "Demurrage and detention control follows, then the Suez return and Hormuz exception playbook.",
        narration: [
          "Next is demurrage and detention control.",
          "After that, the routing playbook covers Suez and Hormuz exceptions.",
        ],
      },
    ],
    practice: {
      prompt: "Mark the two filings that would miss the deadline.",
      hint: "Example answer: ISF at vessel arrival, and AMS after departure.",
      zones: [
        { id: "isf-24h", label: "ISF 24 h before loading", note: "On time" },
        { id: "isf-arrival", label: "ISF at vessel arrival", note: "Late by the whole transit" },
        { id: "ams-24h", label: "Ocean AMS 24 h before loading", note: "On time" },
        { id: "ams-departure", label: "AMS after departure", note: "Misses the 24-hour rule" },
        { id: "isf-48h", label: "ISF 48 h before loading", note: "On time" },
        { id: "entry-discharge", label: "Entry filed at discharge", note: "A separate step, not ISF or AMS" },
      ],
    },
  },
  {
    division: "ROAD",
    title: "Incoterms that change the quote",
    facilitator: "Fracht Road · Basel cross-border desk",
    duration: "4 min",
    lane: {
      from: "Basel",
      to: "Milan",
      mode: "FTL · cross-border",
      detail: "Incoterms 2020 · T1 transit",
    },
    slides: [
      {
        n: "01",
        title: "Session overview",
        body: "Incoterms decide cost, risk and who clears what. This session is about the quote that follows from that choice.",
        narration: [
          "Incoterms decide cost, risk and who clears what.",
          "This session is about the quote that has to follow the term.",
        ],
      },
      {
        n: "02",
        title: "CIF is not DDP",
        body: "CIF ends at the destination port and risk passes on loading. DDP delivers cleared, with the seller as importer of record.",
        narration: [
          "CIF ends at the destination port, and risk passes when the goods are loaded.",
          "DDP delivers cleared: the seller is the importer of record and carries duty and VAT.",
        ],
      },
      {
        n: "03",
        title: "Practice: mark what DDP adds",
        body: "Mark the two obligations the seller takes on when a CIF quote becomes DDP, then compare with the quote sheet.",
        narration: [
          "Mark the two obligations the seller takes on when the quote moves from CIF to DDP.",
          "The facilitator compares your marks with the quote sheet.",
        ],
      },
      {
        n: "04",
        title: "Debrief and record",
        body: "The debrief separates cost from risk and records the lane to re-quote on the learner path.",
        narration: [
          "The debrief separates the cost lines from the risk-transfer point.",
          "One lane is recorded to re-quote before the next session.",
        ],
      },
      {
        n: "05",
        title: "Follow-up",
        body: "ADR awareness follows, then customs transit with T1 and TIR.",
        narration: [
          "Next is ADR awareness for road dangerous goods.",
          "Then customs transit: T1 and TIR.",
        ],
      },
    ],
    practice: {
      prompt: "Mark the two obligations DDP adds to a CIF quote.",
      hint: "Example answer: import duty & VAT, and import clearance.",
      zones: [
        { id: "duty-vat", label: "Import duty & VAT", note: "Seller becomes importer of record" },
        { id: "import-clearance", label: "Import clearance", note: "Seller clears at destination" },
        { id: "main-carriage", label: "Main carriage", note: "Already in the CIF quote" },
        { id: "export-clearance", label: "Export clearance", note: "Already the seller's job" },
        { id: "marine-insurance", label: "Marine insurance", note: "CIF requires seller-paid cover" },
        { id: "origin-loading", label: "Loading at origin", note: "Already in the CIF quote" },
      ],
    },
  },
  {
    division: "RAIL",
    title: "Engineering a 308-tonne transformer",
    facilitator: "Fracht Rail · Houston project desk",
    duration: "5 min",
    lane: {
      from: "Houston",
      to: "Medicine Bow, WY",
      mode: "Rail · 16-axle flatcar",
      detail: "308 t transformer · route clearance",
    },
    slides: [
      {
        n: "01",
        title: "Session overview",
        body: "Session three of four in project rail. The car is chosen from the load and the route, not from the sailing schedule.",
        narration: [
          "This is session three of four in project rail.",
          "The car is chosen from the load and the route, not from the sailing schedule.",
        ],
      },
      {
        n: "02",
        title: "The numbers that decide the car",
        body: "Axle load, deck height and route clearance decide the car. Fracht's Houston team runs more than 200 complex rail moves a year on 12-, 16- and 20-axle equipment.",
        narration: [
          "Axle load, deck height and route clearance decide the car.",
          "The Houston team runs more than two hundred complex rail moves a year.",
        ],
      },
      {
        n: "03",
        title: "Practice: mark the constraints",
        body: "Mark the two constraints that decide the railcar for the 308-tonne transformer, then compare with the route survey.",
        narration: [
          "Mark the two constraints that decide the railcar for the transformer.",
          "Compare your marks with the route survey in the debrief.",
        ],
      },
      {
        n: "04",
        title: "Debrief and record",
        body: "The debrief compares the marks with the clearance envelope and records the next move to walk through.",
        narration: [
          "The debrief compares your marks with the loaded clearance envelope.",
          "One move is recorded for the next walkthrough.",
        ],
      },
      {
        n: "05",
        title: "Follow-up",
        body: "Permits and route clearance follow, using the 260-tonne Germany-to-Galveston move as the comparison.",
        narration: [
          "Next is permits and route clearance.",
          "The comparison case is the 260-tonne move from Germany into Galveston.",
        ],
      },
    ],
    practice: {
      prompt: "Mark the two constraints that decide the railcar.",
      hint: "Example answer: axle load & bridge rating, and route clearance.",
      zones: [
        { id: "axle-load", label: "Axle load & bridge rating", note: "Sets the car and the speed" },
        { id: "route-clearance", label: "Route clearance", note: "Checked against loaded geometry" },
        { id: "container-count", label: "Container count", note: "Not applicable to breakbulk" },
        { id: "crew-size", label: "Crew size", note: "Planned after the car is chosen" },
        { id: "paint", label: "Paint specification", note: "Cosmetic, not structural" },
        { id: "sailing", label: "Sailing schedule", note: "Ocean leg is already booked" },
      ],
    },
  },
];

export const classroomSessions: ClassroomSession[] = classroomSeeds.map((session) => ({
  ...session,
  desk: DEMO_DESKS[session.division],
}));
