# Milestone: map-block

## Completed: 2026-11-23

## Goal

Add Map block to the Puck visual editor allowing users to share their location either with latitude/longitude coordinates or a Google Maps link.

## Deliverables

- ✅ `MapProps`, `MapLocationMode`, `MapHeight`, and `MapAspectRatio` defined in `src/features/editor/types.ts` and registered in `EditorComponentProps`.
- ✅ Robust location parsing and resolution utility in `src/features/editor/utils/map-location.ts` supporting latitude/longitude bounds validation, Google Maps URL parsing, iframe snippet extraction, fallback handling, and external directions URL generation.
- ✅ Automated unit test suite with 32 unit tests (`src/features/editor/utils/map-location.test.ts` and `src/features/editor/config/field-options.test.ts`) passing with 100% success.
- ✅ Responsive `MapBlock.tsx` component with Google Maps iframe embedding, dark/light themes, address overlay card, directions button, and fallback placeholders.
- ✅ Configured `Map` component in `src/features/editor/config/puck-config.tsx` under the `interactive` ("Actions") category with tabbed fields (Content & Appearance) and complete default props.
- ✅ Integrated sample Map block into `initialPageData` for out-of-the-box demonstration in `/editor` and `/preview`.
- ✅ Resolved Windows CRLF Prettier/ESLint DX barrier by switching `"endOfLine": "auto"` and strengthened `typecheck` script to `tsc -b`.

## Phases Completed

1. **Phase 1: Map Types & URL/Coordinate Resolution Utility** — 2026-11-23
   - Plan 1.1: `MapProps` types, coordinate & Google Maps URL resolution utility, unit tests.
   - Plan 1.2: Gap closure for `noUncheckedIndexedAccess` guards and project references typecheck script.
2. **Phase 2: Puck Map Block Configuration & UI Component** — 2026-11-23
   - Plan 2.1: Field options, responsive layout helpers, and `MapBlock.tsx` UI component.
   - Plan 2.2: Register `Map` in `EditorComponentProps` and `puckConfig`, tabbed field schema, full build verification.
3. **Phase 3: Verification & Integration Sample** — 2026-11-23
   - Added sample New York HQ map block to `initialPageData`.
   - Verified production build (`pnpm run build`), typecheck (`pnpm run typecheck`), and linter (`pnpm run lint`).

## Metrics

- **Total Commits**: 16 commits
- **Files Changed**: 23 files (2,477 insertions, 20 deletions)
- **Tests**: 32 unit tests passing (0 failures)
- **Verification Verdict**: 100% must-haves verified

## Lessons Learned

- `noUncheckedIndexedAccess: true` requires explicit null/undefined guards when extracting regex match array groups (e.g. `match?.[1]`).
- Prettier `"endOfLine": "lf"` without `.gitattributes` causes massive false positive errors on Windows clones; `"endOfLine": "auto"` ensures cross-platform developer compatibility.
- Running `tsc -b` instead of `tsc --noEmit` is essential for multi-config TypeScript projects using project references.
