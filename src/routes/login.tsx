import { createFileRoute } from '@tanstack/react-router';
import { SignInForm } from '@/features/auth/components/SignInForm';

function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-2xl font-semibold text-slate-900">Sign In</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to access the CMS workspace.</p>
        <SignInForm />
      </div>
    </main>
  );
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
