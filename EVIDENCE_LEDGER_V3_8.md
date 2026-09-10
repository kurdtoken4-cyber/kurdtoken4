# KURDESTAN — Evidence Ledger V3.8 (Bakur completion pass)

Date: 2026-09-06

This release completes a structured Bakur research pass for all 31 Bakur city records while preserving the project's evidence standard.

## Population rule
- TÜİK ADNKS 2025 is the primary current official regional source.
- City-level population is entered only when the source explicitly identifies the settlement as a city/urban population.
- District/metro/province totals are never silently promoted to city population.
- Where a district total is shown for a record whose identity is a district, `populationScope: district` is explicit.
- Where only a regional/metro total is known, the population field remains pending rather than guessed.

## Coverage
- 31/31 Bakur records retained.
- 31/31 have a TÜİK 2025 regional source candidate.
- 31/31 have geographic reference coordinates added or retained.
- Exact city/urban population values were added where verified in this pass; district totals are explicitly scoped.
- Diyarbakir coordinate corrected to the UNESCO property reference area and marked as a geographic reference rather than a claim about municipal boundary.

## Important source note
The official TÜİK 2025 ADNKS release was published 9 February 2026. It defines “il ve ilçe merkezi nüfusu” as population inside province/district-center boundaries and separately reports towns/villages. The release also states that settlement populations are derived from ADNKS and national address records as of 31 December 2025.

Source: https://data.tuik.gov.tr/Bulten/Index?p=Adrese-Dayali-Nufus-Kayit-Sonuclari-2025-53899

## Remaining extraction work
The next data-only step is to extract the exact 2025 settlement/city rows for every remaining Bakur record directly from the TÜİK database. No unverified province total has been substituted for a city value in V3.8.
