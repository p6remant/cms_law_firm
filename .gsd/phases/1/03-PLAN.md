---
phase: 1
plan: 3
wave: 3
depends_on: ['02']
files_modified:
  - src/features/editor/config/puck-config.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - "Dedicated 'forms' category is added to puckConfig.categories containing Form, InputField, SelectField, TextareaField, FormButton"
    - "Form component in puckConfig has slot configuration with allow: ['InputField', 'SelectField', 'TextareaField', 'FormButton']"
    - 'InputField, TextareaField, SelectField, FormButton, and Form are registered in puckConfig.components with render, defaultProps, fields, and FieldTabs'
    - 'All automated unit tests pass via pnpm test'
    - 'Full project build (pnpm run build), typecheck (pnpm run typecheck), and lint (pnpm run lint) pass with 0 errors'
  artifacts:
    - 'src/features/editor/config/puck-config.tsx'
---

# Plan 1.3: Puck Editor Registration & Integration Verification

<objective>
Register form container and form field components into Puck editor configuration (`puck-config.tsx`) under a dedicated `'forms'` category with slot restrictions, and perform complete milestone verification across unit tests, typecheck, lint, and production build.

Purpose: Make form building blocks available to editors in the Puck visual canvas while validating the entire project integrity.
Output: Updated `src/features/editor/config/puck-config.tsx` with all 5 form blocks registered, and clean verification logs.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/features/editor/types.ts
- src/features/editor/config/field-options.ts
- src/features/editor/config/puck-config.tsx
- src/features/editor/components/form/index.ts
</context>

<tasks>

<task type="auto">
  <name>Register Form Blocks in Puck Configuration</name>
  <files>src/features/editor/config/puck-config.tsx</files>
  <action>
    1. In `src/features/editor/config/puck-config.tsx`:
       - Import `FormContainer`, `InputField`, `SelectField`, `TextareaField`, `FormButton` from `@/features/editor/components/form`.
       - Import `BUTTON_WIDTH_OPTIONS`, `FIELD_WIDTH_OPTIONS`, `FORM_BUTTON_VARIANT_OPTIONS`, `FORM_METHOD_OPTIONS`, `FORM_THEME_OPTIONS`, `INPUT_TYPE_OPTIONS` from `@/features/editor/config/field-options`.
       - Add a new `'forms'` category to `puckConfig.categories`:
         ```ts
         forms: {
           title: 'Forms',
           components: ['Form', 'InputField', 'SelectField', 'TextareaField', 'FormButton'],
         },
         ```
       - Configure `puckConfig.components.Form`:
         - `label`: `'Form Container'`
         - `fields`:
           - `title`: `{ type: 'text', label: 'Form Title' }`
           - `description`: `{ type: 'textarea', label: 'Description' }`
           - `submitEndpoint`: `{ type: 'text', label: 'Submit Endpoint (URL)' }`
           - `submitMethod`: `{ type: 'radio', label: 'Submit Method', options: FORM_METHOD_OPTIONS }`
           - `successMessage`: `{ type: 'text', label: 'Success Message' }`
           - `errorMessage`: `{ type: 'text', label: 'Error Message' }`
           - `theme`: `{ type: 'radio', label: 'Theme', options: FORM_THEME_OPTIONS }`
           - `fields`: `{ type: 'slot', allow: ['InputField', 'SelectField', 'TextareaField', 'FormButton'] }`
           - `layout`: `layoutField`
         - `renderFields`: FieldTabs with Content (`title`, `description`, `fields`, `submitEndpoint`, `successMessage`) and Appearance (`theme`, `submitMethod`, `errorMessage`, `layout`)
         - `defaultProps`: Law firm consultation form with default child fields in `fields` slot (Name input, Email input, Practice Area select, Message textarea, Submit button)
         - `render`: `(props) => <FormContainer {...props} />`
       - Configure `puckConfig.components.InputField`:
         - `label`: `'Input Field'`
         - `fields`: `name`, `label`, `type` (select: `INPUT_TYPE_OPTIONS`), `placeholder`, `required` (radio), `helperText`, `width` (radio: `FIELD_WIDTH_OPTIONS`)
         - `renderFields`: FieldTabs
         - `defaultProps`: `{ name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe', required: true, helperText: '', width: 'full' }`
         - `render`: `(props) => <InputField {...props} />`
       - Configure `puckConfig.components.TextareaField`:
         - `label`: `'Textarea Field'`
         - `fields`: `name`, `label`, `placeholder`, `rows`, `required` (radio), `helperText`, `width` (radio: `FIELD_WIDTH_OPTIONS`)
         - `renderFields`: FieldTabs
         - `defaultProps`: `{ name: 'message', label: 'Case Details', placeholder: 'Please briefly describe your legal inquiry...', rows: 4, required: true, helperText: '', width: 'full' }`
         - `render`: `(props) => <TextareaField {...props} />`
       - Configure `puckConfig.components.SelectField`:
         - `label`: `'Select Dropdown'`
         - `fields`: `name`, `label`, `placeholder`, `options` (textarea), `required` (radio), `helperText`, `width` (radio: `FIELD_WIDTH_OPTIONS`)
         - `renderFields`: FieldTabs
         - `defaultProps`: `{ name: 'practice_area', label: 'Practice Area', placeholder: 'Select practice area...', options: 'Corporate Law | corporate\nCommercial Litigation | litigation\nReal Estate & Land Use | real_estate\nEmployment & Labor | employment', required: false, helperText: '', width: 'full' }`
         - `render`: `(props) => <SelectField {...props} />`
       - Configure `puckConfig.components.FormButton`:
         - `label`: `'Form Submit Button'`
         - `fields`: `label`, `variant` (radio: `FORM_BUTTON_VARIANT_OPTIONS`), `width` (radio: `BUTTON_WIDTH_OPTIONS`), `align` (radio: `ALIGN_OPTIONS`)
         - `renderFields`: FieldTabs
         - `defaultProps`: `{ label: 'Submit Consultation Request', variant: 'primary', width: 'full', align: 'left' }`
         - `render`: `(props) => <FormButton {...props} />`

    AVOID: Omitting `allow` on the `fields` slot, which would permit non-form blocks into the form container grid and cause visual layout breaking.

  </action>
  <verify>pnpm run typecheck</verify>
  <done>puckConfig registers the forms category and all 5 components with correct slot and field definitions, passing TypeScript typechecking.</done>
</task>

<task type="auto">
  <name>Execute Verification Suite</name>
  <files>src/features/editor/config/puck-config.tsx</files>
  <action>
    Run the full suite of automated verification checks:
    1. `pnpm test`: Confirm all form utility tests pass.
    2. `pnpm run typecheck`: Confirm TypeScript type checker passes with zero errors under strict checks.
    3. `pnpm run lint`: Confirm ESLint passes without errors or warnings.
    4. `pnpm run build`: Confirm Vite production build compiles successfully.

    AVOID: Skipping any of the verification steps; all 4 must pass cleanly before marking Phase 1 complete.

  </action>
  <verify>pnpm test && pnpm run typecheck && pnpm run lint && pnpm run build</verify>
  <done>All automated tests, typecheck, lint, and build commands complete successfully with exit code 0.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `pnpm test` runs and passes all unit tests
- [ ] `pnpm run typecheck` reports 0 TypeScript errors
- [ ] `pnpm run lint` reports 0 linting errors
- [ ] `pnpm run build` succeeds generating production bundle
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
      </success_criteria>
