# Parcel Delivery Management & Tracking System
## Codex-Ready Fullstack Next.js Implementation Plan

**Document type:** Implementation specification, work breakdown, verification contract, and coding-agent handoff  
**Source:** `Product_Requirements_Document_Parcel_Delivery_Management_&_Tracking.docx` (21 pages)  
**Source requirement IDs:** `CUS-01` to `CUS-04`, `DRV-01` to `DRV-02`, `ADM-01` to `ADM-03`  
**Target stack:** Fullstack Next.js (App Router), TypeScript, PostgreSQL  
**Status:** Engineering proposal based on the supplied PRD; unresolved product rules remain explicitly unapproved  
**Intended reader:** Codex or another coding agent, developer, tech lead, tester, or product owner

---

# 0. START HERE: CODEX EXECUTION CONTRACT

> **Primary instruction to Codex:** Treat this document as the implementation source of truth **derived from the PRD**, not as authorization to invent missing product requirements. First review the repository, create/update an agent-friendly `AGENTS.md`, propose or implement the project structure below, and execute **one verifiable task at a time**. Follow dependency order, implement the minimum necessary code, add automated tests, run quality gates, and report evidence before marking a task done.

## 0.1 Priority of instructions and evidence

1. The original PRD governs business features and terminology.
2. Explicit product-owner decisions recorded in `docs/decisions/` govern previously unresolved choices.
3. This file governs engineering sequencing, architecture proposals, and test expectations where the PRD is silent.
4. Existing repository conventions may be preserved **if** they remain consistent with the PRD and security rules.
5. Tool-generated boilerplate must not silently override any of the above.

**MUST:** Before implementing any item tagged `BLOCKED-DECISION`, document the decision and obtain product-owner approval. Technical scaffolding, interfaces, and pending tests may still be prepared.

**MUST NOT:** Invent approval for customer edit permissions, notification transport, status mapping, parcel edit lock, file constraints, driver-login policies, or delivery-date math.

**MUST NOT:** Ship live GPS tracking, route optimization, SMS/email integration, online payments, returns/refunds, signatures, customer accounts, or analytics. These are out of scope in this version.

## 0.2 Working method for every coding task

For every work item `TASK-xxx`:

1. Read its linked PRD requirement, dependencies, and approved decisions.
2. Inspect existing code, tests, database migrations, and reusable components.
3. Write a short task-specific change plan and list affected files.
4. Add or update focused tests; prefer test-first for domain rules and permissions.
5. Implement via domain service and repository layers, not embedded business logic in pages.
6. Run appropriate commands: formatting, linting, typecheck, targeted tests, build if relevant.
7. Run integration/E2E tests for a completed vertical slice.
8. Update traceability and notes. Do not mark a blocked test as passing.
9. Report: files changed, tests run, results, known risks, pending decisions, next task.
10. Commit only if the user explicitly authorized commits. Never push or deploy without authorization.

**Agent completion format:**

```text
Task: TASK-xxx / PRD ID(s)
Summary: what changed
Files: created/modified
Tests: exact commands + pass/fail counts
Manual verification: steps + outcomes
Decisions relied on: ADR-xxx / none
Blocked items: IDs + reason
Next ready task: TASK-yyy
```

## 0.3 Checkpoint discipline

- Do not implement all phases in one unreviewed giant commit.
- Prefer small vertical slices with visible UI, backing API/service, and tests.
- Never claim production-ready solely because `next build` passed.
- Never substitute mock data for real integration while calling a feature complete.
- Add tests for unauthorized access, invalid input, race conditions, failed persistence, and stale data.
- Do not silently skip failing tests. Fix or surface the failure.
- If required secrets, credentials, a live database, or service access are missing, perform every test that can run locally; explicitly report environmental blockers.

---

# 1. PRODUCT SCOPE AND SUCCESS CRITERIA

## 1.1 Three user segments

| Segment | Business role | Required experience |
|---|---|---|
| Customer | Parcel recipient | Track parcel by code; see current status; later update receiving place and instructions when authorized. |
| Driver | Delivery personnel | See assigned work by date; inspect parcel; submit delivery result and optional photo; view relevant change notifications. |
| Administrator | Operations staff | Manage driver records; create parcels and tracking codes; assign/reassign parcels and delivery dates; inspect statuses/photos. |

## 1.2 Functional traceability

| PRD ID | Feature | PRD priority | Owner module | Critical proof |
|---|---|---|---|---|
| CUS-01 | Track Parcel | P0 | `tracking` | Valid code retrieves only correct parcel's public status; invalid code errors safely. |
| CUS-02 | Change Receiving Place | P1 | `customer-preferences` | Customer-authorized change persists to correct parcel and alerts assigned driver. |
| CUS-03 | Write Instruction | P1 | `customer-preferences` | Authorized text edit validates, persists, and is visible to assigned driver. |
| CUS-04 | View Updated Status | P0 | `tracking` / `delivery-results` | Latest successful driver update appears on tracking view. |
| DRV-01 | View Daily Route | P0 | `driver-worklist` / `delivery-results` | Driver sees own assignments, parcel details, result submission, photo, and audit metadata. |
| DRV-02 | Receive Notifications | P1 | `notifications` | Driver sees relevant change alerts, filters, and links to proper parcel. |
| ADM-01 | Manage Driver List | P1 | `drivers` | Create, list, detail, edit, validate required fields. |
| ADM-02 | Create Parcel Information | P0 | `parcels` | Saved complete record has unique parcel code and tracking code. |
| ADM-03 | Assign Parcel to Driver | P0 | `assignments` | Valid assignment appears in driver's date-filtered worklist; detail provides photo if present. |

`P0`/`P1` is **proposed by the PRD**, not a confirmed business commitment. Use it as a sequencing suggestion. A P0 pilot requires real drivers; a restricted staff provisioning mechanism or seeded drivers can satisfy that technical dependency while the full ADM-01 UI is completed in P1.

## 1.3 End-to-end outcome

1. Administrator creates a parcel with sender, recipient, payment type, delivery fee, and address.
2. System generates **two distinct roles of identifiers**: internal parcel code and customer tracking code. Whether their literal values may be identical is NOT specified; keep separate fields until decided.
3. Administrator assigns the parcel to an authorized driver on a delivery date.
4. Driver sees the parcel on the matching day and can inspect all allowed delivery details.
5. Customer enters tracking code and sees the current customer-facing status.
6. If permitted under approved authorization rules, the customer updates receiving place or delivery instructions; driver receives an in-app notification.
7. Driver submits one of the defined driver statuses, with photo as required by future approved policy.
8. Database commits the result, history, and audit information; customer status becomes the approved mapped value.
9. Admin can inspect assignment details and any proof photo.

## 1.4 Explicit exclusions

