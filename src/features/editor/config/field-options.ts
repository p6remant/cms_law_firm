import { type ObjectField, type SelectField } from '@puckeditor/core';
import { type LayoutFieldProps, type SpacingValue, type TextAlign } from '@/features/editor/types';

export const SPACING_OPTIONS: { label: string; value: SpacingValue }[] = [
  { label: '0px', value: '0px' },
  { label: '8px', value: '8px' },
  { label: '16px', value: '16px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
  { label: '48px', value: '48px' },
  { label: '64px', value: '64px' },
  { label: '96px', value: '96px' },
];

export const ALIGN_OPTIONS: { label: string; value: TextAlign }[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

export const DEFAULT_LAYOUT: LayoutFieldProps = {
  padding: '0px',
};

export const verticalPaddingField: SelectField = {
  type: 'select',
  label: 'Vertical padding',
  options: SPACING_OPTIONS,
};

export const layoutField: ObjectField<LayoutFieldProps> = {
  type: 'object',
  label: 'Layout',
  collapsible: true,
  defaultExpanded: true,
  variant: 'flush',
  objectFields: {
    padding: verticalPaddingField,
  },
};

export function getTextAlignClass(align: TextAlign): string {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

export function getGridColumnsClass(columns: 2 | 3 | 4): string {
  if (columns === 2) return 'grid-cols-1 md:grid-cols-2';
  if (columns === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  return 'grid-cols-1 md:grid-cols-3';
}
