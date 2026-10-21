# Parcel delivery management and tracking

This repository is organized for small, verifiable Codex tasks and sprint reviews. A minimal Next.js + TypeScript coming-soon landing page is deployed at https://parcel-delivery-six.vercel.app. Parcel tracking, staff tools and database features are not implemented.

Read these in order:

1. [Agent working agreement](AGENTS.md)
2. [Original PRD](Product_Requirements_Document_Parcel_Delivery_Management_&_Tracking.docx)
3. [Implementation plan](Parcel_Delivery_Codex_Implementation_Plan.md)
4. [Project structure and module ownership](docs/project-structure.md)
5. [Sprint workflow and backlog](docs/delivery/README.md)
6. [Decision register](docs/decisions/README.md)
7. [Requirement traceability](docs/requirements-matrix.md)

The original source documents remain at the root; do not maintain competing copies. PRD priorities, sprint capacity, design choices, and unresolved business rules remain proposals until approved.

Planning validation (Node.js built-ins only):

```powershell
node scripts/validate-planning.mjs
```

Landing page commands: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm typecheck`. Deploy with `vercel deploy --prod`. TASK-028 is an explicitly requested fast-track landing page; TASK-004 still covers the full development toolchain and CI. The next implementation entry point is Sprint 01, TASK-001. A future Codex prompt can be: "Read AGENTS.md and the source documents. Start Sprint 01 with the first ready task, update backlog.json, and record verification evidence."

Local dependency installation was interrupted by slow downloads; the production build and TypeScript check passed on Vercel. Run `pnpm install` to finish local setup and generate the lockfile before the next application task.