No online payment processing; customer sign-up/login; live GPS coordinates; algorithmic route optimization or automatically generated driving routes; automated SMS/email/messaging; refunds or parcel returns; recipient signatures; BI/analytics dashboards. Prepaid/COD are **metadata**, not payment collection. A driver's **daily route** means a dated assignment worklist; no geographical path-planning feature is implied.

---

# 2. UNRESOLVED BUSINESS DECISIONS: STOP GATES

Store approved decisions in `docs/decisions/ADR-<number>-<slug>.md`, with owner, date, rationale, and tests impacted. If a decision is not approved, leave its behavior disabled or explicitly marked `pending` in tests and feature flags. **Do not guess.**

| ID | PRD ambiguity | Safe interim engineering plan | Cannot claim complete until |
|---|---|---|---|
| DEC-01 | Exact mapping from driver results (`Customer Unreachable`, `Delivered Home`, `Delivered to Neighbor`, `Leave at Door`) to customer statuses (`Processing Delivery`, `On the Way`, `Delivered`, `Delay`) | Central mapping policy interface; do not hardcode final transitions. PRD only suggests some delivery outcomes ordinarily imply Delivered. | Product owner approves each mapping, including initial/assignment statuses and failure cases. |
| DEC-02 | Expected date wording conflicts: original is described as `Assign Date - 3 days`; PRD proposes `Assign Date + 3 calendar days` | Isolate pure date-calculation strategy behind config; manual `deliveryDate` works independently. | Sign, inclusivity, weekends, and public holiday policy approved. |
| DEC-03 | How customer without an account is allowed to edit receiving preference/instructions | Public tracking is read-only. Separate, secure edit capability/verification contract is drafted but disabled. **Tracking code alone must not automatically grant modification rights.** | Customer authorization mechanism, expiry/revocation, and allowed parcel states approved. |
| DEC-04 | When receiving preferences and instructions become locked | Validation policy interface and configurable allow/deny hook. | Allowed edit window and post-dispatch/post-delivery rules approved. |
| DEC-05 | Max instruction length and other content rules | Server-side schema accepts configurable maximum; no arbitrary production policy. | Limit and rejected content constraints approved. |
| DEC-06 | Photo MIME types, byte limit, count, status-specific mandatory requirement | Secure upload abstraction; reject unapproved production uploads until constraints selected. | Upload rules and photo retention/access policy approved. |
| DEC-07 | Whether notifications are in-app only or also push | Build PRD-required in-app notification bell/list first; do not add external push transport. | Product owner confirms channel(s), recipients on reassignment, and read-state expectations. |
| DEC-08 | Driver authentication and lifecycle unspecified | Use proven authentication solution for secure staff sessions, **minimal internal provisioning**. No public driver registration. | Login method, credential recovery, disable/deactivation, and account ownership approved. |
| DEC-09 | Tracking code delivery channel unspecified | Allow authorized admin to view and copy code manually; no automatic send. | Customer communication mechanism approved if automation required. |
| DEC-10 | Parcel editing after assignment/delivery unspecified | Scope UI to creation/read and only explicitly authorized edits; avoid post-assignment mutation workflows. | Edit matrix and terminal-state locks approved. |
| DEC-11 | Processing Delivery exact meaning, On the Way timing, Delay triggers | Define labels/enums and state transition service; do not infer transitions from arbitrary clicks. | Initial status, dispatch event, and delay semantics approved. |
| DEC-12 | Assign/reassign change notifications and original/new driver behavior | Store immutable change event and target-driver resolver as isolated policy. | Recipient, deduplication, and previous-driver visibility rules approved. |
| DEC-13 | Driver deletion/deactivation, duplicates, login management | Expose only create/list/detail/edit business record; no deletion action in MVP. | Lifecycle/duplicate rules approved if needed. |
| DEC-14 | Tracking page exact public fields | Return **status and generic parcel identifier only** by default, no address, phone, driver name or photo. | Public DTO approved for any additional data. |
| DEC-15 | Exact performance/availability/device/retention targets | Instrument metrics, define provisional engineering test targets as non-business assumptions. | Operational SLA and retention requirements approved. |
| DEC-16 | Order Amount requirement depends on payment rules | Keep DB field nullable with conditional validator policy; UI makes clear policy pending. | Requiredness for Prepaid vs COD, handling of zero/negative fees approved. |

**Approval gate rule:** `DEC-01`, `DEC-03`, `DEC-04`, `DEC-06`, and `DEC-08` affect safety, customer privacy, or operational correctness and must be resolved before affected features are enabled in production. `DEC-02` blocks automated expected-date display, not manual driver assignment.

**Example ADR template:**

```markdown
# ADR-001: Customer delivery-result mapping
Status: proposed | approved | superseded
Decider: [Product owner]
Date: YYYY-MM-DD
Related: DEC-01, CUS-04, DRV-01
Decision: [exact status transition rules]
Alternatives considered: [...] 
Acceptance examples: [Given/When/Then]
Implementation impacts: [...] 
Test IDs unblocked: [...] 
```

---

# 3. TECHNICAL STACK AND ENGINEERING BOUNDARIES

## 3.1 Recommended stack (engineering choices, not PRD requirements)

| Layer | Selected tool | Notes |
|---|---|---|
| Fullstack framework | **Next.js App Router** + React + TypeScript strict | Single application for all three portals and server runtime. Pin supported stable versions at project initialization. |
| Package management | **pnpm** | Commit lockfile; CI uses frozen lockfile. |
| UI | Tailwind CSS + shadcn/ui-style accessible components | Reuse form, table, modal, badge, toast, and navigation primitives. Component source lives in repository. |
| Database | **PostgreSQL** | Foreign keys, transactions, unique indexes, correct concurrent updates. |
| ORM and migrations | **Prisma ORM**, with repo-pinned version and official supported migration workflow | Latest Prisma APIs/scaffold vary; verify current official docs before generating code. Schema below is **logical**, not version-specific Prisma syntax. |
| Validation | **Zod** | Validate requests and env server-side; share schemas where safe. |
| Admin/driver forms | React Hook Form + Zod resolver | Accessible errors and server error reconciliation. |
| Staff authentication | Established auth library compatible with selected Next.js version; default candidate: **Auth.js** | No custom cryptography/session scheme. Driver vs admin role enforced in server service/DAL. Product login experience requires DEC-08. |
| File storage | Private S3-compatible object storage | Signed short-lived upload/download operations only after DEC-06; DB stores object metadata, not blobs. |
| Unit/component tests | **Vitest** + React Testing Library | Domain policies, validators, components, utilities. |
| Integration tests | Vitest + isolated PostgreSQL test database | Exercise real DB constraints, transactions, service methods, and API contracts. |
| Browser E2E | **Playwright** | Cover customer, admin, driver flows and rejection states. |
| Local services | Docker Compose (PostgreSQL; optional S3-compatible emulator in tests) | Reproducible developer environment. |
| CI | GitHub Actions or equivalent | Install, migrations on temp DB, lint/typecheck/test/build and E2E smoke. |
| Operational logging | Structured server logs with request ID | Redact recipient phone/address, credentials, and tracking codes. |

