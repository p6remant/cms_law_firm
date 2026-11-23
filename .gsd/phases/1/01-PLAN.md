---
phase: 1
plan: 1
wave: 1
depends_on: []
files_modified:
  - src/features/editor/types.ts
  - src/features/editor/config/field-options.ts
  - src/features/editor/utils/form-utils.ts
  - src/features/editor/utils/form-utils.test.ts
  - package.json
autonomous: true
user_setup: []

must_haves:
  truths:
    - 'Form field types (InputFieldProps, TextareaFieldProps, SelectFieldProps, FormButtonProps, FormProps) are defined in types.ts and registered in EditorComponentProps'
    - 'Form field configuration options (input types, field widths, button variants, alignment, themes) are defined in field-options.ts'
    - 'Form helper utilities (parseSelectOptions, resolveFieldWidthClass, validateFormField, validateEmail, validatePhone) are implemented in form-utils.ts and 100% verified by automated unit tests in form-utils.test.ts'
    - 'The test script is registered in package.json and executes unit tests cleanly with node test runner'
  artifacts:
    - 'src/features/editor/types.ts'
    - 'src/features/editor/config/field-options.ts'
    - 'src/features/editor/utils/form-utils.ts'
    - 'src/features/editor/utils/form-utils.test.ts'
---

# Plan 1.1: Form Field Types, Options, and Utility Suite

<objective>
Define TypeScript types, editor field options, and helper utilities for form building blocks (`InputField`, `TextareaField`, `SelectField`, `FormButton`, and `Form` container). Verify all utility functions with automated unit tests.

Purpose: Establish the type-safe foundational contracts and parsing/validation logic required by form UI components and Puck editor registration.
Output: Extended `types.ts`, `field-options.ts`, new utility module `form-utils.ts`, unit test suite `form-utils.test.ts`, and updated `package.json` test script.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/features/editor/types.ts
- src/features/editor/config/field-options.ts
- src/features/editor/utils/map-location.ts
- src/features/editor/utils/map-location.test.ts
</context>

<tasks>

<task type="auto">
  <name>Define Form Types and Field Options</name>
  <files>src/features/editor/types.ts, src/features/editor/config/field-options.ts</files>
  <action>
    1. In `src/features/editor/types.ts`:
       - Define `FormFieldWidth = 'full' | 'half'`.
       - Define `InputFieldType = 'text' | 'email' | 'tel' | 'number'`.
       - Define `FormButtonVariant = 'primary' | 'secondary' | 'outline'`.
       - Define `SelectOption = { label: string; value: string }`.
       - Define `InputFieldProps = { name: string; label: string; type: InputFieldType; placeholder?: string; required?: boolean; helperText?: string; width: FormFieldWidth; }`.
       - Define `TextareaFieldProps = { name: string; label: string; placeholder?: string; required?: boolean; rows?: number; helperText?: string; width: FormFieldWidth; }`.
       - Define `SelectFieldProps = { name: string; label: string; placeholder?: string; options: string; required?: boolean; helperText?: string; width: FormFieldWidth; }`.
       - Define `FormButtonProps = { label: string; variant: FormButtonVariant; width: FormFieldWidth | 'auto'; align: TextAlign; }`.
       - Define `FormProps = WithLayout<{ title?: string; description?: string; submitEndpoint?: string; submitMethod: 'POST' | 'GET'; successMessage?: string; errorMessage?: string; theme: 'dark' | 'light'; fields: Slot; }>`.
       - Register all 5 components (`InputField`, `TextareaField`, `SelectField`, `FormButton`, `Form`) into `EditorComponentProps`.

    2. In `src/features/editor/config/field-options.ts`:
       - Export `INPUT_TYPE_OPTIONS`: `[ { label: 'Text', value: 'text' }, { label: 'Email', value: 'email' }, { label: 'Phone (Tel)', value: 'tel' }, { label: 'Number', value: 'number' } ]`.
       - Export `FIELD_WIDTH_OPTIONS`: `[ { label: 'Full Width (100%)', value: 'full' }, { label: 'Half Width (50%)', value: 'half' } ]`.
       - Export `BUTTON_WIDTH_OPTIONS`: `[ { label: 'Auto', value: 'auto' }, { label: 'Full Width', value: 'full' }, { label: 'Half Width', value: 'half' } ]`.
       - Export `FORM_BUTTON_VARIANT_OPTIONS`: `[ { label: 'Primary', value: 'primary' }, { label: 'Secondary', value: 'secondary' }, { label: 'Outline', value: 'outline' } ]`.
       - Export `FORM_THEME_OPTIONS`: `[ { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' } ]`.
       - Export `FORM_METHOD_OPTIONS`: `[ { label: 'POST', value: 'POST' }, { label: 'GET', value: 'GET' } ]`.

    AVOID: Forcing nested object array editors for `SelectField.options` in Puck sidebar, which creates cumbersome multi-modal UX. Keep `options` typed as a string in `SelectFieldProps` so editors can enter options line-by-line (e.g. `Label | value` or `Option Name`), parsed cleanly by utility helpers.

  </action>
  <verify>pnpm run typecheck</verify>
  <done>src/features/editor/types.ts exports all 5 form types and EditorComponentProps includes InputField, TextareaField, SelectField, FormButton, Form. TypeScript typecheck passes without errors.</done>
