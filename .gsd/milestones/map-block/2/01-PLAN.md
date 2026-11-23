---
phase: 2
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/features/editor/config/field-options.ts
  - src/features/editor/config/field-options.test.ts
  - src/features/editor/components/MapBlock.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - 'Map field configuration options (location mode, heights, aspect ratios, theme) and responsive class resolver are defined and tested in src/features/editor/config/field-options.ts'
    - 'MapBlock component renders interactive Google Maps iframe embed when coordinates or link are valid'
    - 'MapBlock renders an informative, accessible fallback placeholder without breaking layout when coordinates or link are invalid or missing'
    - 'MapBlock conditionally renders external directions link button when showDirectionsButton is enabled and destination can be resolved'
    - 'MapBlock supports dark and light themes with appropriate contrast, typography, and card containers'
  artifacts:
    - src/features/editor/config/field-options.ts
    - src/features/editor/config/field-options.test.ts
    - src/features/editor/components/MapBlock.tsx
---

# Plan 2.1: Map Block UI Component & Field Options

<objective>
Implement Map block field configuration options, responsive height and aspect ratio helpers, and the `MapBlock` React component. The component must support office header details (title, eyebrow, description, address), responsive map container sizing, fallback placeholder display for invalid/empty inputs, an external directions link button, and dark/light theme styling.

Purpose:
Before registering the Map component in Puck editor configuration, the editor requires concrete field option lists and a dedicated, responsive UI renderer that consumes `MapProps` and leverages the Phase 1 location resolution utility.

Output:

- `src/features/editor/config/field-options.ts`: Extended with `MAP_LOCATION_MODE_OPTIONS`, `MAP_HEIGHT_OPTIONS`, `MAP_ASPECT_RATIO_OPTIONS`, `MAP_THEME_OPTIONS`, and `getMapContainerClass`.
- `src/features/editor/config/field-options.test.ts`: Automated unit test suite verifying map option definitions and responsive class mapping.
- `src/features/editor/components/MapBlock.tsx`: Full responsive Map block component with iframe embedding, fallback placeholder, directions link, and theme variants.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/features/editor/types.ts
- src/features/editor/utils/map-location.ts
- src/features/editor/config/field-options.ts
- src/features/editor/components/BlockLayout.tsx
</context>

<tasks>

<task type="auto">
  <name>Define Map field options and responsive layout helpers with unit tests</name>
  <files>src/features/editor/config/field-options.ts, src/features/editor/config/field-options.test.ts</files>
  <action>
    1. In `src/features/editor/config/field-options.ts`:
       - Import type definitions `MapAspectRatio`, `MapHeight`, `MapLocationMode` from `@/features/editor/types`.
       - Define and export:
         - `MAP_LOCATION_MODE_OPTIONS: { label: string; value: MapLocationMode }[]` with values `'coordinates'` and `'link'`.
         - `MAP_HEIGHT_OPTIONS: { label: string; value: MapHeight }[]` with `'sm'` (Small 256px), `'md'` (Medium 384px), `'lg'` (Large 512px), `'full'` (Full 640px).
         - `MAP_ASPECT_RATIO_OPTIONS: { label: string; value: MapAspectRatio }[]` with `'auto'` (Auto / Use Height), `'16/9'` (16:9 Widescreen), `'4/3'` (4:3 Standard), `'1/1'` (1:1 Square).
         - `MAP_THEME_OPTIONS: { label: string; value: 'dark' | 'light' }[]` with `'light'` and `'dark'`.
       - Define and export `getMapContainerClass(height?: MapHeight, aspectRatio?: MapAspectRatio): string`:
         - When `aspectRatio` is provided and not `'auto'`:
           - `'16/9'` -> `'aspect-video w-full'`
           - `'4/3'` -> `'aspect-[4/3] w-full'`
           - `'1/1'` -> `'aspect-square w-full'`
         - Otherwise (when `aspectRatio` is `'auto'` or undefined), map `height`:
           - `'sm'` -> `'h-64 w-full'`
           - `'md'` -> `'h-96 w-full'`
           - `'lg'` -> `'h-[32rem] w-full'`
           - `'full'` -> `'h-[40rem] w-full'`
           - default -> `'h-96 w-full'`
       AVOID hardcoding inline fixed pixel styles for map container dimensions so that Tailwind responsive utilities can scale cleanly across viewports.
    2. In `src/features/editor/config/field-options.test.ts`:
       - Write a unit test suite using `node:test` and `node:assert/strict` (prefixing tests with `void` to satisfy `@typescript-eslint/no-floating-promises`):
         - Assert option arrays contain all expected keys and matching values.
         - Assert `getMapContainerClass` maps aspect ratios (`'16/9'`, `'4/3'`, `'1/1'`) to respective aspect classes.
         - Assert `getMapContainerClass` falls back to height classes when `aspectRatio` is `'auto'` or undefined.
  </action>
  <verify>node --experimental-strip-types --test src/features/editor/config/field-options.test.ts</verify>
  <done>All unit tests in field-options.test.ts pass with zero errors, confirming option definitions and class resolvers.</done>