**Keep dependencies lean.** Do not introduce Redis, queues, event buses, microservices, GraphQL, mobile apps, or a map API without a demonstrated need. In-app notifications can initially be stored as database records from a transactional service, subject to DEC-07.

## 3.2 API/data architecture

```text
Browser (Customer / Driver / Admin)
             |
       Next.js App Router
       pages + UI forms
             |
  Next.js Route Handlers / Server Actions
             |
      input validation (Zod)
             |
  authentication and object authorization
             |
    application/domain services
   /          |              \
repositories  event/log logic  storage interface
   |          |              |
PostgreSQL    PostgreSQL    private object store
```

Principles:

- UI components contain rendering and interaction state, **not** cross-user business logic.
- Every write goes through service-level authorization, validation, and a transaction where multiple entities must change atomically.
- A repository layer owns ORM queries; no scattered DB access from arbitrary client-facing modules.
- Route handlers expose explicit API contracts where required; server actions may handle first-party form submissions **only when they call the same protected services**.
- Keep a public tracking DTO separate from private parcel DTOs. Never reuse an admin entity serialization as the customer response.
- Make decisions like status mapping and edit eligibility small testable policy functions.
- Revalidate/refetch delivery status on navigation or relevant mutation; never show stale cached results as confirmed latest data.
- Deploy as one fullstack service initially.

## 3.3 Security model

| Action | Public customer | Assigned driver | Other driver | Admin |
|---|---:|---:|---:|---:|
| Read customer-safe tracking status with valid code | Yes | Yes, if code possessed | Yes, if code possessed | Yes |
| Change receiving preference / instructions | Only with approved proof (DEC-03) | No | No | Not specified; do not add action |
| Read own assigned parcel worklist + private detail | No | Yes | No | Access through admin assignments |
| Submit driver delivery result/photo | No | Yes | No | Not specified; do not add action |
| Read own notifications | No | Yes | No | No, unless expressly approved |
| Create/view/edit driver record | No | No | No | Yes |
| Create parcel + tracking code | No | No | No | Yes |
| Assign/reassign parcel | No | No | No | Yes |
| Inspect admin assignment/detail/photo | No | No | No | Yes |

**Enforce object-level checks in the DAL/service and before mutations.** Hiding buttons does not enforce access. Ownership checks must use current DB assignment, not a user-provided `driverId`. All staff mutations require valid sessions. Public tracking requires enumeration protection, response minimization, and rate limiting; exact thresholds are engineering configuration, not product requirements.

## 3.4 Error response contract

Recommended internal API response shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted fields.",
    "fieldErrors": {"contactNumber": ["Required"]},
    "requestId": "opaque-id"
  }
}
```

Recommended categories: `VALIDATION_ERROR` (400/422), `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500). These are API design proposals, not product status labels. Keep 404-style nonrevealing responses for inaccessible parcel/driver resources when useful to prevent enumeration. Never expose stack traces or raw DB errors to browsers.

---

# 4. SUGGESTED AGENT-FRIENDLY PROJECT STRUCTURE

The user requested that Codex should **further create** the final project structure. Treat this as the **starting blueprint**, adjustable at repository initialization, not an instruction that an empty directory tree must be blindly generated.

```text
parcel-delivery/
├── AGENTS.md                       # coding-agent constraints and checkpoints
├── README.md                       # human setup and architecture summary
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── vitest.config.ts
├── playwright.config.ts
├── docker-compose.yml
├── .env.example                     # names only, no secrets
├── .github/workflows/ci.yml
├── prisma/
│   ├── schema.prisma                # or current version's supported schema location
│   ├── migrations/
│   └── seed.ts
├── docs/
│   ├── implementation-plan.md      # copy of this document
│   ├── requirements-matrix.md      # PRD to code/test traceability
│   ├── decisions/
│   │   ├── README.md
│   │   └── ADR-001-*.md
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── data-model.md
│   │   ├── permission-matrix.md
│   │   └── api-contracts.md
│   ├── testing/
│   │   ├── test-plan.md
│   │   ├── fixtures.md
│   │   └── release-checklist.md
│   └── runbooks/
│       ├── local-development.md
│       ├── migration-and-backup.md
│       └── deployment-and-rollback.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── (public)/
│   │   │   └── track/page.tsx
│   │   ├── (staff)/
│   │   │   ├── login/page.tsx
│   │   │   ├── driver/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── deliveries/page.tsx
│   │   │   │   ├── deliveries/[parcelCode]/page.tsx
│   │   │   │   └── notifications/page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── parcels/page.tsx
│   │   │       ├── parcels/new/page.tsx
│   │   │       ├── parcels/[parcelCode]/page.tsx
│   │   │       ├── assignments/page.tsx
│   │   │       ├── assignments/[id]/page.tsx
│   │   │       ├── drivers/page.tsx
│   │   │       ├── drivers/new/page.tsx
│   │   │       └── drivers/[id]/page.tsx
│   │   └── api/
│   │       └── v1/
│   │           ├── tracking/[code]/route.ts
│   │           ├── customer/parcels/[code]/preferences/route.ts # DEC-03 gated
│   │           ├── admin/parcels/route.ts
│   │           ├── admin/parcels/[id]/route.ts
│   │           ├── admin/drivers/route.ts
│   │           ├── admin/drivers/[id]/route.ts
│   │           ├── admin/assignments/route.ts
│   │           ├── admin/assignments/[id]/route.ts
│   │           ├── driver/assignments/route.ts
│   │           ├── driver/assignments/[id]/route.ts
│   │           ├── driver/assignments/[id]/result/route.ts
│   │           ├── driver/notifications/route.ts
│   │           └── files/*                      # exact photo flow after DEC-06
│   ├── features/
│   │   ├── parcels/
│   │   │   ├── components/
│   │   │   ├── schemas.ts
│   │   │   ├── service.ts
│   │   │   ├── repository.ts
│   │   │   ├── mapper.ts
│   │   │   └── tests/
│   │   ├── tracking/                   # public DTO and lookup
│   │   ├── drivers/
│   │   ├── assignments/
│   │   ├── driver-worklist/
│   │   ├── delivery-results/
│   │   ├── customer-preferences/
│   │   └── notifications/
│   ├── lib/
│   │   ├── db/connection.ts
│   │   ├── auth/session.ts
│   │   ├── auth/permissions.ts
│   │   ├── auth/authorization.ts
│   │   ├── http/api-response.ts
│   │   ├── http/rate-limit.ts
│   │   ├── observability/logger.ts
│   │   ├── storage/private-object-store.ts
│   │   ├── config/env.ts
│   │   ├── dates/business-calendar.ts
│   │   └── errors/app-error.ts
│   ├── components/ui/
│   └── types/
├── tests/
│   ├── integration/
│   │   ├── parcels.integration.test.ts
│   │   ├── tracking.integration.test.ts
│   │   ├── assignments.integration.test.ts
│   │   ├── driver-results.integration.test.ts
│   │   ├── notifications.integration.test.ts
│   │   └── authorization.integration.test.ts
│   ├── e2e/
│   │   ├── admin-create-and-assign.spec.ts
│   │   ├── public-tracking.spec.ts
│   │   ├── driver-daily-delivery.spec.ts
│   │   ├── customer-preferences.spec.ts
│   │   ├── notifications.spec.ts
│   │   └── security-isolation.spec.ts
│   ├── fixtures/
│   └── helpers/
└── scripts/
    ├── check-env.ts
    └── smoke-test.ts
```

