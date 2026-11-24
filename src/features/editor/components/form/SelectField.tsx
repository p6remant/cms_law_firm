import type { SelectFieldProps } from '@/features/editor/types';
import { parseSelectOptions, resolveFieldWidthClass } from '@/features/editor/utils/form-utils';

export function SelectField({
  name,
  label,
  placeholder,
  options,
  required = false,
  helperText,
  width,
}: SelectFieldProps) {
  const id = `field-${name || 'select'}`;
  const helperId = helperText ? `${id}-helper` : undefined;
  const parsedOptions = parseSelectOptions(options);

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
      <select
        id={id}
        name={name}
        required={required}
        aria-required={required}
        aria-describedby={helperId}
        defaultValue=""
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-slate-400"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {parsedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p id={helperId} className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
