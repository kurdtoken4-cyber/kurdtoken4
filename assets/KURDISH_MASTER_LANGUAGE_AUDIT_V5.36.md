# KURDESTAN V5.36 — Kurdish Sorani Master Language Audit

Date: 2026-09-15

## Result
PASS — Kurdish/Sorani content was audited and the remaining mixed Persian/Kurdish prose found in V5.35 was rewritten.

## Scope
- index.html
- clothing_section.html
- people_section.html
- 404.html
- script.js dynamic Kurdish strings
- cities-data.js city atlas fields
- research-registry.js review

## Language policy
- Sorani Kurdish Arabic-based script is the master Kurdish UI standard.
- Technical/proper names such as KURD, KURDESTAN, BNB Smart Chain, BEP-20, BscScan, UNESCO, Wikimedia Commons and academic publication titles are retained where bibliographically or technically necessary.
- Genuine book/work/source titles are not silently translated when that would alter the bibliographic identity.
- Goal is zero Persian prose leakage in the Kurdish UI, not zero Persian-script Unicode characters.

## QA checks
- data-ku attributes in index.html: 1079; empty: 0; missing where data-en exists: 0.
- clothing_section.html data-ku: 40; empty: 0; missing where data-en exists: 0.
- people_section.html data-ku: 185; empty: 0; missing where data-en exists: 0.
- cities: 96; unique IDs: 96.
- Region counts: Rojhelat 32, Bakur 31, Bashur 21, Rojava 12.
- city atlas ku fields: no high-confidence Persian leakage detected.
- JavaScript syntax: PASS (`node --check script.js`).
- visible high-confidence Persian prose in Kurdish HTML: no remaining mixed Persian prose detected; remaining matches are Kurdish religious terminology or preserved proper/source titles.
- visible “4 BNB”: absent.
- stated supply 4,444,444,444 KURD: present.

## Editorial corrections
- Converted Persian academic/editorial paragraphs to natural Sorani Kurdish.
- Standardized headings such as historical atlas, academic source map and editorial rules into Kurdish.
- Converted mixed Persian/Kurdish heritage, four-region, research, clothing, language, religion, Ramadan, Mawlid and transparency passages.
- Converted city history placeholders and mixed attraction text in cities-data.js to Kurdish.
- Preserved proper names, original work titles and technical product/source names where required.

## Notes
Two structural duplicate IDs (`people`, `clothing`) exist because the integrated page and their standalone section files both carry the same section IDs. This is inherited architecture and is not a language defect; it should be handled in the final structural QA pass if those standalone files remain part of the deployed navigation.

External image/source licenses still require rechecking before commercial publication.
