---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/features/editor/types.ts
  - src/features/editor/utils/map-location.ts
  - src/features/editor/utils/map-location.test.ts
autonomous: true
user_setup: []

must_haves:
  truths:
    - 'MapProps and supporting types (MapLocationMode, MapHeight, MapAspectRatio) are defined and strictly typed in src/features/editor/types.ts'
    - 'Coordinate and Google Maps URL resolution utility parses valid/invalid inputs into embed iframe sources and directions URLs in src/features/editor/utils/map-location.ts'
    - 'All utility edge cases, fallbacks, coordinate ranges, and URL formats pass automated unit tests in src/features/editor/utils/map-location.test.ts'
    - 'TypeScript compilation (tsc --noEmit) and project linter pass without errors'
  artifacts:
    - src/features/editor/types.ts
    - src/features/editor/utils/map-location.ts
    - src/features/editor/utils/map-location.test.ts
---

# Plan 1.1: Map Types & Location Resolution Utility

<objective>
Define TypeScript type definitions for the Puck Map block in `src/features/editor/types.ts` and implement a robust client-side location resolution helper in `src/features/editor/utils/map-location.ts` that safely validates coordinates, extracts Google Maps iframe embed URLs, and constructs external directions links without requiring paid API keys.

Purpose:
The Map block needs strongly typed props for the Puck visual editor and reliable parsing logic to convert diverse user inputs (raw coordinates, share links, search URLs, iframe embeds) into functional, secure iframe embed URLs and navigation links with fallback error handling.

Output:

- `src/features/editor/types.ts`: Extended with `MapProps`, `MapLocationMode`, `MapHeight`, `MapAspectRatio`.
- `src/features/editor/utils/map-location.ts`: Coordinate validation, URL parser, embed URL generator, directions link builder, and default values.
- `src/features/editor/utils/map-location.test.ts`: Automated test suite covering coordinates, URLs, query parameters, bounds checking, and fallbacks.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/features/editor/types.ts
- tsconfig.app.json
- eslint.config.js
</context>

<tasks>

<task type="auto">
  <name>Define MapProps and supporting types in editor types</name>
  <files>src/features/editor/types.ts</files>
  <action>
    Add type definitions for the Map block to `src/features/editor/types.ts`:
    - `MapLocationMode`: `'coordinates' | 'link'`
    - `MapHeight`: `'sm' | 'md' | 'lg' | 'full'`
    - `MapAspectRatio`: `'auto' | '16/9' | '4/3' | '1/1'`
    - `MapProps`: Wrap with `WithLayout<{ ... }>` matching existing patterns (`HeroProps`, `CardProps`), containing:
      - `title: string`
      - `eyebrow?: string`
      - `description?: string`
      - `address?: string`
      - `locationMode: MapLocationMode`
      - `latitude: number | string`
      - `longitude: number | string`
      - `googleMapsUrl?: string`
      - `zoom: number`
      - `height: MapHeight`
      - `aspectRatio: MapAspectRatio`
      - `showDirectionsButton: boolean`
      - `directionsButtonLabel: string`
      - `theme: 'dark' | 'light'`
    - Export `MapProps`, `MapLocationMode`, `MapHeight`, `MapAspectRatio`.
    AVOID adding `Map: MapProps` to `EditorComponentProps` yet, because `puckConfig` in `puck-config.tsx` does not define `Map` until Phase 2; registering it in `EditorComponentProps` prematurely would cause `tsc --noEmit` to fail on missing component configuration.
  </action>
  <verify>pnpm run typecheck</verify>
  <done>src/features/editor/types.ts exports MapProps and supporting types, and pnpm run typecheck passes with 0 errors.</done>
</task>

