import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            CMS Law
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/dashboard" className="[&.active]:text-slate-900">
              Dashboard
            </Link>
            <Link to="/content" className="[&.active]:text-slate-900">
              Content
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 p-6">
        <Outlet />
      </main>
    </div>
  ),
});
