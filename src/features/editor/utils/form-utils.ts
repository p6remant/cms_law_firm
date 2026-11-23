import type { FormFieldWidth, SelectOption } from '../types.ts';

/**
 * Parses raw option strings or arrays into a structured SelectOption array.
 * Supports newline-delimited lines, comma separation, and "Label | value" syntax.
 */
export function parseSelectOptions(rawOptions?: string | SelectOption[] | null): SelectOption[] {
  if (!rawOptions) {
    return [];
  }

  if (Array.isArray(rawOptions)) {
    return rawOptions;
  }

  const trimmedInput = rawOptions.trim();
  if (!trimmedInput) {
    return [];
  }

  // Determine line split strategy: newline if present, otherwise comma if single line
  const lines = trimmedInput.includes('\n')
    ? trimmedInput.split(/\r?\n/)
    : trimmedInput.includes(',')
      ? trimmedInput.split(',')
      : [trimmedInput];

  const results: SelectOption[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.includes('|')) {
      const [labelPart = '', ...valueParts] = line.split('|');
      const label = labelPart.trim();
      const value = valueParts.join('|').trim();
      results.push({
        label: label || value,
        value: value || label,
      });
    } else {
      results.push({
        label: line,
        value: line,
      });
    }
  }

  return results;
}

/**
 * Resolves Tailwind CSS grid column span class for form fields based on width.
 */
export function resolveFieldWidthClass(width?: FormFieldWidth | 'auto' | (string & {})): string {
  switch (width) {
    case 'half':
      return 'col-span-1';
    case 'auto':
      return 'w-auto';
    case 'full':
    default:
      return 'col-span-1 md:col-span-2';
  }
}

/**
 * Validates email addresses using RFC-compliant format.
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates telephone numbers (supports international and US formats, minimum 7 digits).
 */
export function validatePhone(phone: string): boolean {
  if (typeof phone !== 'string') {
    return false;
  }
  const trimmed = phone.trim();
  if (!trimmed) {
    return false;
  }
  // Allow leading +, digits, spaces, dashes, parentheses, dots
  if (!/^\+?[0-9\s\-().]+$/.test(trimmed)) {
    return false;
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  return digitsOnly.length >= 7;
}

/**
 * Validates a single form field based on type, value, and required status.
 */
export function validateFormField(
  type: string,
  value: unknown,
  required?: boolean
): { valid: boolean; error?: string } {
  const isEmpty =
    value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

  if (required && isEmpty) {
    return { valid: false, error: 'This field is required.' };
  }

  if (!isEmpty && typeof value === 'string') {
    if (type === 'email' && !validateEmail(value)) {
      return { valid: false, error: 'Please enter a valid email address.' };
    }
    if (type === 'tel' && !validatePhone(value)) {
      return { valid: false, error: 'Please enter a valid phone number.' };
    }
  }

  return { valid: true };
}

/**
 * Simulates an asynchronous form submission for client feedback display.
 */
export async function simulateFormSubmit(
  _endpoint?: string,
  _data?: Record<string, unknown>,
  delayMs: number = 400
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Thank you. Your request has been submitted successfully.',
      });
    }, delayMs);
  });
}
