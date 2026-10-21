# Product decision register

Canonical approval status and ADR links live in ../delivery/backlog.json under decision_register. All start proposed. No approval is inferred from examples, candidate policies or this structure.

| ID | Decision needed |
|---|---|
| DEC-01 | Driver result to customer status mapping, retries and terminal transitions |
| DEC-02 | Expected-date sign, calendar/business days, inclusivity and holidays |
| DEC-03 | Customer edit proof, expiry, revocation and parcel scope |
| DEC-04 | Customer edit window and lock states |
| DEC-05 | Instruction length and content constraints |
| DEC-06 | Photo types, size, count, mandatory rules, access and retention |
| DEC-07 | Notification channels and read-state expectations |
| DEC-08 | Staff login, provisioning, recovery, disabling and account ownership |
| DEC-09 | Tracking-code communication channel |
| DEC-10 | Parcel edit matrix after assignment and delivery |
| DEC-11 | Initial status, Processing Delivery meaning, dispatch and delay triggers |
| DEC-12 | Reassignment recipients, deduplication and previous-driver visibility |
| DEC-13 | Driver lifecycle, duplicates and login-management boundaries |
| DEC-14 | Exact public tracking fields |
| DEC-15 | Performance, availability, devices, retention and timezone conventions |
| DEC-16 | Payment-specific order amount, zero/negative amount and fee rules |

Use ADR-template.md to create ADR-<number>-<slug>.md. Record explicit decider, approval source, date, exact rules, acceptance examples and affected tasks. Only after explicit approval set the register to approved and link the ADR. DEC numbers identify questions; ADR numbers identify records and need not match.

DEC-01/03/04/06/08 are the plan's explicit high-impact production gates. Other rules block their affected behavior too. Task gates include initial status, payment, public DTO and notification recipients because complete slices rely on them. TASK-006/013/016 allow preparatory schema/contracts without enabling undecided behavior.

DEC-09 does not block manual code copy. DEC-10 does not block parcel creation/read-only management. DEC-13 does not add deletion/deactivation UI; identity lifecycle follows DEC-08. DEC-02 only blocks automatic expected dates; manual assignment is independent. Record brand accent approval separately if required. Raise new product ambiguities explicitly rather than guessing.
