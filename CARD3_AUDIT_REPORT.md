# KURDESTAN Card 3 — City of the Week — V5.23

## Automatic weekly rotation
- Source dataset: 96 city records.
- Unique city IDs: 96.
- Regional distribution: Rojhelat 32, Bakur 31, Bashur 21, Rojava 12.
- Official cycle anchor: 11 March 2027 (launch date).
- Before launch: a clearly labelled preview is shown; the official weekly counter does not consume the cycle.
- After launch: the city is calculated from calendar weeks elapsed since launch.
- Rotation interval: exactly 7 × 24 hours in the cycle engine.
- The page re-checks every second and automatically renders the new city at the boundary without reload or upload.
- Visibility recovery: when a browser tab becomes visible again, the city is recalculated immediately, preventing stale content after sleep/backgrounding.
- After city 96, the cycle restarts at city 1 with a new cycle number.

## Ordering
Cities are interleaved across the four regional groups as long as each group still has entries, then remaining cities are appended in deterministic regional order. No city is intentionally repeated by the rotation engine before all 96 records are exhausted.

## Data quality
The weekly card displays the city's existing dossier fields and does not fabricate missing population or heritage data. City-level population remains subject to the project's city-level-only evidence rule.

## Images
The city image is fetched through the project's attributed image helper when available, with local/generic fallback if unavailable. Image availability is not treated as proof of cultural ownership.

## QA
- `node --check script.js`: PASS
- 96 city records: PASS
- 96 unique IDs: PASS
- ZIP integrity: PASS
- No weekly manual upload required: PASS
