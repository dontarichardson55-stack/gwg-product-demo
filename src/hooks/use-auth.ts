/**
 * Auth stub for the public demo.
 *
 * The platform's real hook reads `users.currentUser` through the Convex
 * client and reports `unavailable` when the backend cannot answer. The demo
 * has no Convex deployment, so the session is always a plain signed-out
 * visitor — the same view an anonymous visitor gets on the platform.
 */

export type PublicSession =
  | { status: "loading" }
  | { status: "signed_in" }
  | { status: "signed_out" }
  | { status: "unavailable" };

export function usePublicSession(): PublicSession {
  return { status: "signed_out" };
}