**Structural conventions:**

- `src/app` is routing/composition only. Application rules belong in `src/features/*/service.ts`.
- `schemas.ts` defines Zod runtime validation; avoid trusting TypeScript types on incoming JSON.
- Domain repositories may accept a transaction client for atomic multi-record writes.
- Domain events and notifications must not create circular imports.
- Use `server-only` for modules containing sessions, secrets, private DTOs, and DB access.
- Test helpers provide isolated fixtures; avoid fragile tests that depend on one global seeded data set.
- Avoid creating unused framework layers. Create folders when the related feature is implemented.

---

# 5. PROPOSED DOMAIN MODEL AND DATABASE RULES

The PRD defines **fields and behavior**, not database tables. The entities below are an engineering translation to be refined by Codex without adding business features.

## 5.1 Logical entities

| Entity | Essential fields | Constraints / comments |
|---|---|---|
| `StaffUser` | `id`, `role` (ADMIN/DRIVER), `authIdentity`, timestamps | Internal authentication identity; exact onboarding DEC-08. Do not create customer accounts. |
| `Driver` | `id`, `staffUserId?`, `name`, `contactNumber`, `vehicleType`, `vehicleNumber`, timestamps | Name, contact, type, number required per ADM-01. Driver record and login identity may be separate until onboarding policy resolved. |
| `Parcel` | `id`, `parcelCode`, `trackingCode`, `senderBusinessOrPersonName`, `receivedDate`, `receivedPerson`, `customerName`, `customerContactNumber`, `paymentType`, `orderAmount?`, `deliveryFee`, `township`, `address`, `remark?`, `customerStatus`, timestamps | Unique identifiers; order-amount rules DEC-16; current customerStatus stored or derived consistently. |
| `DeliveryAssignment` | `id`, `parcelId`, `driverId`, `assignDate`, `deliveryDate`, `createdBy`, `updatedAt`, `version?` | Assignment must reference real parcel/driver. Decide policy for replacing vs historical assignments and enforce a clear current assignment. |
| `DeliveryResult` | `id`, `assignmentId`, `parcelId`, `driverId`, `driverStatus`, `submittedAt`, `photoId?`, `requestKey?` | Immutable submission record preferred. At minimum preserve last result, submitter, timestamp, and photo link. |
| `DeliveryPhoto` | `id`, `objectKey`, `mimeType`, `byteSize`, `uploadedBy`, `parcelId`, `assignmentId`, `createdAt` | Private storage only; no public object URLs. File constraints DEC-06. |
| `ParcelPreference` | `parcelId`, `receivingPlace`, `instructionText?`, `updatedAt` | One current preference per parcel; approved edit authorization DEC-03/04. |
| `DriverNotification` | `id`, `driverId`, `parcelId`, `assignmentId?`, `type`, `occurredAt`, `title`, `message`, `payloadJson?` | In-app list, date/code filter; what counts as read is optional unless approved. |
| `ParcelStatusHistory` | `id`, `parcelId`, `priorStatus?`, `nextStatus`, `source`, `actorId?`, `createdAt` | Technical auditability and debugging, not an analytics dashboard. |
| `OperationalAuditEvent` | `id`, `actorType`, `actorId?`, `entityType`, `entityId`, `action`, `occurredAt`, `safeMetadataJson?` | Record changes without logging raw personal data. |

## 5.2 Domain enums (use exact PRD labels in UI)

```text
Customer-facing:
  PROCESSING_DELIVERY -> "Processing Delivery"
  ON_THE_WAY          -> "On the Way"
  DELIVERED           -> "Delivered"
  DELAY               -> "Delay"

Driver result:
  CUSTOMER_UNREACHABLE -> "Customer Unreachable"
  DELIVERED_HOME       -> "Delivered Home"
  DELIVERED_NEIGHBOR   -> "Delivered to Neighbor"
  LEAVE_AT_DOOR        -> "Leave at Door"

Receiving place:
  RECEIVE_AT_HOME      -> "Receive at Home"
  LEAVE_WITH_NEIGHBOR  -> "Leave with Neighbor"
  DROP_OFF_AT_DOOR     -> "Drop Off at Door"

Payment:
  PREPAID -> "Prepaid"
  COD     -> "Cash on Delivery (COD)"
```

Do not conflate receiving preference (`Drop Off at Door`) with driver result (`Leave at Door`). Do not add additional operational statuses as business labels without owner approval. A technical `notMapped`/`pendingDecision` state may exist internally to prevent accidental fake updates.

## 5.3 Key invariants

1. `parcelCode` has a unique DB constraint; `trackingCode` has a separate unique DB constraint.
2. Prefer cryptographically random, nonsequential tracking codes with sufficient entropy to resist guessing, subject to approved display format; never expose internal integer database IDs publicly.
3. One tracking code resolves to at most one parcel. Invalid values return generic errors and cannot leak other parcel info.
4. Driver worklist queries include a condition on the **authenticated driver's current identity**.
5. Updating assignment and related worklist/notification state happens as one logical operation. Reassignment cannot leave two conflicting active drivers.
6. A successful delivery result submission persists the driver result, audit metadata, and approved customer status consistently.
7. A failed upload/submission does not modify the public status.
8. A preference change belongs to one parcel only and alerts the driver responsible under approved rules.
9. Duplicate request retries must not produce duplicate results/notifications/photos. Use an idempotency key or equivalent deduplication for network-retried writes.
10. Dates are stored as calendar-date fields if semantically dates; timestamps in UTC. Clearly define timezone presentation (deployment locale; product region assumed Myanmar only for examples, not enforced business rule).
11. Photos cannot be served through an unauthenticated public URL.
12. Status history and assignment ownership must remain traceable if a driver changes.

