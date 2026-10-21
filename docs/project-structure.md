# Project structure

Use the current repository root as the application root. A nested `parcel-delivery` project or monorepo adds no value for the proposed single service.

## Present now

```text
AGENTS.md
README.md
Product_Requirements_Document_Parcel_Delivery_Management_&_Tracking.docx
Parcel_Delivery_Codex_Implementation_Plan.md
docs/
  project-structure.md
  requirements-matrix.md
  decisions/README.md
  decisions/ADR-template.md
  delivery/
    README.md
    backlog.json                 authoritative task records and status
    sprints/sprint-01.md ... sprint-07.md
    templates/task-evidence.md
    templates/sprint-review.md
  testing/acceptance.md
scripts/validate-planning.mjs
```

## Create during implementation

```text
package.json / pnpm-lock.yaml / tsconfig.json / next.config.ts
eslint.config.mjs / vitest.config.ts / playwright.config.ts
.env.example / docker-compose.yml / .github/workflows/ci.yml
prisma/
  schema.prisma / migrations/ / seed.ts
src/
  app/
    layout.tsx
    (public)/track/page.tsx
    (staff)/login/page.tsx
    (staff)/driver/{layout.tsx,deliveries/,notifications/}
    (staff)/admin/{layout.tsx,parcels/,assignments/,drivers/}
    api/v1/{tracking/,customer/,admin/,driver/,files/}
  features/
    parcels/                     ADM-02
    tracking/                    CUS-01, CUS-04; public DTO only
    drivers/                     ADM-01; business record, not identity
    assignments/                 ADM-03; current ownership and reassignment
    driver-worklist/             DRV-01; dated authorized queries
    delivery-results/            DRV-01, CUS-04; atomic result/status history
    customer-preferences/        CUS-02, CUS-03; authorization and edit eligibility
    notifications/               DRV-02; event recipients and list/filter
  components/{ui/,layouts/}       shared primitives and persona shells
  lib/{auth/,db/,http/,config/,storage/,observability/,dates/,errors/,ui/}
  styles/tokens.css
tests/{unit/,integration/,e2e/,visual/,a11y/,fixtures/,helpers/}
docs/
  architecture/{overview.md,data-model.md,permission-matrix.md,api-contracts.md}
  design/{principles.md,reference-audit.md,user-flows.md,screen-specs.md,tokens.md,ux-test-report.md}
  testing/{test-plan.md,fixtures.md,release-checklist.md}
  runbooks/{local-development.md,migration-and-backup.md,deployment-and-rollback.md}
  delivery/evidence/TASK-xxx.md
  delivery/reviews/sprint-xx.md
```

Braces above abbreviate future paths, not literal directory names. Detailed page/API inventory is in implementation-plan section 6. Create concrete routes only when needed. Schema and config filenames may adapt to the pinned supported framework/ORM versions.

## Module contract

Each feature grows only the files it needs: `components/`, `schemas.ts`, `service.ts`, `repository.ts`, `mapper.ts`, and `policies/`. Do not generate a full template for every feature. Thin routes parse input, establish identity, call a protected service, and map an explicit response. Services enforce rules and transaction boundaries; repositories own ORM queries and accept the transaction context. Infrastructure adapters own sessions, environment, storage, logs, and DB connections.

Keep feature components inside their owner feature. Implementation-plan section 7's shared feature-component examples are reconciled with section 4 by sharing only reusable UI/layouts. Put unit/component tests in `tests/unit/<feature>/`; do not also create `src/features/*/tests`. Integration and E2E suites verify real persistence and persona journeys.

Dependencies flow from routes/UI to services to repositories/adapters. Cross-feature orchestration uses explicit service contracts and shared transaction context. Notification persistence participates in the relevant transaction; avoid circular feature imports or new queue infrastructure.

## Data and security constraints

The proposed entities are StaffUser, Driver, Parcel, DeliveryAssignment, DeliveryResult, DeliveryPhoto, ParcelPreference, DriverNotification, ParcelStatusHistory, and OperationalAuditEvent. Refine them in TASK-006 rather than treating this list as a generated schema.

Preserve separate parcel/tracking identifiers with DB uniqueness; a single current assignment per parcel; explicit date versus timestamp semantics; private photo metadata; immutable evidence/history where appropriate; idempotency and stale-assignment checks. Initial statuses, amount requiredness, mapping, and photo retention remain decision-dependent. Staff identity and driver business records are separate concerns.
