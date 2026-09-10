# KURDESTAN V5.1 — Final Production QA

Date: 2026-09-08

This package is the final production-candidate build after static integrity, content, multilingual, city-atlas, asset, security-hygiene and GitHub Pages checks.

## Release principles
- Main hero/banner assets are intentionally preserved.
- No contract address, audit claim, LP-lock proof, or live trading status is fabricated.
- KURD supply and tokenomics are presented as project plans until independently verifiable on-chain execution exists.
- City population data is kept city-level; administrative/province/district totals are not silently promoted to city populations.
- The site remains a static GitHub Pages-compatible package.

## Publishing requirements
- `index.html` is at repository root.
- `.nojekyll` is present at repository root.
- Use HTTPS for the published GitHub Pages site.
- Do not upload secrets, private keys, passwords, or wallet credentials.
- Before public launch, perform one live-browser smoke test on desktop and mobile and verify the deployed URL, because static package QA cannot replace real-browser/network testing.
