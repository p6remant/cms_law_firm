import { Render } from '@puckeditor/core';
import { initialPageData, puckConfig } from '@/features/editor/config/puck-config';

export function PuckPageRenderer() {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
      <Render config={puckConfig} data={initialPageData} />
    </div>
  );
}
