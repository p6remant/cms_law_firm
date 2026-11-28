import { Render } from '@puckeditor/core';
import { initialPageData, puckConfig } from '@/features/editor/config/puck-config';

export function PuckPageRenderer() {
  return (
    <div className="w-full bg-white">
      <Render config={puckConfig} data={initialPageData} />
    </div>
  );
}
