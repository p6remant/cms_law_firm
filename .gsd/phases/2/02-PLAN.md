---
phase: 2
plan: 2
wave: 2
depends_on:
  - 01-PLAN.md
files_modified:
  - src/features/editor/types.ts
  - src/features/editor/config/puck-config.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - 'Map: MapProps is registered in EditorComponentProps in src/features/editor/types.ts'
    - 'Map block is registered in puckConfig.components and listed in categories.interactive in src/features/editor/config/puck-config.tsx'
    - 'Map component configuration declares full fields schema organized into Content and Appearance tabs via FieldTabs'
    - 'Map component provides complete defaultProps satisfying the MapProps contract'
    - 'Full project build (pnpm run build), typecheck (pnpm run typecheck), and linter (pnpm run lint) pass with zero errors'
  artifacts:
    - src/features/editor/types.ts
    - src/features/editor/config/puck-config.tsx
---

# Plan 2.2: Register Map Block in Puck Configuration & Editor Types

<objective>
Register `Map: MapProps` in `EditorComponentProps` (`src/features/editor/types.ts`) and register the `Map` component configuration in `src/features/editor/config/puck-config.tsx` under the `interactive` category. Configure field schema with `FieldTabs`, complete `defaultProps`, and the `MapBlock` renderer, followed by full project build and type verification.

Purpose:
With `MapProps` defined and `MapBlock` implemented, registering the block in Puck configuration makes the Map component visually editable, configurable in sidebar inspector tabs, and viewable in both canvas and preview modes.

Output:

- `src/features/editor/types.ts`: `EditorComponentProps` updated with `Map: MapProps;`.
- `src/features/editor/config/puck-config.tsx`: `Map` added to `categories.interactive.components` and registered in `puckConfig.components` with complete field schema, default props, and `MapBlock` renderer.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/features/editor/types.ts
- src/features/editor/config/field-options.ts
- src/features/editor/components/MapBlock.tsx
- src/features/editor/config/puck-config.tsx
</context>

<tasks>

