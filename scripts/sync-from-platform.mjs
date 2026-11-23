/**
 * Refresh the demo's copies of the files it shares with the platform.
 *
 * The demo renders the platform's real landing page and design tokens; when
 * those change at the repo root, run `npm run sync` inside demo/ and rebuild.
 * Auth/Convex are the intentional differences in src/hooks/use-auth.ts, and the
 * demo's src/lib/accessLinks.ts overrides the signed-out CTA destination. This
 * script never touches either of those files.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const demoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const platformRoot = resolve(demoRoot, "..");

const shared = [
  "src/pages/Landing.tsx",
  "src/index.css",
  "src/components/ui/button.tsx",
  "src/components/ui/badge.tsx",
  "src/components/gwg/bits.tsx",
  "src/lib/utils.ts",
  "src/lib/guestTours.ts",
  "src/assets/logo.svg",
];

for (const file of shared) {
  const from = resolve(platformRoot, file);
  const to = resolve(demoRoot, file);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  console.log(`synced ${file}`);
}
