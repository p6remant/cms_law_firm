---
phase: 1
plan: 2
wave: 2
depends_on: ['01']
files_modified:
  - src/features/editor/components/form/InputField.tsx
  - src/features/editor/components/form/TextareaField.tsx
  - src/features/editor/components/form/SelectField.tsx
  - src/features/editor/components/form/FormButton.tsx
  - src/features/editor/components/form/FormContainer.tsx
  - src/features/editor/components/form/index.ts
autonomous: true
user_setup: []

must_haves:
  truths:
    - 'InputField renders an accessible HTML input with label, required asterisk, placeholder, helper text, and column width class'
    - 'TextareaField renders an accessible HTML textarea with label, configurable rows, required indicator, and helper text'
    - 'SelectField parses options string via parseSelectOptions and renders an accessible dropdown with placeholder and options'
    - 'FormButton renders an accessible button supporting primary, secondary, and outline styling with width and alignment controls'
    - 'FormContainer wraps the form slot in a styled law firm container card with title, description, and interactive submit success feedback'
    - 'All form components export cleanly from src/features/editor/components/form/index.ts'
  artifacts:
    - 'src/features/editor/components/form/InputField.tsx'
    - 'src/features/editor/components/form/TextareaField.tsx'
    - 'src/features/editor/components/form/SelectField.tsx'
    - 'src/features/editor/components/form/FormButton.tsx'
    - 'src/features/editor/components/form/FormContainer.tsx'
    - 'src/features/editor/components/form/index.ts'
---

# Plan 1.2: Form UI Components & Container

<objective>
Build accessible, responsive, theme-aware React UI components for law firm forms: `InputField`, `TextareaField`, `SelectField`, `FormButton`, and `FormContainer`.

Purpose: Provide the visual and interactive elements for visual form building in Puck editor, supporting client inquiry and lead generation.
Output: UI component files in `src/features/editor/components/form/` and a unified barrel export.
</objective>

<context>
Load for context:
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/features/editor/types.ts
- src/features/editor/config/field-options.ts
- src/features/editor/utils/form-utils.ts
- src/features/editor/components/BlockLayout.tsx
</context>

<tasks>

<task type="auto">
  <name>Build Form Field Components (InputField, TextareaField, SelectField, FormButton)</name>
  <files>src/features/editor/components/form/InputField.tsx, src/features/editor/components/form/TextareaField.tsx, src/features/editor/components/form/SelectField.tsx, src/features/editor/components/form/FormButton.tsx</files>
  <action>
    1. In `src/features/editor/components/form/InputField.tsx`:
       - Accept `InputFieldProps` (`name`, `label`, `type`, `placeholder`, `required`, `helperText`, `width`).
       - Generate accessible `id` (e.g. `field-${name}`).
       - Render container with `resolveFieldWidthClass(width)`.
       - Render `<label htmlFor={id}>` with label text and `<span className="text-red-500" aria-hidden="true">*</span>` if `required`.
       - Render `<input id={id} name={name} type={type} placeholder={placeholder} required={required} aria-required={required} aria-describedby={helperText ? ... : undefined} />`.
       - Apply Tailwind classes: responsive focus rings (`focus:ring-2 focus:ring-slate-900 focus:outline-none dark:focus:ring-slate-400`), smooth borders (`border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-900 dark:text-neutral-100 rounded-lg px-3.5 py-2.5 text-sm`).
       - Render helper text underneath input (`text-xs text-slate-500 dark:text-neutral-400 mt-1`).

    2. In `src/features/editor/components/form/TextareaField.tsx`:
       - Accept `TextareaFieldProps` (`name`, `label`, `placeholder`, `required`, `rows`, `helperText`, `width`).
       - Generate accessible `id`.
       - Render container with `resolveFieldWidthClass(width)`.
       - Render `<label htmlFor={id}>` with label text and required asterisk.
       - Render `<textarea id={id} name={name} rows={rows || 4} placeholder={placeholder} required={required} aria-required={required} />`.
       - Apply matching styling (borders, rounded-lg, focus ring, placeholder styling).
       - Render helper text if provided.

    3. In `src/features/editor/components/form/SelectField.tsx`:
       - Accept `SelectFieldProps` (`name`, `label`, `placeholder`, `options`, `required`, `helperText`, `width`).
       - Parse options using `parseSelectOptions(options)`.
       - Generate accessible `id`.
       - Render container with `resolveFieldWidthClass(width)`.
       - Render `<label htmlFor={id}>` with required asterisk if `required`.
       - Render `<select id={id} name={name} required={required} aria-required={required}>`.
       - Include placeholder option if `placeholder` provided (`<option value="" disabled selected>{placeholder}</option>`).
       - Map parsed options: `<option key={opt.value} value={opt.value}>{opt.label}</option>`.
       - Render helper text if provided.

    4. In `src/features/editor/components/form/FormButton.tsx`:
       - Accept `FormButtonProps` (`label`, `variant`, `width`, `align`).
       - Resolve width class: `full` -> `w-full`, `half` -> `w-full md:w-1/2`, `auto` -> `w-auto`.
       - Resolve alignment container using `getTextAlignClass(align)` (from field-options).
       - Variant styles:
         - `primary`: `bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200`
         - `secondary`: `bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700`
         - `outline`: `border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800`
       - Render `<button type="submit" className="...">` with label, rounded-lg, transition, px-5 py-2.5 font-medium text-sm.

    AVOID: Omitting `aria-required` or `<label htmlFor>` connections; all form fields must be fully accessible for screen readers and keyboard navigation.

  </action>
  <verify>pnpm run typecheck</verify>
  <done>InputField, TextareaField, SelectField, and FormButton components compile cleanly with proper TypeScript props.</done>
