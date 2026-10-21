# TASK-028 Minimal landing page

Owner: Codex
Date: 2026-10-21
PRD IDs: none completed; informational introduction only.

## Authorization and scope

User explicitly requested the smallest landing page for a quick Vercel deployment. This standalone task does not complete TASK-001-027 or approve any business rules. No database or tracking endpoints.

## Change plan

Create minimal Next.js App Router + TypeScript page, responsive CSS, Sora font, pinned dependencies, lockfile and Vercel upload exclusions. Run production build and typecheck, deploy and smoke-check URL.

## Verification

Pending build, typecheck and Vercel deployment.

## Completed evidence

- Production: https://parcel-delivery-six.vercel.app
- Deployment: dpl_FXND73t58R8QRzLbKzNvZsfe5VVM; READY.
- Vercel production build: Next.js 16.4.2 compiled successfully (4.1s); TypeScript passed (2.9s); root page statically generated.
- curl.exe -sS -I production URL returned HTTP 200, text/html.
- Vercel CLI curl returned rendered Parcel heading, coming-soon state, section anchor, and stylesheet/font references.
- No database, tracking API, sessions, or business policies enabled.

## Verification limits

Local pnpm installation was stopped after slow downloads. Local typecheck could not run because the incomplete installation had not linked tsc. A later offline lockfile attempt failed due to unavailable metadata; no lockfile exists yet. Production build and TypeScript checks above ran successfully on Vercel. Complete local installation and generate the pnpm lockfile before the next application task. Browser visual, screen-reader and participant studies were not performed. A subsequent direct Node HTTP request was denied by environment networking; the prior HTTP HEAD and authenticated Vercel curl succeeded.

Next ready task: TASK-001 for full project kickoff; TASK-004 still owns complete toolchain and CI. No commits or Git pushes were made; deployment used the Vercel CLI.
