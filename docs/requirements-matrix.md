# Requirement traceability

Sources: original PRD and implementation-plan sections 1, 5, 6, 7 and 8. No feature is implemented. Task status and evidence live only in delivery/backlog.json.

| PRD | Behavior | Owner module | Tasks |
|---|---|---|---|
| CUS-01 | Track Parcel | tracking | TASK-019, TASK-024 |
| CUS-02 | Change Receiving Place | customer-preferences | TASK-020, TASK-021, TASK-024 |
| CUS-03 | Write Instruction | customer-preferences | TASK-020, TASK-021, TASK-024 |
| CUS-04 | View Updated Status | delivery-results / tracking | TASK-016, TASK-018, TASK-019, TASK-024 |
| DRV-01 | Daily Route / Detail / Result | driver-worklist / delivery-results | TASK-015, TASK-016, TASK-017, TASK-018, TASK-024 |
| DRV-02 | Receive Notifications | notifications | TASK-013, TASK-021, TASK-022, TASK-024 |
| ADM-01 | Manage Driver List | drivers | TASK-010, TASK-024 |
| ADM-02 | Create Parcel Information | parcels | TASK-011, TASK-012, TASK-024 |
| ADM-03 | Assign Parcel to Driver | assignments | TASK-013, TASK-014, TASK-017, TASK-018, TASK-023, TASK-024 |

Foundation TASK-001-009 supports all features. TASK-025 supplies shared UX/accessibility evidence; TASK-026 operations; TASK-027 release traceability. UX-01/02/03/05 map to TASK-002; UX-04/06 to TASK-005; UX-07/08 to feature tasks; UX-09/10 to TASK-025 and each slice's evidence. Plan phases 0-12 appear in task records.

P0/P1 and sprint timing remain proposals. Driver administration runs early because assignment needs driver records. Manual assignment does not wait for automatic-date policy. Public tracking and preferences remain gated by approved rules. Use [acceptance coverage](testing/acceptance.md) and the sources' detailed criteria; task links alone are not evidence.
