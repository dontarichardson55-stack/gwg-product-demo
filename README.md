# GWG Product Demo

Standalone public demo of the GWG workforce-development platform, framed around
Fracht Group's air, ocean, road and rail operations. It is built from the
platform's real landing page and guest walkthrough, with auth and Convex stubbed
out.

- Illustrative data only. The Fracht Group company profile is public; every
  learner, score, date and record is illustrative.
- No backend, no database, no auth, no private platform source.
- Not connected to the private platform or to Fracht systems of record.

## Build

```bash
npm ci
npm run build
```

The static build is written to `dist/`. `deploy.json` serves it through the
Worker in `worker.js`.

## Source layout

- `src/pages/Landing.tsx` — public landing page.
- `src/pages/Guest.tsx` — view-only guest walkthrough.
- `src/data/guestSample.ts` — illustrative Fracht Group program, learner and
  classroom data.
- `src/components/guest/` — classroom and learner-path interactions.