</task>

<task type="auto">
  <name>Implement responsive MapBlock component with fallback state and directions button</name>
  <files>src/features/editor/components/MapBlock.tsx</files>
  <action>
    Create `src/features/editor/components/MapBlock.tsx` exporting `MapBlock(props: MapProps)`:
    1. Header & Office Details:
       - If `eyebrow` is present: render uppercase badge/label (`text-xs font-semibold tracking-widest uppercase`).
       - Render `title` (`text-2xl font-bold tracking-tight sm:text-3xl`).
       - If `description` is present: render descriptive paragraph (`text-sm leading-relaxed sm:text-base`).
       - If `address` is present: render with a `MapPin` icon from `lucide-react` (`h-4 w-4 shrink-0 text-slate-400`).
    2. Location & Embed Resolution:
       - Call `resolveMapEmbedUrl({ locationMode, latitude, longitude, googleMapsUrl, zoom })` from `@/features/editor/utils/map-location`.
       - Call `resolveDirectionsUrl({ locationMode, latitude, longitude, googleMapsUrl, address })` from `@/features/editor/utils/map-location`.
    3. Map Frame & Fallback:
       - Map frame container styled with `getMapContainerClass(height, aspectRatio)`, `relative overflow-hidden rounded-xl border`.
       - If `embedResult.isValid && embedResult.embedUrl`:
         - Render `<iframe src={embedResult.embedUrl} title={title || 'Office Location Map'} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />`.
       - If `!embedResult.isValid || !embedResult.embedUrl`:
         - Render an accessible, styled fallback placeholder:
           - Display `MapPinOff` from `lucide-react` (`h-10 w-10 text-slate-400`).
           - Heading: "Map Preview Unavailable" (`text-sm font-semibold`).
           - Message: `embedResult.errorMessage || 'Please enter valid coordinates or a Google Maps link to display the map.'`.
           - Subtle border/background matching the active theme so layout remains stable and clean.
    4. External Directions Button:
       - When `showDirectionsButton` is true and `directionsUrl` is resolved:
         - Render an `<a>` link styled as an action button with `Navigation` (or `ExternalLink`) from `lucide-react`.
         - Use `href={directionsUrl}`, `target="_blank"`, `rel="noopener noreferrer"`.
         - Label: `directionsButtonLabel || 'Get Directions'`.
    5. Dark & Light Theme Styling:
       - When `theme === 'dark'`:
         - Card container: `rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white`
         - Eyebrow: `text-slate-400`, Title: `text-white`, Description: `text-slate-300`, Address: `text-slate-300`
         - Button: `bg-white text-neutral-950 hover:bg-slate-100`
         - Fallback container: `border-dashed border-neutral-800 bg-neutral-900/60 text-slate-300`
       - When `theme === 'light'` (or default):
         - Card container: `rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xs`
         - Eyebrow: `text-slate-500`, Title: `text-slate-900`, Description: `text-slate-600`, Address: `text-slate-600`
         - Button: `bg-slate-900 text-white hover:bg-slate-800`
         - Fallback container: `border-dashed border-slate-200 bg-slate-50 text-slate-600`
    6. Layout:
       - Wrap the component container inside `<BlockLayout layout={layout}>`.
    AVOID omitting `rel="noopener noreferrer"` on `target="_blank"` anchors for security reasons.
    AVOID rendering broken or empty `<iframe>` elements when inputs are missing; always show the fallback placeholder.
  </action>
  <verify>pnpm run typecheck && pnpm run lint</verify>
  <done>MapBlock.tsx compiles without TypeScript errors, passes ESLint validation, and correctly satisfies MapProps requirements.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] Field option definitions and responsive class resolver are unit tested via `node --experimental-strip-types --test src/features/editor/config/field-options.test.ts`
- [ ] `MapBlock.tsx` exports a fully-styled React component handling valid iframe embeds, invalid fallback placeholders, directions links, and theme switching
- [ ] `pnpm run typecheck` and `pnpm run lint` execute with 0 errors
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
      </success_criteria>