## 5.4 Important indexes and integrity checks

- Unique: `Parcel.parcelCode`, `Parcel.trackingCode`.
- Index: `DeliveryAssignment(driverId, deliveryDate)` for daily worklist.
- Index: `DeliveryAssignment(parcelId)` plus DB-enforced current-assignment uniqueness pattern.
- Index: `DriverNotification(driverId, occurredAt)` and optionally `(driverId, parcelId)` for filter.
- Index: `DeliveryResult(parcelId, submittedAt)`.
- Foreign keys: all parcel, driver, assignment and photo references.
- Use DB transactions and optimistic revision checks or row locking where concurrent assignment/result writes can conflict.
- Sensitive fields should be excluded from logs and public DTOs. Database backups and object storage access must be restricted.

---

# 6. PROPOSED SCREEN AND API CONTRACTS

These are engineering interfaces, not additional PRD features. Update paths and payloads when implementation conventions are decided; keep behavior traceability.

## 6.1 Pages

| URL | Segment | Content / core actions | PRD |
|---|---|---|---|
| `/track` | Public | Code input, submit, status / invalid-code error. Preference controls only after DEC-03 authorization. | CUS-01/02/03/04 |
| `/login` | Staff | Approved secure login, no public sign-up. | Access dependency |
| `/driver/deliveries?date=YYYY-MM-DD` | Driver | Assigned parcels: name, contact, township, code, status. Filter by date; copy contact; open detail. | DRV-01 |
| `/driver/deliveries/[parcelCode]` | Driver | Address, receiving preference, instruction, result dropdown, photo upload, submit. | DRV-01 |
| `/driver/notifications` | Driver | Bell list; date and parcel code filters; click through to authorized parcel. | DRV-02 |
| `/admin/parcels` | Admin | Operational parcel list and navigation to create/detail. | ADM-02 |
| `/admin/parcels/new` | Admin | Sender/recipient/payment/address form, generated codes on success. | ADM-02 |
| `/admin/parcels/[parcelCode]` | Admin | Parcel details and authorized read-only info. | ADM-02 |
| `/admin/assignments` | Admin | Parcel code, driver, assign date, delivery date, status; no photo in list. Create or edit assignment. | ADM-03 |
| `/admin/assignments/[id]` | Admin | Assignment detail and photo when present. | ADM-03 |
| `/admin/drivers` | Admin | Driver list/create navigation. | ADM-01 |
| `/admin/drivers/new` | Admin | Driver creation form. | ADM-01 |
| `/admin/drivers/[id]` | Admin | Driver detail/edit. | ADM-01 |

Layout requirement: phone-friendly driver experience (dense data but clear touch targets), form clarity, keyboard accessibility, focus management, server-side loading/errors, empty states. No specific branding/design system is mandated by PRD.

## 6.2 API endpoint inventory

| Verb + endpoint (proposed) | Who | Inputs and outcome |
|---|---|---|
| `GET /api/v1/tracking/:code` | Public | Returns customer-safe DTO (`trackingCode`, `status`), generic invalid-code error. Never return phone/address/photo. |
| `PATCH /api/v1/customer/parcels/:code/preferences` | Approved customer authorization only | Updates `receivingPlace` and/or `instructionText`, validates eligibility, emits change event. **DEC-03/04 blocked.** |
| `POST /api/v1/admin/parcels` | Admin | Validates parcel form, creates parcel and unique codes atomically. |
| `GET /api/v1/admin/parcels` | Admin | Paginated operational list (pagination is an engineering concern). |
| `GET /api/v1/admin/parcels/:id` | Admin | Full authorized parcel detail. |
| `GET /api/v1/admin/drivers` | Admin | Driver list. |
| `POST /api/v1/admin/drivers` | Admin | Create required driver record. |
| `GET /api/v1/admin/drivers/:id` | Admin | Driver detail. |
| `PATCH /api/v1/admin/drivers/:id` | Admin | Edit allowed driver fields. |
| `GET /api/v1/admin/assignments` | Admin | Assignment list, current status; omit photo from list payload unless needed as simple boolean. |
| `POST /api/v1/admin/assignments` | Admin | Assign parcel to driver, set dates. |
| `PATCH /api/v1/admin/assignments/:id` | Admin | Update driver/date where allowed, enforce concurrency checks, emit change alerts. |
| `GET /api/v1/admin/assignments/:id` | Admin | Detail includes authorized photo access metadata. |
| `GET /api/v1/driver/assignments?date=...` | Driver | Current user's dated worklist only. |
| `GET /api/v1/driver/assignments/:id` | Driver | Own current assignment detail only. |
| `POST /api/v1/driver/assignments/:id/result` | Driver | One valid status, optional photo reference as approved, writes audit and customer-facing update. |
| `GET /api/v1/driver/notifications?date=...&parcelCode=...` | Driver | Own notifications, filtered by date/code. |
| Photo upload/read endpoints | Authenticated affected driver/admin | Secure storage flow. Exact endpoints/file constraints after DEC-06. |

**HTTP notes:** Use stable API response DTOs and Zod parsing. Do not trust any client-provided `driverId` for write authorization. Set `Cache-Control: no-store` or equivalent validated dynamic read semantics for sensitive/rapidly changing responses. CSRF defenses apply to cookie-authenticated mutations. Rate-limit public tracking and auth endpoints. For public tracking, URL codes may enter browser history/logs; redact server logging and avoid unnecessarily exposing tracking codes to third parties.

## 6.3 Representative DTO sketches

```ts
// Engineering contract sketch, not copy/paste of a complete schema.
type PublicTrackingDTO = {
  trackingCode: string;
  status: "Processing Delivery" | "On the Way" | "Delivered" | "Delay";
};

type DriverWorklistItemDTO = {
  assignmentId: string;
  parcelCode: string;
  customerName: string;
  customerContactNumber: string;
  township: string;
  status: PublicTrackingDTO["status"];
};

type DriverParcelDetailDTO = DriverWorklistItemDTO & {
  addressDetail: string;
  receivingPlace: "Receive at Home" | "Leave with Neighbor" | "Drop Off at Door";
  deliveryInstruction: string | null;
  deliveryDate: string;
};
```

If a preference has not yet been selected, model `receivingPlace` as nullable rather than silently assuming `Receive at Home`; the example above represents a *populated* detail, not a mandatory default. If customer-facing status is awaiting DEC-01 mapping, do not return an invented status as if finalized.

---

# 7. EXCEPTIONAL UX/UI DESIGN SPECIFICATION (MANDATORY)

## 7.1 Product experience north star

