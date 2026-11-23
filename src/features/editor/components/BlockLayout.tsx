import { type ReactNode } from 'react';
import { type LayoutFieldProps } from '@/features/editor/types';

type BlockLayoutProps = {
  layout?: LayoutFieldProps;
  className?: string;
  children: ReactNode;
};

export function BlockLayout({ layout, className, children }: BlockLayoutProps) {
  const padding = layout?.padding ?? '0px';

  return (
    <div style={{ paddingTop: padding, paddingBottom: padding }} className={className}>
      {children}
    </div>
  );
}
