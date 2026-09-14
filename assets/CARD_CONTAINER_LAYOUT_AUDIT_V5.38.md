# V5.38 — Mobile/Card Container Audit

## User requirement
No long information blocks should appear below the 16-card grid on mobile. Each topic must live inside its corresponding card detail view.

## Problems found in V5.37
1. Card 5 (History) was inside `<main>` but lacked `data-master-section="true"`, so the master-card script did not hide/move it.
2. Card 16 (Religion) was outside `<main>`, so the master-card script did not include it in the 16-card detail architecture.
3. The Trust/Security section was also outside `<main>` and was not assigned to a master card; it belongs inside Card 1 (KURD Token / transparency).

## Fixes in V5.38
- Card 5 History now has `data-master-section="true"`.
- Card 16 Religion is moved inside `<main>` and remains `data-master-section="true"`.
- Trust/Security is moved inside Card 1, so it opens as part of Card 1 and does not appear as a loose page section.

## Structural QA
- Master navigation cards: 16
- Master detail sections: 16
- Missing targets: 0
- Loose top-level content sections after `<main>`: 0 (excluding footer/scripts/modal)
- Card 1 contains Trust/Security: PASS
- Card 5 contained in master architecture: PASS
- Card 16 contained in master architecture: PASS
