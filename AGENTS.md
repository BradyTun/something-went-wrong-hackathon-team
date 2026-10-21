# Working agreement for Codex

## Start every task here

1. Read `README.md`, `docs/project-structure.md`, and `docs/delivery/README.md`.
2. Read the original PRD and the relevant sections of `Parcel_Delivery_Codex_Implementation_Plan.md`.
3. Select one ready task from `docs/delivery/backlog.json`. Check dependencies and decision gates before changing code.
4. Read `docs/decisions/README.md` and any approved ADRs. Record a short plan and affected files in a task evidence file using `docs/delivery/templates/task-evidence.md`.

The PRD governs business scope. Explicit user instructions and approved product decisions resolve ambiguities. The implementation plan supplies engineering guidance. Planning files do not approve business rules.

## Current authorization and repository state

This repository contains planning documents and a minimal deployed landing page (TASK-028). The user authorized this page and its Vercel deployment as a quick standalone task. Other application features and sprints require their own implementation request. Continue already authorized work without asking for routine implementation choices.

## Implementation boundaries

- Use one fullstack Next.js App Router application, TypeScript, PostgreSQL, and pnpm as proposed in the implementation plan. Verify current official compatibility and pin versions during TASK-004; no versions have been selected yet.
- `src/app` owns routes and composition. Feature modules own business services, runtime schemas, DTO mapping, repositories, and feature UI. Shared UI belongs in `src/components`; infrastructure belongs in `src/lib`.
- Enforce sessions, roles, and current assignment ownership on the server. All entry points call the same protected services. Route groups and hidden controls do not provide authorization.
- Keep DB/session/storage modules server-only. Public tracking returns a separate minimal DTO. Never serialize private parcel entities publicly or log recipient details, secrets, or tracking codes.
- Use transactions for multi-record writes, DB uniqueness constraints, concurrency protection, and safe request retries. Recheck ownership when saving a driver result.
- Do not invent status transitions, receiving defaults, customer edit rights, photo rules, date math, payment rules, or staff lifecycle rules. Check task-specific decision gates.
- No customer accounts, GPS, route optimization, automatic SMS/email, payment processing, returns, signatures, or analytics.
- Follow implementation-plan section 7: Sora for Latin text, accessible states, mobile customer/driver flows, responsive administration, and UX evidence. Feature UI stays with its feature rather than duplicated shared feature folders.
- Create application directories only when their task needs them. Do not add empty placeholder source files or fake package scripts.

## Tracking and verification

- `docs/delivery/backlog.json` is the authoritative task status and dependency ledger. Sprint documents describe goals and acceptance; do not maintain another status checklist.
- Execute one verifiable task at a time. Statuses: `todo`, `in_progress`, `blocked`, `in_review`, `done`.
- A task is ready only if dependencies are done and all its decision gates have approved ADRs. Preparatory design can proceed under a separate ungated task; blocked behavior cannot be enabled.
- Before `in_progress`, set owner and record the task plan. If blocked, record a reason. Before `done`, link an evidence file containing actual validation results and review outcomes.
- Run checks appropriate to the change. For application slices, follow the implementation plan's lint/typecheck/unit/integration/build and relevant E2E contract. Never call unavailable checks passing. Docs-only edits use the planning validator.
- Update requirement traceability after each completed feature. Pending decisions/tests, environmental blockers, and unperformed human UX studies remain explicit.
- Do not commit, push, publish, or deploy without user authorization. Never run destructive database tests against production.

## Completion report

Report task ID and PRD IDs, outcome, files changed, exact checks and results, evidence path, decisions relied on, remaining blockers, and next ready task. Completion of planning is not completion of application features.
