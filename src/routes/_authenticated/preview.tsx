import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { PuckPageRenderer } from '@/features/editor/components/PuckPageRenderer';

function PreviewPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 p-6">
      <div>
        <Link
          to="/editor"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <PuckPageRenderer />
    </main>
  );
}

export const Route = createFileRoute('/_authenticated/preview')({
  component: PreviewPage,
});