**Make the correct next action obvious in under five seconds.** The product should feel calm, fast, reliable, and almost invisible. Prioritize task completion over decoration. Every element must earn its place by helping users understand status, make a decision, or complete an action.

**Design direction:** minimalist, content-first, mobile-first for customers and drivers, efficient desktop-first administration with fully functional mobile layouts. Use **Sora** for all Latin-script UI typography, with a tested, legible fallback for Myanmar-language text if localized content is introduced. Avoid excessive cards, borders, shadows, icons, colorful status pills, gradients, and decorative illustrations. Never sacrifice comprehension for minimalism.

**Inspiration for design study, not feature copying:** Apple parcel/order-status experiences (hierarchy and restraint), Shopify's order-status experience (clear progress and context), Uber's trip-status patterns (current state and next action), DHL/FedEx tracking interfaces (shipment milestones), and Linear's operations UI (dense but disciplined information hierarchy). These are *design references*, not a claim that the PRD authorizes their functionality. Codex should inspect current public examples or provided screenshots before making visual comparisons and record findings in `docs/design/reference-audit.md`. Do not copy proprietary assets or interfaces verbatim.

## 7.2 Non-negotiable visual system

| Token | Proposed specification | Rationale |
|---|---|---|
| Font | Sora via `next/font/google` | Unified typography; self-hosted at build time |
| Background | `#FFFFFF` main; `#F8FAFC` only for secondary surfaces | Calm, low-noise UI |
| Text | `#111827` primary; `#475569` secondary | Clear hierarchy |
| Brand accent | One restrained accent, proposed `#4F46E5` pending brand approval | One obvious primary action |
| Success / caution / error | Accessible semantic tokens, paired with text | Never color-only communication |
| Spacing | 4px base grid; common gaps 8/12/16/24/32 | Rhythm and predictability |
| Radius | 8-12px for inputs/cards; avoid overly rounded everything | Quiet consistency |
| Borders | Subtle 1px dividers only where grouping requires them | Reduce visual clutter |
| Shadows | None by default; restrained elevation for overlays | Avoid floating-card overload |
| Body type | 14-16px depending on surface; 16px for mobile inputs | Readable, prevents mobile zoom |
| Touch targets | Minimum 44×44 CSS pixels, with sufficient separation | Driver usability |
| Content width | Customer 560-720px; admin content responsive to tables | Focus and scannability |
| Motion | 120-220ms subtle transitions; respect reduced motion | Responsiveness without distraction |

These are **proposed design decisions**, not PRD facts. Centralize tokens in `src/styles/tokens.css` (or equivalent) and document brand approval in `docs/decisions/`.

### Font implementation

```tsx
// src/app/layout.tsx (illustrative)
import { Sora } from 'next/font/google';
const sora = Sora({ subsets: ['latin'], display: 'swap', variable: '--font-sora' });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={sora.variable}><body>{children}</body></html>;
}
```

Use `font-family: var(--font-sora), system-ui, sans-serif` and validate fallback rendering for non-Latin characters. Avoid extra font families except when a locale genuinely requires one.

## 7.3 User journeys and low-friction rules

### Customer: track parcel
1. Open tracking page; see one headline, one tracking input, one primary **Track parcel** button.
2. Paste or type code; trim surrounding whitespace; show an inline validation error only if necessary.
3. Submit by Enter or button; preserve entered code; show immediate progress feedback.
4. Display the **current status first**, followed by parcel code and only information the PRD authorizes.
5. If code is invalid or not found, show a clear non-technical message and an easy retry path. Avoid revealing sensitive parcel details.
6. If customer preference editing is approved, reveal receiving option and instructions as a quiet secondary section, not a competing hero CTA.

**Acceptance:** one obvious primary action; no sign-up wall; keyboard submission; no modal to see status; no layout jumps; status understood without decoding colors; error recovery without retyping where possible.

### Customer: change receiving preference / instructions
1. Show existing selection in plain language.
2. Offer exactly the three PRD options in a single-select group, using large tap areas.
3. Show instructions as an optional, concise text field with a visible limit once approved.
4. Save explicitly; disable duplicate submission; confirm saved state in place.
5. If editing is no longer permitted, explain why and preserve read-only visibility.

**Security stop gate:** knowing a tracking code alone does not automatically authorize modifying delivery instructions. Implement editing only after product-owner approval of a secure authorization mechanism. Do not introduce customer accounts unless approved.

### Driver: daily worklist
1. Open directly to today's assigned parcels, or the selected date if persisted locally; do not assume route optimization.
2. Put date selection and task count at the top; keep list rows easy to scan.
3. Each row shows recipient, township, parcel code, and current status. Make copy-phone available with a labeled accessible control.
4. Tapping a row opens parcel details with address and latest receiving preference prominently placed.
5. Show one primary **Submit delivery result** action; status choices use exact PRD labels.
6. Photo upload is integrated into the result flow, with thumbnail, retry, and error feedback; enforce mandatory-photo rules only once approved.
7. After success, show a clear confirmation and return to worklist without losing date/filter context.

**Acceptance:** driver can identify next parcel quickly, copy phone with one action, submit with minimal fields, never lose form state on failed network requests, and cannot accidentally submit twice. Do not add navigation/maps without approval.

### Driver: notifications
- Bell icon with accessible label and unread state if implemented; notification list sorted newest first.
- Show **what changed**, affected parcel, and when; provide direct navigation to the relevant authorized parcel.
- Date and parcel-code filters must be obvious but visually quiet.
- Avoid repeated popups and toast storms; distinguish an actual notification from background refresh.

### Admin: parcel creation
1. Use a clear sectioned form: Sender, Recipient, Payment, Delivery Details.
2. Keep labels always visible; required fields indicated consistently.
3. Preserve entered data when validation fails; place inline errors near fields and summarize errors when useful.
4. Use proper keyboard/input types for phone, amount, and dates; do not force arbitrary formatting.
5. Show generated parcel/tracking codes after successful save with one-click copy.
6. Do not auto-send tracking codes without an approved communication channel.

**Acceptance:** keyboard-only form completion; correct focus on errors; clear Prepaid/COD choices; no ambiguous submit state; no lost input after validation failure.

### Admin: assignments and driver management
- Show the essential table columns from the PRD; use readable row density and sticky headers on large lists.
- Filters should not obscure content; support search/filter only where PRD requires or as a documented usability enhancement without changing scope.
- Prefer a focused detail view over giant edit modals for complex tasks.
- Reassignment must clearly identify old/new driver and date, show pending/save/success states, and update both drivers' authorized worklists.
- Driver form should expose only name, contact, vehicle type, and vehicle number unless additional fields are approved.

## 7.4 Component library and UI architecture

Create a small design system before feature screens:

