import { createFileRoute, Link } from '@tanstack/react-router';

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">CMS Law</h1>
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}

export const Route = createFileRoute('/')({
  component: HomePage,
});
