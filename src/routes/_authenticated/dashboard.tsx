import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: () => (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-sm text-slate-600">Overview of CMS articles, media, and settings.</p>
    </section>
  ),
});