<task type="auto">
  <name>Register Map in EditorComponentProps and configure Map block in puckConfig</name>
  <files>src/features/editor/types.ts, src/features/editor/config/puck-config.tsx</files>
  <action>
    1. In `src/features/editor/types.ts`:
       - Add `Map: MapProps;` to `EditorComponentProps` (between `Button` and `Template`).
    2. In `src/features/editor/config/puck-config.tsx`:
       - Add `'Map'` to `puckConfig.categories.interactive.components`:
         ```typescript
         interactive: {
           title: 'Actions',
           components: ['Button', 'Map'],
         },
         ```
       - Import `MapBlock` from `@/features/editor/components/MapBlock`.
       - Import `MAP_ASPECT_RATIO_OPTIONS`, `MAP_HEIGHT_OPTIONS`, `MAP_LOCATION_MODE_OPTIONS`, `MAP_THEME_OPTIONS` from `@/features/editor/config/field-options`.
       - In `puckConfig.components`, add `Map`:
         - `label: 'Map'`
         - `fields`:
           - `eyebrow`: `{ type: 'text', label: 'Eyebrow' }`
           - `title`: `{ type: 'text', label: 'Title' }`
           - `description`: `{ type: 'textarea', label: 'Description' }`
           - `address`: `{ type: 'textarea', label: 'Address' }`
           - `locationMode`: `{ type: 'radio', label: 'Location source', options: MAP_LOCATION_MODE_OPTIONS }`
           - `latitude`: `{ type: 'text', label: 'Latitude' }`
           - `longitude`: `{ type: 'text', label: 'Longitude' }`
           - `googleMapsUrl`: `{ type: 'text', label: 'Google Maps URL / Embed' }`
           - `zoom`: `{ type: 'number', label: 'Zoom level', min: 1, max: 20 }`
           - `height`: `{ type: 'select', label: 'Height', options: MAP_HEIGHT_OPTIONS }`
           - `aspectRatio`: `{ type: 'select', label: 'Aspect ratio', options: MAP_ASPECT_RATIO_OPTIONS }`
           - `showDirectionsButton`: `{ type: 'radio', label: 'Directions button', options: [{ label: 'Show', value: true }, { label: 'Hide', value: false }] }`
           - `directionsButtonLabel`: `{ type: 'text', label: 'Button label' }`
           - `theme`: `{ type: 'radio', label: 'Theme', options: MAP_THEME_OPTIONS }`
           - `layout`: `layoutField`
         - `renderFields`: with `FieldTabs`:
           - `content`:
             `fields.eyebrow`, `fields.title`, `fields.description`, `fields.address`, `fields.locationMode`, `fields.latitude`, `fields.longitude`, `fields.googleMapsUrl`, `fields.showDirectionsButton`, `fields.directionsButtonLabel`
           - `appearance`:
             `fields.zoom`, `fields.height`, `fields.aspectRatio`, `fields.theme`, `fields.layout`
         - `defaultProps`:
           - `title`: `'Office Location'`
           - `eyebrow`: `'VISIT US'`
           - `description`: `'Visit our law firm headquarters for in-person consultation and case reviews.'`
           - `address`: `'123 Legal Avenue, Suite 400, New York, NY 10001'`
           - `locationMode`: `'coordinates'`
           - `latitude`: `40.7128`
           - `longitude`: `-74.006`
           - `googleMapsUrl`: `''`
           - `zoom`: `15`
           - `height`: `'md'`
           - `aspectRatio`: `'16/9'`
           - `showDirectionsButton`: `true`
           - `directionsButtonLabel`: `'Get Directions'`
           - `theme`: `'light'`
           - `layout`: `{ padding: '32px' }`
         - `render`: `(props) => <MapBlock {...props} />`
       AVOID omitting any required property from `defaultProps` because Puck's type inference checks `defaultProps` against `EditorComponentProps['Map']`.
  </action>
  <verify>pnpm run typecheck</verify>
  <done>src/features/editor/types.ts and src/features/editor/config/puck-config.tsx compile with zero TypeScript errors.</done>
</task>

<task type="auto">
  <name>Validate editor Map block registration, preview integration, and full test suite</name>
  <files>src/features/editor/config/puck-config.tsx, src/features/editor/types.ts</files>
  <action>
    1. Confirm that `puckConfig` integration satisfies all editor and preview route expectations:
       - Verify `puckConfig.categories.interactive.components` contains `'Map'`.
       - Verify `puckConfig.components.Map` provides valid `render` and `renderFields` components.
    2. Run full automated verification suite:
       - Run location resolution unit tests: `node --experimental-strip-types --test src/features/editor/utils/map-location.test.ts`
       - Run field options unit tests: `node --experimental-strip-types --test src/features/editor/config/field-options.test.ts`
       - Run TypeScript project references compilation: `pnpm run typecheck` (`tsc -b`)
       - Run project linter: `pnpm run lint` (`eslint .`)
       - Run production Vite build: `pnpm run build` (`tsc -b && vite build`)
    3. Ensure no lint warnings or formatting discrepancies remain.
  </action>
  <verify>node --experimental-strip-types --test src/features/editor/utils/map-location.test.ts && node --experimental-strip-types --test src/features/editor/config/field-options.test.ts && pnpm run typecheck && pnpm run lint && pnpm run build</verify>
  <done>All unit tests pass, typecheck passes with 0 errors, linter passes with 0 warnings/errors, and Vite build completes successfully.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `EditorComponentProps` includes `Map: MapProps;`
- [ ] `puckConfig` registers `Map` under the `interactive` category with complete fields, defaultProps, and renderer
- [ ] All unit tests (`map-location.test.ts`, `field-options.test.ts`) pass
- [ ] `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build` succeed with exit code 0
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
      </success_criteria>
