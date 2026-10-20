# Design QA — WayNIR Landing Page

- Source visual truth: `ui-ref/landing-ref.JPG`
- Supporting product reference: `ui-ref/plataform-ref.JPG`
- Intended implementation: `http://localhost:3000/`
- Intended desktop viewport: 1440 × 1000 CSS px, device scale factor 1
- Source dimensions: 736 × 1104 px
- State: landing page inicial, menu fechado e modal de acesso fechado

## Evidence

- The source reference was opened and visually inspected.
- The implementation compiles successfully and the local development server is running.
- A browser-rendered implementation screenshot could not be captured because no integrated browser surface is available in this session.
- Full-view and focused-region comparisons are therefore pending.
- Primary interactions and browser console checks are also pending.

## Findings

- [P0] Browser-rendered visual evidence is unavailable.
  - Location: full landing page.
  - Evidence: source image is available, but there is no implementation screenshot at a matching viewport.
  - Impact: typography, spacing, responsive layout, assets, interactions and browser errors cannot be validated visually.
  - Fix: authorize a local Playwright capture or provide an available browser surface, then compare the reference and implementation together.

## Required fidelity surfaces

- Fonts and typography: pending browser capture.
- Spacing and layout rhythm: pending browser capture.
- Colors and visual tokens: pending browser capture.
- Image quality and asset fidelity: generated assets exist; placement pending browser capture.
- Copy and content: implemented from `plan.md`; rendered wrapping pending browser capture.

## Implementation checklist

- Capture the full landing page at the intended desktop viewport.
- Test navigation anchors, FAQ controls, login modal and form feedback.
- Check the browser console.
- Capture a mobile viewport.
- Compare source and implementation together and fix all P0/P1/P2 differences.

## Comparison history

- Initial pass: blocked before visual comparison because the integrated browser is unavailable.

final result: blocked
