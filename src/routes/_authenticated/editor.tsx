import { createFileRoute } from '@tanstack/react-router';
import { PuckEditor } from '@/features/editor/components/PuckEditor';

export const Route = createFileRoute('/_authenticated/editor')({
  component: PuckEditor,
});
