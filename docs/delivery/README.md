# Sprint delivery workflow

`backlog.json` is the only task ledger. Each record carries sprint, PRD IDs, implementation phases, dependencies, decision gates, acceptance criteria, validation, target paths, owner, blocker, and evidence. Sprint briefs link these IDs and define review outcomes. Requirement traceability links features to tasks; it does not claim implementation is done.

Seven ordered sprint candidates are proposed. They are outcome groups, not dated commitments or estimates. No velocity, team capacity, dates, or sprint duration were supplied. Sprint 05-07 include decision-dependent work; blocked items may move while their IDs and dependencies remain stable. ADM-01 is scheduled before parcel assignment because real driver records are a dependency, despite its proposed P1 classification.

| Sprint | Goal | Task range |
|---|---|---|
| [01](sprints/sprint-01.md) | Decisions, UX preparation, reproducible foundation | TASK-001–005 |
| [02](sprints/sprint-02.md) | Data and staff access | TASK-006–009 |
| [03](sprints/sprint-03.md) | Admin drivers and parcels | TASK-010–012 |
| [04](sprints/sprint-04.md) | Assignment and driver worklist | TASK-013–015 |
| [05](sprints/sprint-05.md) | Result/photo persistence and public tracking | TASK-016–019 |
| [06](sprints/sprint-06.md) | Authorized preferences and notifications | TASK-020–023 |
| [07](sprints/sprint-07.md) | Release verification and handoff | TASK-024–027 |

## Picking work and updating status

1. Read the task record and source sections. A `todo` task is ready when dependencies are `done` and every decision gate has an explicitly approved ADR. Start with TASK-001 when implementation is authorized.
2. Set owner and `in_progress`; create an evidence record from the template. Keep one task active at a time.
3. Use `blocked` with a concrete reason when a prerequisite prevents progress. If policy work can proceed without approval, keep it in its ungated preparation task; do not enable the gated feature.
4. Move to `in_review` with actual test outputs and UX evidence. Mark `done` only after acceptance and required verification pass; set `evidence` to a repository-relative file path. Link approved decisions used in the evidence.
5. At sprint review, record accepted outcomes, carryover, unresolved decisions, test evidence, and the next ready task using the review template. Re-run `node scripts/validate-planning.mjs` after ledger edits.

All tasks begin `todo`, with no owner or evidence. Decision gates are prospective blockers and are listed even before a task becomes active. The validator checks structural consistency, dependencies, evidence paths, and gate registration; a human/agent must verify the substance of approvals and acceptance. It does not execute application tests.

## Definition of ready

Source behavior is understood; dependent tasks accepted; required policies approved; change plan, affected paths, fixtures, expected results, and applicable screen states identified. Approved decisions must include owner, date, exact rule, and acceptance examples. Missing approvals do not stop unrelated work.

## Definition of done

Acceptance criteria satisfied; no fabricated policies; focused automated tests and applicable integration/E2E/build checks actually run; server authorization verified; applicable loading/empty/error/success/mobile states inspected; evidence and traceability updated. A skipped check, fake backend, unperformed usability study, or unresolved prerequisite cannot be counted as passed. Relevant manual accessibility/UX review belongs in the evidence, with failures left open.

Planning completion does not mark TASK-001 done: it still requires kickoff review and confirmation of the implementation baseline. TASK-028 is an explicitly requested standalone landing page/deployment in Sprint 01; it does not complete the earlier sprint tasks.
