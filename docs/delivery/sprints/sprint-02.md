# Sprint 02 Data and staff access

Schedule: proposed, undated and unestimated.

## Goal

Real isolated persistence and protected staff services.

## Ordered scope

Task status, dependencies, decision gates, acceptance and verification live in [backlog.json](../backlog.json). Do not duplicate status checklists here.

- **TASK-006**: Implement policy-neutral schema and integrity boundaries
- **TASK-007**: Create isolated fixtures and database test harness
- **TASK-008**: Implement approved staff sessions and provisioning
- **TASK-009**: Enforce role and object authorization

## Review gate

Fresh migration/seed; real staff sessions; two-driver isolation demonstrated.

Use the [sprint review template](../templates/sprint-review.md) and link actual task evidence.

## Dependencies and carryover

DEC-08 blocks production staff auth. Policy-neutral schema and integration infrastructure can proceed.

Respect task dependencies rather than assuming a whole sprint is ready at once. Carryover keeps its task ID, evidence and blocker. Sprint acceptance does not authorize deployment.
