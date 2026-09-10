# KURDESTAN / KURD — V4.3-C

## Mobile + Accessibility + Performance Hardening

This release is based on **V4.3-B Hero Zoom-Out** and keeps the current visual identity and hero framing intact while hardening the site for mobile devices, keyboard users, assistive technology and faster loading.

### 1. Mobile navigation
- Added a dedicated mobile menu button.
- The existing full navigation is reused; no second navigation data set was created.
- Menu state is exposed through `aria-expanded` and `aria-controls`.
- Menu closes after navigation, on Escape, and when clicking outside the header.
- Menu labels follow the active site language where translations are available.

### 2. Accessibility
- Added a keyboard-accessible skip link to the main content.
- Added visible `:focus-visible` treatment for links, buttons, form controls and summaries.
- Standardized button types so navigation/action buttons do not accidentally behave as form submissions.
- Improved modal semantics with `role="dialog"`, `aria-modal` and `aria-labelledby`.
- Added focus restoration after closing the section modal.
- Added a basic keyboard focus trap inside the open section modal.
- Changed the launch countdown from a constantly announced live region to a `timer` role to avoid excessive screen-reader announcements.
- Ensured images have `alt` attributes.

### 3. Performance
- Hero image now uses preload + `fetchpriority="high"` + eager loading because it is above the fold.
- Non-hero images use lazy loading where appropriate.
- Images use asynchronous decoding.
- Dynamic city/music images are also marked for efficient loading.
- Intrinsic width/height were added where local image dimensions were available, reducing layout shift.
- Reduced-motion support was added with `prefers-reduced-motion: reduce`.
- No third-party library was introduced.

### 4. Mobile layout hardening
- Navigation becomes a compact expandable menu below 700px.
- Touch targets are given a practical minimum size.
- Hero actions become full-width on small screens.
- Atlas, evidence tables, cards and controls retain horizontal-scroll behavior where a table cannot safely collapse.
- Extra-small screens receive tighter typography and spacing without changing the desktop hero design.

### 5. Scope protection
The existing hero image asset was **not replaced**. The V4.3-B zoom-out framing is preserved; this release focuses on responsive behavior, accessibility and performance.

### 6. Data integrity
No city population, token supply, liquidity plan, contract address, launch date or research claim was changed by this release.
