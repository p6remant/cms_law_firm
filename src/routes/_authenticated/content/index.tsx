import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/content/')({
  component: () => (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
      <p className="text-sm text-slate-600">Manage posts, pages, and categories.</p>
    </section>
  ),
});
