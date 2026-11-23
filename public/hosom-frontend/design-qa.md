# Design QA — HOSOM public homepage

## Comparison target

- Source visual truth: `https://hosom.piccworldwide.org/`, captured in Chrome on 2026-11-23.
- Implementation: `http://localhost:3000/`, captured in Chrome from this repository.
- State: homepage at top, desktop navigation visible.
- Viewport: browser content capture `1366 × 720` CSS px at device scale factor 1 for both source and implementation. No density normalization was required.

## Evidence

- Full-view source capture: live reference homepage in Chrome at the desktop viewport above.
- Full-view implementation capture: local homepage in Chrome at the matching desktop viewport above.
- Focused regions reviewed: masthead/navigation, hero copy and feature card, CTA row, hero statistics, and the start of the faith-centred trust strip.
- Additional source capture reviewed: the welcome/about section and the academic pathways heading/card grid.

## Findings

- No actionable P0, P1, or P2 visual differences found in the captured homepage state. The local render matches the source layout, colour treatment, display/body typography hierarchy, hero artwork composition, copy, navigation structure, and CTA treatment.
- P3: Browser focus outlines can be visible after keyboard navigation. This is expected accessibility feedback, not a persistent visual difference.

## Required fidelity surfaces

- Fonts and typography: matched display serif/body sans hierarchy, weights, sizing, uppercase eyebrow treatment, and line wrapping in the desktop hero.
- Spacing and layout rhythm: matched 80px masthead, two-column hero split, headline/CTA spacing, and desktop content alignment.
- Colors and visual tokens: matched navy hero, royal-blue actions and card offset, white navigation, pale-blue trust strip, and muted secondary copy.
- Image quality and asset fidelity: the local HOSOM logo is served from `public/images/hosom-logo.png`; no visible logo or illustration was replaced with handmade markup.
- Copy and content: hero, trust strip, welcome, programmes, curriculum, admissions, and footer copy match the source capture.

## Interaction and implementation checks

- Primary visible links and controls were present in the rendered accessibility tree: navigation, application/programme CTAs, curriculum/contact, portal login, programme cards, and footer links.
- Responsive navigation was rendered in its collapsed mobile form during a narrow-window check.
- `npm run build` passed successfully.
- `npm run lint` passed successfully.
- Browser-rendered page capture showed no Next.js error overlay or runtime error state. Browser developer-console access was unavailable in the current controlled session; the development-server output was clean.

## Comparison history

1. Captured the live source homepage at desktop width.
2. Captured the local homepage at the same desktop width and compared the full hero and focused header/hero regions.
3. No P0/P1/P2 fixes were required.

## Implementation checklist

- [x] Render the source homepage structure in the existing Next.js app.
- [x] Preserve working navigation and public-site interactions.
- [x] Validate production build and lint.
- [x] Compare source and implementation desktop captures.

## Follow-up polish

- None required for the captured state.

final result: passed
