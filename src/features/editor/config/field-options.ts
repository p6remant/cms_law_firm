import type { ObjectField, SelectField } from '@puckeditor/core';
import type {
  FormButtonVariant,
  FormFieldWidth,
  ImageAspectRatio,
  ImageObjectFit,
  InputFieldType,
  LayoutFieldProps,
  MapAspectRatio,
  MapHeight,
  MapLocationMode,
  // PdfDisplayMode,
  // PdfPreviewHeight,
  ScrollDirection,
  SpacingValue,
  TeamImageShape,
  TextAlign,
  VideoAspectRatio,
} from '../types.ts';

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

export const MAP_LOCATION_MODE_OPTIONS: { label: string; value: MapLocationMode }[] = [
  { label: 'Coordinates (Lat/Lng)', value: 'coordinates' },
  { label: 'Google Maps Link', value: 'link' },
];

export const MAP_HEIGHT_OPTIONS: { label: string; value: MapHeight }[] = [
  { label: 'Small (256px)', value: 'sm' },
  { label: 'Medium (384px)', value: 'md' },
  { label: 'Large (512px)', value: 'lg' },
  { label: 'Full (640px)', value: 'full' },
];

export const MAP_ASPECT_RATIO_OPTIONS: { label: string; value: MapAspectRatio }[] = [
  { label: 'Auto (Use Height)', value: 'auto' },
  { label: '16:9 (Widescreen)', value: '16/9' },
  { label: '4:3 (Standard)', value: '4/3' },
  { label: '1:1 (Square)', value: '1/1' },
];

export const MAP_THEME_OPTIONS: { label: string; value: 'dark' | 'light' }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export const INPUT_TYPE_OPTIONS: { label: string; value: InputFieldType }[] = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Phone (Tel)', value: 'tel' },
  { label: 'Number', value: 'number' },
];

export const FIELD_WIDTH_OPTIONS: { label: string; value: FormFieldWidth }[] = [
  { label: 'Full Width (100%)', value: 'full' },
  { label: 'Half Width (50%)', value: 'half' },
];

export const BUTTON_WIDTH_OPTIONS: { label: string; value: FormFieldWidth | 'auto' }[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Full Width', value: 'full' },
  { label: 'Half Width', value: 'half' },
];

export const FORM_BUTTON_VARIANT_OPTIONS: { label: string; value: FormButtonVariant }[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
];

export const FORM_THEME_OPTIONS: { label: string; value: 'light' | 'dark' }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export const FORM_METHOD_OPTIONS: { label: string; value: 'POST' | 'GET' }[] = [
  { label: 'POST', value: 'POST' },
  { label: 'GET', value: 'GET' },
];

export const BOOLEAN_RADIO_OPTIONS: { label: string; value: boolean }[] = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const SCROLL_DIRECTION_OPTIONS: { label: string; value: ScrollDirection }[] = [
  { label: 'Right (Forward)', value: 'right' },
  { label: 'Left (Backward)', value: 'left' },
];

export const AUTO_SCROLL_INTERVAL_OPTIONS: { label: string; value: number }[] = [
  { label: '2 Seconds', value: 2000 },
  { label: '3 Seconds', value: 3000 },
  { label: '5 Seconds', value: 5000 },
  { label: '8 Seconds', value: 8000 },
];

export const TEAM_IMAGE_SHAPE_OPTIONS: { label: string; value: TeamImageShape }[] = [
  { label: 'Rounded (Circle)', value: 'rounded' },
  { label: 'Square (1:1)', value: 'square' },
  { label: 'Rectangle (Portrait 3:4)', value: 'rectangle' },
];

export const TEAM_CARDS_PER_VIEW_OPTIONS: { label: string; value: 2 | 3 | 4 }[] = [
  { label: '2 Cards', value: 2 },
  { label: '3 Cards', value: 3 },
  { label: '4 Cards', value: 4 },
];

export const CLIENT_COLUMNS_OPTIONS: { label: string; value: 3 | 4 }[] = [
  { label: '3 Columns', value: 3 },
  { label: '4 Columns', value: 4 },
];

export const VIDEO_ASPECT_RATIO_OPTIONS: { label: string; value: VideoAspectRatio }[] = [
  { label: '16:9 (Widescreen)', value: '16/9' },
  { label: '21:9 (Cinematic)', value: '21/9' },
  { label: '4:3 (Standard)', value: '4/3' },
  { label: '1:1 (Square)', value: '1/1' },
];

export const IMAGE_COLUMNS_OPTIONS: { label: string; value: 1 | 2 | 3 }[] = [
  { label: '1 Column (Featured)', value: 1 },
  { label: '2 Columns', value: 2 },
  { label: '3 Columns', value: 3 },
];

export const IMAGE_ASPECT_RATIO_OPTIONS: { label: string; value: ImageAspectRatio }[] = [
  { label: '16:9 (Landscape)', value: '16/9' },
  { label: '4:3 (Standard)', value: '4/3' },
  { label: '1:1 (Square)', value: '1/1' },
  { label: '3:4 (Portrait)', value: '3/4' },
  { label: 'Auto (Original Ratio)', value: 'auto' },
];

export const IMAGE_OBJECT_FIT_OPTIONS: { label: string; value: ImageObjectFit }[] = [
  { label: 'Cover (Fill Frame)', value: 'cover' },
  { label: 'Contain (Full Image)', value: 'contain' },
];

/*
export const PDF_DISPLAY_MODE_OPTIONS: { label: string; value: PdfDisplayMode }[] = [
  { label: 'Embedded Viewer + Card', value: 'viewer' },
  { label: 'Compact Document Card', value: 'card' },
];

export const PDF_PREVIEW_HEIGHT_OPTIONS: { label: string; value: PdfPreviewHeight }[] = [
  { label: 'Compact (384px)', value: 'sm' },
  { label: 'Standard (512px)', value: 'md' },
  { label: 'Expanded (672px)', value: 'lg' },
];
*/

export function getTeamImageShapeClass(shape: TeamImageShape): string {
  switch (shape) {
    case 'rounded':
      return 'h-28 w-28 rounded-full aspect-square object-cover mx-auto';
    case 'square':
      return 'w-full aspect-square rounded-xl object-cover';
    case 'rectangle':
      return 'w-full aspect-[3/4] rounded-xl object-cover';
    default:
      return 'h-28 w-28 rounded-full aspect-square object-cover mx-auto';
  }
}

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

export function getMapContainerClass(height?: MapHeight, aspectRatio?: MapAspectRatio): string {
  if (aspectRatio && aspectRatio !== 'auto') {
    switch (aspectRatio) {
      case '16/9':
        return 'aspect-video w-full';
      case '4/3':
        return 'aspect-[4/3] w-full';
      case '1/1':
        return 'aspect-square w-full';
    }
  }

  switch (height) {
    case 'sm':
      return 'h-64 w-full';
    case 'md':
      return 'h-96 w-full';
    case 'lg':
      return 'h-[32rem] w-full';
    case 'full':
      return 'h-[40rem] w-full';
    default:
      return 'h-96 w-full';
  }
}
