# Phase 1 Summary: Map Types & Location Resolution Utility

**Plan**: `01-PLAN.md`
**Wave**: 1
**Status**: Completed
**Execution Completed**: 2026-11-23

---

## Overview

Phase 1 established the foundation for the Puck visual editor Map block by implementing strongly-typed prop definitions and a pure client-side location resolution helper. This utility handles latitude/longitude validation, extracts embed URLs from iframe snippets and standard Google Maps links, and produces directions URLs with zero third-party runtime dependencies or paid API keys.

---

## Tasks Completed

| Task # | Name                                                           | Files                                            | Commit    |
| ------ | -------------------------------------------------------------- | ------------------------------------------------ | --------- |
| 1      | Define MapProps and supporting types in editor types           | `src/features/editor/types.ts`                   | `bdaf413` |
| 2      | Implement coordinate and Google Maps URL resolution utility    | `src/features/editor/utils/map-location.ts`      | `027b27e` |
| 3      | Create unit tests for map location resolution and verify suite | `src/features/editor/utils/map-location.test.ts` | `da54fdb` |

---

## Detailed Implementation

### 1. Map Types (`src/features/editor/types.ts`)

- Defined and exported `MapLocationMode` (`'coordinates' | 'link'`).
- Defined and exported `MapHeight` (`'sm' | 'md' | 'lg' | 'full'`).
- Defined and exported `MapAspectRatio` (`'auto' | '16/9' | '4/3' | '1/1'`).
- Defined and exported `MapProps` wrapped in `WithLayout<{ ... }>` with configuration for title, eyebrow, description, address, coordinates, Google Maps URL, zoom level, heights, aspect ratios, directions button toggles/labels, and theme styling.
- Intentionally deferred adding `Map: MapProps` to `EditorComponentProps` until Phase 2 when the Puck component configuration is registered.

### 2. Location Resolution Utility (`src/features/editor/utils/map-location.ts`)

- `DEFAULT_MAP_COORDINATES`: HQ coordinates (`{ lat: 40.7128, lng: -74.006 }`).
- `clampZoom`: Clamps zoom values to integer range `[1, 20]`, defaulting to 15.
- `parseCoordinates`: Parses string and numeric coordinates, enforcing strict bounds (`[-90, 90]` for latitude, `[-180, 180]` for longitude) and discarding NaN/empty/out-of-bounds inputs.
- `parseGoogleMapsUrl`: Safely parses diverse user URL inputs without network calls:
  - Extracts `src` from raw iframe HTML snippets.
  - Recognizes direct embed links (`/maps/embed`, `output=embed`).
  - Extracts coordinates from `@lat,lng` paths and protobuf `pb` parameters (`!2d{lng}!3d{lat}`).
  - Parses query string `q` or `ll` coordinates or search place names.
  - Extracts place names from `/place/{Name}/` path structures.
- `resolveMapEmbedUrl`: Generates functional iframe embed sources (`output=embed`) for both coordinate and URL link modes with error diagnostics.
- `resolveDirectionsUrl`: Builds universal Google directions links (`/maps/dir/?api=1&destination=...`) prioritizing coordinates, falling back to address, then place query.

### 3. Automated Test Suite (`src/features/editor/utils/map-location.test.ts`)

- Built using zero-dependency `node:test` and `node:assert/strict`.
- 24 comprehensive test cases covering:
  - Default coordinates and zoom clamping bounds.
  - Numeric, string, boundary, and out-of-range coordinate parsing.
  - Place URLs, iframe code extraction, search query extraction, and invalid URL handling.
  - Embed URL resolution in coordinates and link modes.
  - Directions URL fallback precedence (coordinates > address > null).

---

## Verification Evidence

1. **Unit Tests**:
   - Command: `node --experimental-strip-types --test src/features/editor/utils/map-location.test.ts`
   - Result: 24 tests passed across 7 suites in 193ms with 0 failures.
2. **Type Checking**:
   - Command: `pnpm run typecheck` (`tsc --noEmit`)
   - Result: Exited with code 0.
3. **Linting & Formatting**:
   - Command: `pnpm run lint` (`eslint .`)
   - Result: Exited with code 0 (0 errors, 0 warnings).

---

## Deviations Handled

1. **Commitlint Subject Casing (Rule 1 - Bug/Lint Fix)**:
   - Husky pre-commit hooks enforced lowercase subject requirements (`subject must be lower-case [subject-case]`). Formatted all commit messages to lower-case subject convention.
2. **ESLint Template Literals Rule (Rule 1 - Bug/Lint Fix)**:
   - `@typescript-eslint/restrict-template-expressions` flagged number expressions inside template literals. Wrapped numerical values with `String(...)` across `map-location.ts`.
3. **ESLint Floating Promises on Node Test Runner (Rule 1 - Bug/Lint Fix)**:
   - `@typescript-eslint/no-floating-promises` flagged unhandled promises returned by `describe` and `it`. Prefixed test declarations with `void` to satisfy strict linting.
4. **Node ESM Extension Requirement (Rule 1 - Bug/Lint Fix)**:
   - Specified `.ts` extension on the relative import in `map-location.test.ts` to allow Node native test runner resolution with `--experimental-strip-types`.

---

## Commits

- `bdaf413`: `feat(phase-1): define map props and supporting types in editor types`
- `027b27e`: `feat(phase-1): implement coordinate and google maps url resolution utility`
- `da54fdb`: `feat(phase-1): create unit tests for map location resolution and verify suite`