</task>

<task type="auto">
  <name>Implement Form Utilities and Automated Unit Tests</name>
  <files>src/features/editor/utils/form-utils.ts, src/features/editor/utils/form-utils.test.ts, package.json</files>
  <action>
    1. In `src/features/editor/utils/form-utils.ts`:
       - Implement `parseSelectOptions(rawOptions?: string | SelectOption[] | null): SelectOption[]`:
         - Handles string input: splits by newline (or comma if single line), trims items, filters out empty lines.
         - If an item contains `|` (e.g. "Corporate Law | corporate"), parses left as `label` and right as `value`.
         - If no `|`, uses the trimmed string for both `label` and `value`.
         - Handles array of `{ label, value }` if passed directly.
         - Always returns an array (empty array `[]` on empty/null input).
       - Implement `resolveFieldWidthClass(width?: FormFieldWidth | 'auto' | string): string`:
         - Maps `'half'` -> `'col-span-1'`.
         - Maps `'full'` -> `'col-span-1 md:col-span-2'`.
         - Maps `'auto'` -> `'w-auto'`.
         - Defaults to `'col-span-1 md:col-span-2'`.
       - Implement `validateEmail(email: string): boolean`:
         - Standard RFC-compliant email pattern check (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
       - Implement `validatePhone(phone: string): boolean`:
         - Validates telephone strings (permits numbers, spaces, dashes, dots, parentheses, and leading plus; minimum 7 digits).
       - Implement `validateFormField(type: string, value: unknown, required?: boolean): { valid: boolean; error?: string }`:
         - If `required` and value is empty string / null / undefined: returns `{ valid: false, error: 'This field is required.' }`.
         - If value exists and `type === 'email'`: validates with `validateEmail`. Returns `{ valid: false, error: 'Please enter a valid email address.' }` if invalid.
         - If value exists and `type === 'tel'`: validates with `validatePhone`. Returns `{ valid: false, error: 'Please enter a valid phone number.' }` if invalid.
         - Otherwise returns `{ valid: true }`.
       - Implement `simulateFormSubmit(endpoint?: string, data?: Record<string, unknown>): Promise<{ success: boolean; message: string }>`:
         - Simulates submission promise with a 400ms resolved response for client feedback display.

    2. In `src/features/editor/utils/form-utils.test.ts`:
       - Use `node:test` (`describe`, `it`) and `node:assert/strict` (`assert`).
       - Write unit tests covering:
         - `parseSelectOptions`: newline strings, `Label | value` pipes, trimmed whitespace, empty/blank lines, default fallback.
         - `resolveFieldWidthClass`: 'half', 'full', 'auto', and unknown fallback.
         - `validateEmail`: valid addresses, invalid addresses, missing domain/at-sign.
         - `validatePhone`: US/international format numbers, invalid alpha characters, short digits.
         - `validateFormField`: required checks, optional field handling, email/phone format validation.
         - `simulateFormSubmit`: resolves successfully with message.

    3. In `package.json`:
       - Add `"test": "node --test src/features/editor/utils/*.test.ts"` to `scripts`.

    AVOID: Relying on DOM or browser globals in `form-utils.ts` so all utilities remain 100% pure, portable, and testable under Node.js test runner.

  </action>
  <verify>pnpm test</verify>
  <done>All unit tests in form-utils.test.ts pass with 0 failures, and pnpm test is registered and working in package.json.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `pnpm test` executes and passes all tests in `src/features/editor/utils/form-utils.test.ts`
- [ ] `pnpm run typecheck` passes with strict TypeScript validation
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
      </success_criteria>
