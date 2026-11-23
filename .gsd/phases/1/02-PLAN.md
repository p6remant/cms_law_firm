---
phase: 1
plan: 2
wave: 1
gap_closure: true
depends_on:
  - 01-PLAN.md
files_modified:
  - src/features/editor/utils/map-location.ts
  - package.json
autonomous: true
user_setup: []

must_haves:
  truths:
    - 'TypeScript project build (pnpm run build) compiles with zero errors'
    - 'TypeScript check (pnpm run typecheck) validates application source files with zero errors'
    - 'All unit tests in src/features/editor/utils/map-location.test.ts continue to pass'
    - 'Project linter (pnpm run lint) passes with zero errors and warnings'
  artifacts:
    - src/features/editor/utils/map-location.ts
    - package.json
---

# Plan 1.2 (Gap Closure): Fix TypeScript Compilation Errors under Strict Indexed Access

<objective>
Resolve TypeScript TS2532 compilation errors in `src/features/editor/utils/map-location.ts` caused by `noUncheckedIndexedAccess: true` in `tsconfig.app.json`, and update `package.json`'s `typecheck` script to properly typecheck project references so `pnpm run build` and `pnpm run typecheck` both pass.

Purpose:
`tsconfig.app.json` enforces `noUncheckedIndexedAccess: true`. Accessing regex match array indices (`iframeMatch[1]`, `placeMatch[1]`, `searchMatch[1]`) without undefined checks triggers TS2532 errors during `tsc -b` and breaks `pnpm run build`. Additionally, `package.json`'s `typecheck` script runs `tsc --noEmit` against the root `tsconfig.json` which has an empty `files` list, concealing project reference type errors.

Output:

- `src/features/editor/utils/map-location.ts`: Guarded regex group accesses satisfying `noUncheckedIndexedAccess`.
- `package.json`: Updated `typecheck` script validating project references (`tsc -b` or `tsc -p tsconfig.app.json --noEmit`).
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/1/01-PLAN.md
- .gsd/phases/1/VERIFICATION.md
- src/features/editor/utils/map-location.ts
- tsconfig.json
- tsconfig.app.json
- package.json
</context>

<tasks>

<task type="auto">
  <name>Guard regex match capture group accesses in map-location.ts</name>
  <files>src/features/editor/utils/map-location.ts</files>
  <action>
    Update regex group accesses in `src/features/editor/utils/map-location.ts` to guard against undefined values under `noUncheckedIndexedAccess`:
    1. Line 107-111 (iframeMatch):
       ```typescript
       const iframeMatch = targetUrl.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
       if (iframeMatch?.[1]) {
         isIframeSnippet = true;
         targetUrl = iframeMatch[1].trim();
       }
       ```
    2. Line 196-202 (placeMatch):
       ```typescript
       const placeMatch = parsedUrl.pathname.match(/\/place\/([^/@]+)/);
       if (placeMatch?.[1]) {
         const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).trim();
         if (placeName) {
           query = placeName;
         }
       }
       ```
    3. Line 205-211 (searchMatch):
       ```typescript
       const searchMatch = parsedUrl.pathname.match(/\/(?:maps\/)?search\/([^/@?]+)/);
       if (searchMatch?.[1] && !query) {
         const searchName = decodeURIComponent(searchMatch[1].replace(/\+/g, ' ')).trim();
         if (searchName) {
           query = searchName;
         }
       }
       ```
    4. Review any other regex index accesses (`atMatch`, `pbMatch`, `coordMatch`) and ensure all indexed lookups are guarded.
  </action>
  <verify>npx tsc -p tsconfig.app.json --noEmit</verify>
  <done>npx tsc -p tsconfig.app.json --noEmit passes with 0 errors.</done>
</task>

<task type="auto">
  <name>Update typecheck script in package.json</name>
  <files>package.json</files>
  <action>
    In `package.json`, update `"typecheck": "tsc --noEmit"` to `"typecheck": "tsc -b"` (or equivalent project reference check) so that `pnpm run typecheck` actively checks application code rather than silently no-opping on root `tsconfig.json`.
  </action>
  <verify>pnpm run typecheck</verify>
  <done>pnpm run typecheck validates application files and exits with code 0.</done>
</task>

<task type="auto">
  <name>Verify full build, tests, and lint</name>
  <files>src/features/editor/utils/map-location.ts, package.json</files>
  <action>
    Execute full validation:
    - `node --experimental-strip-types --test src/features/editor/utils/map-location.test.ts`
    - `pnpm run typecheck`
    - `pnpm run lint`
    - `pnpm run build`
  </action>
  <verify>pnpm run build</verify>
  <done>All tests pass, linter passes, and pnpm run build completes successfully with exit code 0.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `pnpm run build` succeeds with exit code 0
- [ ] `pnpm run typecheck` succeeds with exit code 0
- [ ] `pnpm run lint` succeeds with exit code 0
- [ ] All 24 unit tests pass in `src/features/editor/utils/map-location.test.ts`
</verification>

<success_criteria>

- [ ] All tasks completed
- [ ] Phase 1 TypeScript build compilation blocker resolved
      </success_criteria>