<task type="auto">
  <name>Implement coordinate and Google Maps URL resolution utility</name>
  <files>src/features/editor/utils/map-location.ts</files>
  <action>
    Create `src/features/editor/utils/map-location.ts` exporting:
    1. `parseCoordinates(lat: unknown, lng: unknown): { lat: number; lng: number } | null`
       - Parse strings or numbers, trim strings, handle negative values.
       - Validate latitude is in `[-90, 90]` and longitude is in `[-180, 180]`.
       - Return null on NaN, empty string, null, or out-of-range coordinates.
    2. `parseGoogleMapsUrl(rawUrl: string): { embedUrl?: string; coordinates?: { lat: number; lng: number }; query?: string; isIframeSnippet: boolean } | null`
       - If string contains `<iframe ...src="([^"]+)".*<\/iframe>`, extract `src`.
       - Handle direct embed URLs (`google.com/maps/embed` or query `output=embed`).
       - Extract `@lat,lng,zoom` from place/search URLs (e.g. `/place/.../@40.7128,-74.006,15z`).
       - Extract query string `q` or `ll` params if present.
       - Extract place name from `/place/{PlaceName}/`.
       - Safely handle invalid/malformed URLs without throwing exceptions.
    3. `resolveMapEmbedUrl(options: ResolveMapEmbedOptions): MapEmbedResult`
       - `ResolveMapEmbedOptions`: `{ locationMode: MapLocationMode; latitude?: number | string; longitude?: number | string; googleMapsUrl?: string; zoom?: number }`
       - `MapEmbedResult`: `{ embedUrl: string | null; isValid: boolean; errorMessage?: string }`
       - Clamp zoom between 1 and 20 (default 15).
       - In `'coordinates'` mode: if valid coordinates, return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`. Otherwise return `{ embedUrl: null, isValid: false, errorMessage: '...' }`.
       - In `'link'` mode: if valid embed URL or extracted coordinates/query, return embed URL. If URL empty or unparseable, return `{ embedUrl: null, isValid: false, errorMessage: '...' }`.
    4. `resolveDirectionsUrl(options: ResolveDirectionsOptions): string | null`
       - `ResolveDirectionsOptions`: `{ locationMode: MapLocationMode; latitude?: number | string; longitude?: number | string; googleMapsUrl?: string; address?: string }`
       - If coordinates are valid, return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`.
       - If `locationMode === 'link'` and valid Google Maps URL provided, return it (or destination query).
       - If address is non-empty, return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`.
       - Return `null` if no destination can be inferred.
    5. `DEFAULT_MAP_COORDINATES`: default `{ lat: 40.7128, lng: -74.006 }` (New York HQ).
    AVOID using external network requests or paid Google Maps API keys; use standard Google Maps iframe query formatting (`output=embed`).
  </action>
  <verify>pnpm run typecheck</verify>
  <done>src/features/editor/utils/map-location.ts exists, adheres to strict typing, and passes pnpm run typecheck.</done>
</task>

<task type="auto">
  <name>Create unit tests for map location resolution and verify suite</name>
  <files>src/features/editor/utils/map-location.test.ts</files>
  <action>
    Create `src/features/editor/utils/map-location.test.ts` covering:
    - `parseCoordinates`:
      - Valid numeric and string coordinates (`40.7128`, `"-74.006"`).
      - Boundary coordinates (`90`, `-90`, `180`, `-180`).
      - Out-of-bound coordinates (`91`, `-91`, `181`, `-181`).
      - Non-numeric / NaN / null / undefined / empty strings.
    - `parseGoogleMapsUrl`:
      - Standard place URL with `@lat,lng,zoom` format.
      - Iframe HTML snippet extraction (`<iframe src="..."></iframe>`).
      - Direct embed URL (`https://www.google.com/maps/embed?...`).
      - Search query URL (`https://maps.google.com/?q=Statue+of+Liberty`).
      - Malformed or blank strings.
    - `resolveMapEmbedUrl`:
      - Mode `'coordinates'` with valid and invalid values.
      - Mode `'link'` with embed URL, place URL, and invalid URL.
      - Zoom clamping (e.g. zoom 0 clamped to 1, zoom 25 clamped to 20).
    - `resolveDirectionsUrl`:
      - Coordinate-based destination URL.
      - Address-based destination URL.
      - Fallback precedence (coordinates > address > null).
    Use `node:test` and `node:assert/strict` for zero-dependency test runner.
    AVOID adding dependencies or test libraries to package.json.
  </action>
  <verify>node --experimental-strip-types --test src/features/editor/utils/map-location.test.ts; pnpm run typecheck; pnpm run lint</verify>
  <done>All unit tests pass, pnpm run typecheck succeeds with 0 errors, and pnpm run lint succeeds with 0 warnings.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] MapProps, MapLocationMode, MapHeight, MapAspectRatio exported from `src/features/editor/types.ts`
- [ ] `src/features/editor/utils/map-location.ts` correctly parses coordinates, embed URLs, and directions links
- [ ] Unit tests in `src/features/editor/utils/map-location.test.ts` execute cleanly and pass
- [ ] `pnpm run typecheck` passes with zero errors
- [ ] `pnpm run lint` passes with zero errors
</verification>

<success_criteria>

- [ ] All 3 tasks verified
- [ ] Must-haves confirmed
      </success_criteria>