```text
src/
  components/
    ui/              # Button, Input, Textarea, Select, RadioGroup, Badge, Dialog,
                     # Toast, Skeleton, EmptyState, InlineError, Field, Table
    layouts/         # CustomerShell, DriverShell, AdminShell
    parcels/         # ParcelStatus, TrackingResult, ParcelSummary, ReceivingOptions
    driver/          # DailyWorklist, DeliveryResultForm, NotificationItem
    admin/           # ParcelForm, DriverForm, AssignmentForm, AssignmentTable
  styles/
    tokens.css
  lib/
    ui/              # status presentation mapping, formatting, accessible labels
  tests/
    visual/          # Playwright screenshots and baselines
    a11y/            # accessibility checks
  docs/design/
    principles.md
    reference-audit.md
    user-flows.md
    screen-specs.md
    tokens.md
    ux-test-report.md
```

Use accessible headless primitives (e.g., Radix/shadcn-style composition) when useful, but **do not install a huge component kit by default**. Keep business logic outside presentational components. Never invent a status or an action in UI just to fill whitespace.

## 7.5 Required screen states for every view

Codex must implement and test: **initial, loading, populated, empty, validation error, network/server error, unauthorized/forbidden, successful mutation, and mobile narrow viewport** as applicable. Loading placeholders should resemble final content dimensions to prevent layout shift. Empty states explain the situation and offer a meaningful next step, not generic decoration. Errors use plain language and offer retry where safe. For async saves, show pending and success distinctly. Avoid blocking the whole screen when only one region updates.

## 7.6 Accessibility and internationalization quality bar

- Target WCAG 2.2 AA: contrast, visible focus, semantic headings, labels, keyboard operation, screen-reader status announcements, predictable focus order.
- Verify 200% zoom and 320px CSS width without loss of core functionality; data tables may scroll horizontally with clear affordance.
- No placeholder-only labels, hover-only controls, color-only states, or unlabeled icon buttons.
- Use `aria-live` selectively for result/error/success messages; never announce every polling update.
- Ensure accessible drag-free operation and no gesture-only required action.
- Check Sora numeral legibility and font fallbacks with Myanmar text; language support beyond the approved product scope must not be invented.
- Confirm date/time display conventions and local timezone before shipping date-sensitive copy.

## 7.7 UX validation plan (mandatory, not optional polish)

| Test | Procedure | Pass condition |
|---|---|---|
| Five-second clarity | Show each page to a first-time user for five seconds | User correctly identifies primary task and current state |
| Customer tracking | Observe 5 representative participants entering codes | At least 4/5 complete without assistance; no critical confusion |
| Driver delivery | Observe 5 representative drivers or proxies with realistic parcel data | At least 4/5 complete status + photo flow unaided |
| Admin parcel entry | Observe 5 representative admins or proxies entering a parcel | At least 4/5 finish unaided; no critical data mistakes |
| Keyboard-only | Complete all forms and dialogs without mouse | All actions available and focus remains sensible |
| Screen reader | Test main journeys with VoiceOver or NVDA | Controls/statuses understandable; no blocking issues |
| Responsive | Test 320, 375, 768, 1024, 1440px | No clipped essential controls or unintended page overflow |
| Visual regression | Screenshot baseline in Playwright per critical state | No unapproved differences after review |
| Error recovery | Simulate timeout, invalid input, double click, stale state | Clear feedback; no lost data or duplicate updates |
| Performance | Run Lighthouse on representative production build | Aim for LCP ≤2.5s, CLS ≤0.1, INP ≤200ms at p75 where measurable |

These thresholds are **proposed engineering quality targets** and must be measured, not claimed in advance. Log observed issues by severity (blocking / major / minor) and fix all blocking issues before release.

## 7.8 Design implementation sequence

- **UX-01: Reference audit.** Review comparable product patterns, note what reduces friction, reject unnecessary features. Deliver `reference-audit.md`.
- **UX-02: Task-flow mapping.** Write success/error paths for all three personas. Deliver `user-flows.md`.
- **UX-03: Information architecture.** Establish minimal navigation for customer, driver, admin without extra routes.
- **UX-04: Design tokens.** Implement Sora, type scale, spacing, surfaces, focus, status semantics.
- **UX-05: Low-fidelity wireframes.** Sketch all core pages plus empty/error/loading states; review against PRD.
- **UX-06: Component primitives.** Build and unit-test accessible reusable components.
- **UX-07: Screen implementation.** Build mobile customer/driver experiences and responsive admin workflows.
- **UX-08: Interaction refinement.** Add clear pending/success states, input preservation, keyboard shortcuts only when discoverable.
- **UX-09: Accessibility and usability testing.** Run automated and observed tests; document findings and fixes.
- **UX-10: Visual QA gate.** Review screenshots, spacing consistency, typography, and noise reduction before accepting each screen.

**Design Definition of Done:** Every visible control has a purpose; one clear primary action per screen/context; correct PRD wording; responsive layout; all relevant states; keyboard and screen-reader access; visual regression evidence; no unresolved critical UX findings.

---

# 8. STEP-BY-STEP ENGINEERING DELIVERY PLAN

Each phase requires implementation, automated tests, manual smoke testing, evidence, and a passing acceptance gate before moving to dependent phases. PRD business decisions remain blocked until approved.

| Phase | Deliverables | Automated tests | Acceptance gate |
|---|---|---|---|
| 0. Repository audit | Inspect repo; `AGENTS.md`; decisions log; commands; env template; CI skeleton | Baseline lint/typecheck/build | Clean reproducible install/build and documented gaps |
| 1. App foundation | Next.js App Router, TS, Sora, responsive shells, tokens, error/loading boundaries | UI primitive unit tests, a11y smoke | Customer/driver/admin shells responsive; Sora active |
| 2. Data layer | PostgreSQL migrations, ORM schema, unique codes, seed fixtures, constraints | Migration tests, schema integrity, uniqueness collisions | Fresh DB migrate/seed/reset reliably; uniqueness enforced |
| 3. Identity/access | Admin/driver auth as approved, RBAC, route/API guards; public tracking read restrictions | Authz integration, IDOR/forbidden tests, CSRF checks | Drivers cannot read/write another driver's assignments |
| 4. Admin drivers | Driver create/list/detail/edit, validation | Form, API, DB tests | ADM-01 required fields validated and records reusable |
| 5. Admin parcels | Parcel form, sender/recipient/payment, unique codes, retrieval | COD/prepaid validation, collision, API tests | ADM-02 creates correct parcel; tracking code resolves only it |
| 6. Assignments | Parcel-driver-date assignment, list/detail, photo access, reassign | Referential integrity, reassign concurrency, visibility | ADM-03 parcel appears for correct driver/date; stale assignments removed |
| 7. Driver worklist | Date-filtered list, detail, copy phone, instructions | Date filters, permissions, copy control, responsive E2E | DRV-01 authorized driver completes list/detail journey |
| 8. Delivery results | Status select, photo upload, atomic save, audit timestamp | Status validation, upload failure, duplicate submit, transaction rollback | Result saved once, photo attached correctly, no partial inconsistent state |
| 9. Customer tracking | Public tracking input, valid/invalid result, current status | Public DTO privacy, rate limit, tracking E2E | CUS-01/CUS-04 display only correct approved latest status |
| 10. Customer preferences | Three choices, instructions, update workflow | Authorization, change rules, limits, notifications | CUS-02/CUS-03 only after edit-auth and timing rules approved |
| 11. Notifications | Bell, list, filters, relevant change events | Trigger, recipient, filtering, duplicate-event tests | DRV-02 right driver receives correct notification |
| 12. Quality hardening | Responsive/a11y/visual/security/performance suites; production runbook | Full CI suite, Playwright, axe, load smoke | No critical bugs; acceptance matrix signed off |

