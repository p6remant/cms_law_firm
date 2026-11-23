# ROADMAP.md

> **Current Milestone**: `form-blocks`
> **Goal**: Add customizable form building blocks (`InputField`, `TextareaField`, `SelectField`, `FormButton`, `Form`), a law firm `ContactSection` block, and a `Newsletter` subscription block to Puck editor.

## Must-Haves

- [ ] Form types (`InputFieldProps`, `TextareaFieldProps`, `SelectFieldProps`, `FormButtonProps`, `FormProps`) defined in `src/features/editor/types.ts` and registered in `EditorComponentProps`.
- [ ] Field configuration options (input types, column widths, validation rules) and option list parser with automated unit tests.
- [ ] UI components for `InputField`, `TextareaField`, `SelectField`, `FormButton`, and `FormContainer` supporting label, placeholder, required flag, column span (half / full), helper text, and themes.
- [ ] Form components registered in `puck-config.tsx` under a dedicated `forms` category with slot-based composition.
- [ ] Composite `ContactSection` block combining law firm contact details (address, phone, email, hours) with a customizable consultation inquiry form.
- [ ] Composite `Newsletter` subscription block supporting single-row and stacked email signup with privacy notice and success feedback state.
- [ ] 100% verification across unit tests, `pnpm run build`, `pnpm run typecheck`, and `pnpm run lint`.

## Phases

### Phase 1: Form Field Building Blocks & Form Container

**Status**: ⬜ Not Started
**Objective**: Define types, field options, and responsive UI components for `InputField`, `TextareaField`, `SelectField`, `FormButton`, and `Form` container block in Puck editor with slot composition.

### Phase 2: Law Firm Contact Section Block

**Status**: ⬜ Not Started
**Objective**: Build a high-conversion 2-column `ContactSection` block combining law firm office information, phone, email, consultation details, and an inquiry form.

### Phase 3: Newsletter Subscription Block & Final Verification

**Status**: ⬜ Not Started
**Objective**: Build a responsive `Newsletter` subscription block with layout variants, success feedback simulation, sample integration data, and complete verification across all tests and build checks.
