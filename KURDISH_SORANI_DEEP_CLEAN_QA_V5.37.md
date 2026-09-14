# KURDESTAN V5.37 — Kurdish Sorani Deep Clean Final QA

Date: 2026-09-15

## Scope
A second, source-level Kurdish/Sorani audit was performed against V5.36. The audit did not rely on the previous PASS report. It inspected visible text nodes, `data-ku` attributes, the city data layer, and dynamic JavaScript language strings.

## Corrections
- Rewrote 60 mixed Kurdish/Persian visible content blocks in `index.html` into consistent Sorani Kurdish.
- Corrected the remaining Kurdish attribute phrase containing the Persian form `توصیف`.
- Standardized several Persian-derived editorial terms where they appeared as UI prose, including `دانشنامەیی` → `زانستنامەیی`.
- Preserved genuine proper names, bibliographic titles, technical names and source-language strings where they are not Kurdish UI prose.
- Preserved the separate Persian (`fa`) language data; Persian content inside `data-fa` is intentional and is not treated as Kurdish leakage.

## QA
- `index.html`: 1,079 non-empty `data-ku` attributes.
- `clothing_section.html`: 40 non-empty `data-ku` attributes.
- `people_section.html`: 185 non-empty `data-ku` attributes.
- Visible-text Persian/mixed-language heuristic after correction: 0 matches.
- Targeted mixed-language `data-ku` heuristic after correction: 0 matches.
- City records: 96.
- JavaScript syntax: PASS (`node --check script.js`).
- ZIP integrity: PASS.
- No change to token supply, contract status, trading status, or project architecture was made by this language pass.

## Important editorial rule
The goal is zero Persian prose in the Kurdish interface, not zero Persian-script Unicode characters. Names, source titles, quotations, bibliographic metadata and technical proper nouns may legitimately retain their original language when required for accuracy.

## Status
PASS for the Kurdish/Sorani deep-clean language scope.
This is a language QA pass; it does not by itself constitute live GitHub Pages deployment QA.
