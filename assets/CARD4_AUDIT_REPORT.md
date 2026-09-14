# CARD 4 RE-AUDIT — Four-Region Academic Master Atlas

Version: V5.30
Review date: 2026-09-15

## Re-audit finding
The previous V5.29 presentation was strong, but the machine-readable `cities-atlas-v4.3.json` did not carry an explicit `region` field even though `cities-data.js` carried the authoritative `part` assignment. This created an avoidable data-governance gap. V5.30 synchronizes the JSON atlas with the city `part` field and records the source of that mapping.

## Region integrity
- Total city records: 96
- ڕۆژهەڵات / Iran: 32
- باکوور / Turkey: 31
- باشوور / Iraq: 21
- ڕۆژئاوا / Syria: 12
- Every city ID has exactly one project-region assignment: PASS
- JSON region field synchronized from `cities-data.js:part`: PASS

## Academic safeguards
1. Four-region labels are project geographic-cultural categories, not contemporary legal borders.
2. Historical, cultural, demographic and administrative boundaries are separate variables.
3. Population must be city-level, dated and sourced; no district/province substitution.
4. A geographic label does not prove exclusive ethnic authorship or ownership of a site.
5. Historical maps must carry date, scale, source and scope.
6. Missing evidence is retained as a research gap rather than filled by estimation.
7. City ID is the primary join key across history, language, heritage and other atlases.

## Cross-card governance
- Card 4 = geographic-cultural atlas and comparative regional framework.
- Card 5 = comprehensive history; no historical master timeline is duplicated here.
- Card 6 = named places and heritage sites.
- Card 12 = language/linguistic atlas.
- Card 13 = research methodology/source governance.

## External academic basis
Cambridge's *Mapping Kurdistan* treats the cartographic idea of Kurdistan as historically and politically constructed rather than as an unchanging natural boundary. The atlas therefore distinguishes project geography from legal state borders and from historical maps.

## QA
- HTML structure: PASS
- JavaScript syntax: PASS
- 96 city IDs: PASS
- 4 region assignments: PASS
- Region counts sum to 96: PASS
- JSON region synchronization: PASS
- No unsupported population substitution rule: PASS
- ZIP integrity: PASS
