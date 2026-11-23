import { getTextAlignClass } from '@/features/editor/config/field-options';
import type { FormButtonProps, FormButtonVariant, FormFieldWidth } from '@/features/editor/types';
import { resolveFieldWidthClass } from '@/features/editor/utils/form-utils';

function getVariantClass(variant: FormButtonVariant): string {
  switch (variant) {
    case 'secondary':
      return 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700';
    case 'outline':
      return 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800';
    case 'primary':
    default:
      return 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200';
  }
}

function getButtonWidthClass(width: FormFieldWidth | 'auto'): string {
  switch (width) {
    case 'full':
      return 'w-full';
    case 'half':
      return 'w-full md:w-1/2';
    case 'auto':
    default:
      return 'w-auto';
  }
}

export function FormButton({ label, variant, width, align }: FormButtonProps) {
  const containerSpanClass = resolveFieldWidthClass(width === 'auto' ? 'full' : width);
  const alignClass = getTextAlignClass(align);
  const variantClass = getVariantClass(variant);
  const buttonWidthClass = getButtonWidthClass(width);

  return (
    <div className={`${containerSpanClass} ${alignClass} pt-2`}>
      <button
        type="submit"
        className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:focus:ring-slate-400 ${variantClass} ${buttonWidthClass}`}
      >
        {label}
      </button>
    </div>
  );
}
