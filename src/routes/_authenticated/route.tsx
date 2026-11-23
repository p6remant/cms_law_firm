import { createFileRoute, Outlet } from '@tanstack/react-router';

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});
