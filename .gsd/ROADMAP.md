# ROADMAP.md

> **Current Milestone**: `map-block`
> **Goal**: Add Map block to Puck visual editor allowing users to share location via coordinates (latitude/longitude) or Google Maps link with interactive embedding.

## Must-Haves

- [x] `MapProps` defined in `src/features/editor/types.ts` and registered in `EditorComponentProps`.
- [x] Map location utility to parse and transform latitude/longitude or Google Maps URLs into valid embed sources and directions links.
- [x] `Map` block configured in `src/features/editor/config/puck-config.tsx` under the `interactive` category with field schema and default props.
- [x] Responsive map renderer supporting office title, address description, configurable height, zoom level, and an external directions button.
- [x] Graceful fallback / placeholder state when coordinates or links are empty or invalid.
- [x] Verification through TypeScript compilation (`pnpm run build` or `pnpm run typecheck`).

## Phases

### Phase 1: Map Types & URL/Coordinate Resolution Utility

**Status**: ✅ Complete
**Objective**: Define `MapProps` in `src/features/editor/types.ts` and implement a helper utility to reliably generate embed iframes and external directions links from coordinates or Google Maps URLs.

### Phase 2: Puck Map Block Configuration & UI Component

**Status**: ✅ Complete
**Objective**: Register the `Map` block in `src/features/editor/config/puck-config.tsx` with fields for location mode (lat/long vs link), coordinates, Google Maps URL, title, address, height, and render a styled, accessible map preview.

### Phase 3: Verification & Integration Sample

**Status**: ✅ Complete
**Objective**: Add sample map block data to default templates if appropriate, verify editor and preview rendering, and pass typecheck and linting.
