import { createFileRoute, Link } from '@tanstack/react-router';

function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-6">
      <Link
        to="/editor"
        className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Go to Editor
      </Link>
    </main>
  );
}

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});
