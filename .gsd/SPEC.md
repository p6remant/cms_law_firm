# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision

An enterprise law firm Content Management System (CMS) frontend built with React 19, Vite, TanStack Router, Tailwind CSS v4, and Puck editor, enabling non-technical staff and administrators to visually compose, customize, and publish firm landing pages, practice areas, attorney bios, office location maps, and interactive inquiry/contact forms with flexible UI blocks.

## Goals

1. Provide a robust visual page editor with specialized, customizable law firm website blocks.
2. Deliver clean, responsive, accessible, and type-safe UI components for public visitor experiences.
3. Support visual form building with customizable fields (Input, Textarea, Select, Submit Button) for inquiries, consultation requests, and newsletter subscriptions.
4. Provide high-conversion composite section blocks including Law Firm Contact Sections and Newsletter Subscription banners.
5. Maintain high code quality, strict TypeScript typing, and fast client-side performance.

## Non-Goals (Out of Scope for Current Milestone)

- Backend email dispatch server or database storage of form submissions (frontend validation, customizable schema, and client submission handler/hooks first).
- Complex multi-page conditional survey branching logic (standard contact & lead forms with core fields).
- External CAPTCHA dependencies (clean client-side validation and honeypot field support).

## Users

- **Law firm content editors & administrators:** Composing contact forms, newsletter signups, and client intake sections.
- **Site visitors & prospective clients:** Inquiring about legal services, booking consultations, or subscribing to firm legal updates.

## Constraints

- Integrates cleanly with `@puckeditor/core` configuration and slot architecture in `src/features/editor/`.
- Accessible form elements (`aria-labels`, visible labels, focus rings, keyboard navigation).
- Compatible with Tailwind CSS v4 design tokens and existing theme conventions (`light` / `dark`).
- Strict TypeScript compatibility under `noUncheckedIndexedAccess: true`.

## Milestone Success Criteria (form-blocks)

- [ ] Essential form field blocks defined: `InputField` (text/email/tel), `TextareaField`, `SelectField` (dropdown with options), and `FormButton`.
- [ ] `Form` container block with a slot accepting form field components and customizable title, description, layout, and submit behavior.
- [ ] Pre-configured `ContactSection` block pairing firm contact info with an inquiry form.
- [ ] Pre-configured `Newsletter` block supporting inline and stacked subscription layouts.
- [ ] Automated unit test suites for form validation, field helpers, and options.
- [ ] Full project build (`pnpm run build`), typecheck (`pnpm run typecheck`), and lint (`pnpm run lint`) pass cleanly.