### Phase execution protocol

For **each** phase:
1. Read source PRD requirement IDs and approved decision records.
2. Write an implementation checklist with explicit file paths and dependencies.
3. Define test fixtures, expected API payloads, error cases, and accessibility states *before coding*.
4. Implement the smallest vertical slice from database to API to UI.
5. Add unit tests for domain rules, integration tests for persistence/API, and Playwright E2E for the user journey.
6. Run `lint`, `typecheck`, unit/integration tests, production build, and relevant E2E tests.
7. Review mobile and desktop screenshots, keyboard navigation, loading/empty/error states.
8. Update requirement traceability and report pass/fail evidence; do not mark done on code completion alone.

## 8.1 Detailed acceptance scenarios

**CUS-01 Tracking**: Given valid code, when submitted, then only that parcel's current approved public status appears. Given invalid code, show a recoverable error. Given a different parcel code, never expose the previous parcel's information.

**CUS-02 Receiving place**: Given an authorized and eligible customer, when selecting one of the three approved options and saving, then preference persists and assigned driver sees it. Given ineligible/unauthorized attempt, no mutation occurs. **Blocked until edit authorization and eligibility approved.**

**CUS-03 Instructions**: Given authorized eligible edit, valid instruction persists and is shown to assigned driver; invalid/over-limit input fails with a helpful inline message and preserves text. **Blocked until limit and edit rules approved.**

**CUS-04 Updated status**: Given successful driver result, tracking shows mapped customer status; failed driver submission leaves public status unchanged. **Blocked until mapping approved.**

**DRV-01 Worklist/results**: Given logged-in driver and date, show only assigned parcels; detail contains all required fields; contact number copies; valid result and photo save atomically; other driver's parcel is forbidden.

**DRV-02 Notifications**: Given preference/instruction/assignment/route change, notify affected authorized driver(s) according to approved rules; date/code filters work; notification opens correct authorized parcel. **Transport and reassignment recipient rules require approval.**

**ADM-01 Drivers**: Required name, contact, vehicle type, vehicle number; invalid records rejected; valid driver appears in assignment picker.

**ADM-02 Parcels**: Required sender/recipient/payment/address data validated; Prepaid/COD supported; unique parcel and tracking codes; tracking code corresponds to exactly one parcel.

**ADM-03 Assignments**: Admin selects valid parcel, driver, assignment/delivery dates; list and detail show required data; photo only in detail; reassign updates visibility and triggers approved notifications. **Expected delivery-date formula requires approval.**

## 8.2 Test organization and command contract

```text
tests/
  unit/            # pure domain functions, formatting, status mappings
  integration/     # DB + route handlers/actions + permissions + transactions
  e2e/             # Playwright persona journeys, responsive and error recovery
  visual/          # reviewed screenshot baselines
  a11y/            # axe and manual audit records
  fixtures/        # deterministic parcels, drivers, assignments, statuses
```

Codex must wire repository-specific scripts for `lint`, `typecheck`, `test:unit`, `test:integration`, `test:e2e`, `test:a11y`, and `build`. Never report a test as passing without running it. Use isolated test DB and deterministic fixtures; do not run destructive tests against production. CI must block merges on failing required checks.

### Security and failure-mode test matrix

| Case | Expected result |
|---|---|
| Driver requests another driver's parcel | 403/404 with no sensitive disclosure |
| Customer guesses a tracking code | Rate-limited public endpoint; minimum approved fields only |
| Unapproved preference edit via tracking code | Rejected; no DB mutation |
| Two admins assign same parcel concurrently | Defined conflict policy; no contradictory active assignment |
| Driver submits result twice | Idempotent handling or safe duplicate rejection |
| Photo upload fails mid-submission | No false delivered state; retry supported |
| Network drops after submit | User can recover without unsafe duplicate result |
| Invalid payment or missing address | Inline validation; no partial parcel created |
| Reassignment while driver views parcel | Stale driver's subsequent mutation rejected |
| Status mapping undecided | No invented public status transformation shipped |

## 8.3 Final release checklist

- [ ] All P0 features pass end-to-end acceptance tests.
- [ ] P1 features included only when their approval gates are resolved.
- [ ] Every PRD ID mapped to implemented code, tests, and evidence.
- [ ] All roles tested for unauthorized access and data leakage.
- [ ] All relevant loading/empty/error/success states verified.
- [ ] Sora and responsive design verified on target devices.
- [ ] Accessibility and visual regression checks pass.
- [ ] No blocking usability-test findings remain.
- [ ] Migration/rollback, backups, environment setup, and deployment documented.
- [ ] No excluded PRD features silently added.
- [ ] Codex handoff includes open decisions, known limitations, test commands, and next safe task.

---

# 9. COPY-PASTE CODEX HANDOFF PROMPT

```text
Read Parcel_Delivery_Codex_Implementation_Plan.md and the original parcel-delivery PRD before writing code. Treat the PRD as business source of truth. First inspect the repository, produce an agent-friendly AGENTS.md, docs/decisions/ register, docs/design/ UX artifacts, and a dependency-ordered task plan. Use fullstack Next.js App Router + TypeScript + PostgreSQL, and Sora as the primary Latin UI font. The UX should be exceptionally clear, calm, accessible, mobile-first for customer/driver, and low-friction; do not add ornamental UI or unapproved features. Follow Sections 7-8 for screen states, design QA, testing, and acceptance criteria. Implement in small vertical slices. For every slice: identify PRD IDs, write tests, implement, run lint/typecheck/tests/build, capture UX QA evidence, and report results. Stop and request product-owner decisions for explicitly unresolved business rules; never guess approvals. Start with Phase 0 and Phase 1 only, and report the next safe task.
```
