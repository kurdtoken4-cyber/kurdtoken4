# KURDESTAN V4.9 — Performance & Speed

This release prioritizes loading speed without changing the visual design.

## Changes
- Converted the main local hero, logo and city placeholder assets to WebP.
- Removed duplicate root-level copies of local assets.
- Kept the hero as the only eager/high-priority image.
- Kept non-critical images lazy-loaded.
- Preserved explicit intrinsic image dimensions to reduce layout shift.
- Preserved reduced-motion accessibility rules.
- Preserved the existing five-language structure and city atlas.
- No contract address or unverified deployment claim was introduced.

## Hosting
The site remains a static GitHub Pages project. GitHub Pages publishes static files directly from a repository; `.nojekyll` is appropriate when no Jekyll processing is needed.

## Performance target
The implementation is optimized toward strong Core Web Vitals, especially LCP, CLS and INP. Actual Lighthouse/PageSpeed scores must still be measured against the live deployed URL because network conditions and third-party image hosts affect runtime measurements.
