import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import DemoNotice from "./pages/DemoNotice";
import Guest from "./pages/Guest";
import Landing from "./pages/Landing";
import "./demo.css";

/**
 * Public demo shell.
 *
 * The landing page's links go to real destinations instead of looping back to
 * itself: the guest walkthrough is fully built here, and the surfaces that need
 * a signed-in workspace land on a page that explains why they are not part of
 * the static demo.
 */
function DemoApp() {
  // The comparison harness builds the demo under /demo/ next to the platform
  // build; the deployed demo is built at the root. BASE_URL keeps the router
  // correct for both without a second entry point.
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  return (
    <BrowserRouter basename={base || "/"}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/guest" element={<Guest />} />
        <Route
          path="/auth"
          element={
            <DemoNotice
              eyebrow="Sign in"
              title="Sign-in is not available in this demo."
              body="This public demo does not include accounts or sign-in, and it never shows customer records. The guest walkthrough is the interactive part of the demo. A guided walkthrough with our team covers setup, the learner experience, and the evidence your organization needs."
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DemoNotice
              eyebrow="Workspace"
              title="The workspace dashboard lives behind sign-in."
              body="Dashboards, assignments and review history belong to a signed-in company workspace and a specific organisation. This demo has neither, so it shows nothing from anyone's account — the guest walkthrough is the closest read-only view."
            />
          }
        />
        <Route
          path="/content"
          element={
            <DemoNotice
              eyebrow="Catalog"
              title="The program catalog is part of a signed-in workspace."
              body="Onboarding, training and continuous-learning programs are scoped to an organization. The demo cannot show a real catalog, but the guest walkthrough includes illustrative air, ocean, road and rail programs framed around Fracht Group."
            />
          }
        />
        <Route
          path="/verify"
          element={
            <DemoNotice
              eyebrow="Credentials"
              title="Credential verification needs a live record."
              body="Verifying a credential means checking a sealed scorecard against a live workspace. The demo carries sample scorecards only, so there is nothing here to verify."
            />
          }
        />
        <Route
          path="*"
          element={
            <DemoNotice
              eyebrow="Page not found"
              title="That page is not part of this demo."
              body="This public demo includes the landing page and the guest walkthrough. Anything else belongs to the signed-in platform."
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoApp />
  </StrictMode>,
);
