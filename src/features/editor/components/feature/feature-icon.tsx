import { createElement } from 'react';
import { type FeatureIconName } from '@/features/editor/types';
import { getFeatureIcon } from '@/features/editor/utils/feature-utils';

type FeatureIconProps = {
  icon?: FeatureIconName | (string & {}) | null;
  className?: string;
};

/**
 * Shared decorative Lucide icon renderer for feature blocks, delegating icon
 * resolution and fallback handling to getFeatureIcon.
 */
export function FeatureIcon({ icon, className = 'h-5 w-5 shrink-0' }: FeatureIconProps) {
  return createElement(getFeatureIcon(icon), {
    className,
    'aria-hidden': true,
  });
}
