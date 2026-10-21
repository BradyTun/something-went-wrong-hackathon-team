# Acceptance and release evidence

The implementation plan sections 7 and 8 define the verification contract. These planning files contain no executed application test results.

| Area | Required proof | Tasks |
|---|---|---|
| Persistence | Fresh migrations/seed, unique code collisions, FK integrity, transaction rollback | 006, 007, 011, 014, 018 |
| Access | No-session and wrong-role denials; another driver's assignment/notification/photo denied; stale ownership rejected | 008, 009, 014–018, 022–024 |
| Tracking | Correct parcel only; minimal DTO; invalid input; enumeration protection; no stale success after failed result | 019, 024 |
| Delivery | Exact PRD labels, approved mapping, photo validation/private access, duplicate retry, failed upload, atomic save | 016–019 |
| Preferences | Approved customer proof, expiry/revocation, eligibility locks, length validation, correct driver alert | 020–023 |
| UX | Applicable initial/loading/populated/empty/validation/network/unauthorized/success states | Every screen task |
| Accessibility | Keyboard, focus, semantic labels, status announcements, contrast, screen reader, 200% zoom | 005, 025 |
| Responsive | 320, 375, 768, 1024, 1440px; reviewed screenshots; no clipped essential controls | 025 |
| Observed usability | Plan's five-second review and five participants/proxies per main persona; record actual outcomes | 025 |
| Operations | Redacted logs, isolated test DB, reproducible setup, backup/restore, migration/rollback and agreed targets | 004, 007, 026 |

Use deterministic isolated fixtures: admin, two distinct drivers, parcels belonging to each, unassigned parcel, reassigned parcel, invalid tracking code, and policy-approved result/photo/preference variants. Never use real customer data or production for destructive verification.

Future script contract: `lint`, `typecheck`, `test:unit`, `test:integration`, `test:e2e`, `test:a11y`, `build`. TASK-004 wires applicable scripts and TASK-007 supplies real DB test infrastructure; browser/a11y runners must execute real checks rather than success stubs. Visual baselines require review. Commands are planned, not available now.

Release requires all P0 acceptance paths, included P1 gates and paths, security/failure checks, UX evidence, and operational runbooks. Excluded/deferred P1 work remains visible. No production approval is implied by a passing build, planning validator, or sprint review. TASK-027 records the final release recommendation and outstanding limitations; deployment requires separate authorization.
