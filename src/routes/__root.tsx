import { createRootRoute, Outlet } from '@tanstack/react-router';

function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Outlet />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
