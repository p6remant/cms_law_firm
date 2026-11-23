import type { TextareaFieldProps } from '@/features/editor/types';
import { resolveFieldWidthClass } from '@/features/editor/utils/form-utils';

export function TextareaField({
  name,
  label,
  placeholder,
  required = false,
  rows = 4,
  helperText,
  width,
}: TextareaFieldProps) {
  const id = `field-${name || 'textarea'}`;
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className={resolveFieldWidthClass(width)}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        rows={rows || 4}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-describedby={helperId}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-slate-400"
      />
      {helperText && (
        <p id={helperId} className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
