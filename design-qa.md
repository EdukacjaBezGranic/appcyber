# Design QA — V94 Deep Graphite + Lime Compute

- Source visual truth: `/workspace/scratch/81535613b0bd/upload/IMG_7632.jpg` (854 × 1074 px; palette reference)
- Implementation: `http://terminal.local:4173/` rendered in Cloud Browser
- Browser viewport: 1345 × 926 CSS px, density 1
- State: desktop, homepage and public subpages
- Primary interactions tested: active navigation on Start, Nasze szkolenia and Zapisy na szkolenia; navigation state changes; three training videos and three AI labels present
- Console errors: none from the portal; one unrelated browser-extension metadata error was excluded

## Full-view comparison evidence

The reference defines two exact visual tokens rather than a page layout: Deep Graphite `#1F2329` and Lime Compute `#B6FF2E`. The implementation uses those exact values in the header, hero, CTA controls, active navigation and footer. Long-form content remains on a light neutral surface for readability.

## Focused comparison evidence

- Header/navigation: the current page uses a compact lime field with graphite text; inactive priority links use a restrained lime outline.
- Homepage hero: graphite background and lime emphasis reproduce the source palette without reducing readability of the long introduction.
- Training-video section: the lime is darkened only for small text on light backgrounds to preserve contrast; video posters, controls and AI labels remain unchanged.
- Public subpage: `nasze-szkolenia.html` confirmed the active state moves correctly and the palette remains consistent.

## Required fidelity surfaces

- Fonts and typography: original portal typography, hierarchy and wrapping preserved; inherited accidental bold weight in the homepage main content corrected.
- Spacing and layout rhythm: existing responsive grid and section spacing preserved; navigation highlights reduced to 42 px compact controls.
- Colors and tokens: exact source graphite and lime used; darker lime variant `#4F7F00` is limited to small text on light backgrounds for accessibility.
- Image quality and assets: all original photos, logos, posters and videos preserved without raster replacement or recoloring.
- Copy and content: all existing text preserved; three AI disclosure labels remain present.

## Comparison history

- P2: priority navigation links initially looked permanently active because the entire “Zapisy” field was filled. Fixed by reserving the filled lime state exclusively for `aria-current="page"` and using an outline for inactive priority links.
- P2: small green text on a light background did not have sufficient contrast at the initial lime-dark value. Fixed by changing the accessible light-background accent to `#4F7F00`; exact `#B6FF2E` remains on graphite and large action surfaces.
- P2: the first working base lacked V92/V93 video changes. Fixed by restoring all three videos, posters and AI disclosures before final verification.
- P2: the active navigation label was not optically centered inside the lime field. Fixed with an explicit 42 px `inline-flex` control, centered on both axes with normalized line height.
- P2: the graphite homepage hero inherited the page container inset and exposed a beige strip at the viewport edge. Fixed with a full-bleed `100vw` hero while retaining internal content padding.
- P2: legacy navigation pseudo-elements still drew a line across or beneath labels. Fixed by disabling both navigation pseudo-elements and all link text decoration in every interaction state.
- P2: the training videos became visually secondary after the palette update. Fixed by increasing the video column to the dominant 1.25fr track while retaining a readable text column and one-column mobile fallback.
- P2: the contact hero retained teal accents and beige side strips. Fixed with a full-bleed graphite hero and exact lime heading.
- P2: legacy teal contact cards and the blue trainer-panel button broke palette consistency. Fixed with lime action surfaces and graphite text.
- P2: a legacy `-webkit-text-fill-color` rule forced white type on the lime trainer button. Fixed with a higher-specificity graphite text-fill override and cache-version update across all public pages.
- P2: the four-column training proof strip placed the first and last text blocks against the frame edges and left too little vertical separation. Fixed with responsive frame padding, equal column spacing, a 16 px title-to-copy gap and a dedicated mobile rhythm.

## Findings

No actionable P0, P1 or P2 findings remain in the verified desktop states.

## Follow-up polish

- A final spot-check on physical iOS and Android devices is recommended for native video-control appearance.

final result: passed
