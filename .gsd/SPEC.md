# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision

An enterprise law firm Content Management System (CMS) frontend built with React 19, Vite, TanStack Router, Tailwind CSS v4, and Puck editor, enabling non-technical staff and administrators to visually compose, customize, and publish firm landing pages, practice areas, attorney bios, and contact/location sections with flexible UI blocks.

## Goals

1. Provide a robust visual page editor with specialized, customizable law firm website blocks.
2. Deliver clean, responsive, and accessible page rendering for public visitor experiences.
3. Support seamless location and contact sharing through embedded map blocks supporting coordinates (latitude/longitude) and Google Maps links.
4. Maintain high code quality, strict TypeScript typing, and fast client-side performance.

## Non-Goals (Out of Scope for Current Milestone)

- Full backend persistence API for maps (client-side Puck configuration & block data flow first).
- Complex GIS routing or proprietary tile servers (standard Google Maps embed/link & coordinate-based embedding).
- Live geolocation tracking of end-users.

## Users

- **Law firm content editors & administrators:** Composing office location pages, contact sections, and branch details.
- **Site visitors & prospective clients:** Viewing law firm office locations, getting directions, and viewing interactive maps.

## Constraints

- Integrates with existing `@puckeditor/core` architecture in `src/features/editor/`.
- Compatible with Tailwind CSS v4 and project theme tokens (`cn`, `clsx`, `tailwind-merge`).
- Must not require paid API keys for standard coordinate or URL-based iframe embedding.

## Success Criteria

- [ ] Map block registered in Puck editor configuration (`puck-config.tsx`) and exported types (`types.ts`).
- [ ] Supports inputting location via Latitude/Longitude coordinates or Google Maps share/embed link.
- [ ] Provides configurable display options: Title/Eyebrow, office address description, zoom level, aspect ratio/height, theme/style, and external directions link button.
- [ ] Renders interactively and gracefully handles invalid or empty inputs with fallback states.
- [ ] Passes TypeScript type checks and project lint standards.
