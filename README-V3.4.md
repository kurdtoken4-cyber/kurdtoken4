# KURDESTAN V3.4 — City Evidence Atlas

This release adds an evidence layer to all 96 city records.

## Evidence standard
A city field is treated as verified only when it can be traced to a named source. Population is only treated as precise when a year and source are recorded.

Each city now carries:
- `researchPlan` with 11 evidence dimensions
- `regionalSources` for official/statistical/heritage portals
- `heritageSources` where a directly relevant UNESCO record is known
- `researchVersion`

The UI shows an evidence matrix for every city and separates verified fields from research gaps.

## Editorial rule
Do not convert regional statistics into city statistics. Do not attribute archaeological sites, languages, crafts or traditions exclusively to Kurdish communities without evidence. Missing evidence is displayed as a research gap rather than filled with invented facts.