</task>

<task type="auto">
  <name>Build FormContainer and Barrel Export</name>
  <files>src/features/editor/components/form/FormContainer.tsx, src/features/editor/components/form/index.ts</files>
  <action>
    1. In `src/features/editor/components/form/FormContainer.tsx`:
       - Accept `FormProps` (`title`, `description`, `submitEndpoint`, `submitMethod`, `successMessage`, `errorMessage`, `theme`, `fields: Slot`, `layout`).
       - Import `BlockLayout` from `@/features/editor/components/BlockLayout`.
       - Manage local client state `isSubmitted: boolean`, `isSubmitting: boolean`, `errorText: string | null`.
       - In `handleSubmit(e: React.FormEvent<HTMLFormElement>)`:
         - Call `e.preventDefault()`.
         - Set `isSubmitting(true)`, clear `errorText`.
         - Simulate submission using `simulateFormSubmit` (or dispatching to `submitEndpoint` if configured).
         - On completion, set `isSubmitted(true)`, `isSubmitting(false)`.
       - If `isSubmitted`:
         - Render a success confirmation banner with CheckCircle icon (from `lucide-react`), displaying `successMessage || 'Thank you! Your inquiry has been submitted.'`.
         - Include a "Submit another inquiry" button that sets `isSubmitted(false)`.
       - In the normal form state:
         - Wrap inside `<BlockLayout layout={layout}>`.
         - Container styling based on `theme === 'dark'`:
           - Dark: `bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-2xl p-6 sm:p-8 shadow-sm`
           - Light: `bg-white border border-slate-200 text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xs`
         - Header:
           - If `title`: render `<h3 className="text-2xl font-bold tracking-tight">{title}</h3>`.
           - If `description`: render `<p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">{description}</p>`.
         - Form element `<form onSubmit={handleSubmit} className="mt-6">`:
           - Render `<fields.Slot className="grid grid-cols-1 md:grid-cols-2 gap-4" />` (using Puck's slot component pattern `const Fields = fields; <Fields className="grid grid-cols-1 md:grid-cols-2 gap-4" />`).
           - If `errorText`: render accessible error alert box with `errorMessage || errorText`.
       - Ensure `fields` slot can be dropped into and rendered in both editor mode and view mode.

    2. In `src/features/editor/components/form/index.ts`:
       - Export `InputField` from `./InputField`.
       - Export `TextareaField` from `./TextareaField`.
       - Export `SelectField` from `./SelectField`.
       - Export `FormButton` from `./FormButton`.
       - Export `FormContainer` from `./FormContainer`.

    AVOID: Forgetting `e.preventDefault()` in `handleSubmit`, which triggers full browser navigation and breaks Puck's visual editing environment.

  </action>
  <verify>pnpm run typecheck</verify>
  <done>FormContainer and index.ts export correctly and pass TypeScript compilation.</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] `src/features/editor/components/form/index.ts` exports all 5 form components
- [ ] `pnpm run typecheck` passes with 0 errors
</verification>

<success_criteria>

- [ ] All tasks verified
- [ ] Must-haves confirmed
      </success_criteria>
