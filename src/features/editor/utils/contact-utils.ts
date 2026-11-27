import type { Contact1Props, Contact2Props, LayoutFieldProps } from '../types.ts';
import { validateEmail } from './form-utils.ts';

export interface ContactThemeClasses {
  wrapper: string;
  surface: string;
  eyebrow: string;
  badge: string;
  heading: string;
  text: string;
  mutedText: string;
  label: string;
  border: string;
  input: string;
  submitButton: string;
  iconContainer: string;
  icon: string;
  link: string;
  statusSuccess: string;
  statusError: string;
  errorText: string;
}

/**
 * Returns pure monochrome theme classes using neutral grayscale tokens and normal tracking.
 */
export function getContactThemeClasses(theme: 'light' | 'dark'): ContactThemeClasses {
  if (theme === 'light') {
    return {
      wrapper: 'bg-white text-black border-neutral-200 tracking-normal',
      surface: 'bg-neutral-50 border-neutral-200 text-black tracking-normal',
      eyebrow: 'text-neutral-600 tracking-normal',
      badge: 'bg-neutral-100 text-neutral-800 border-neutral-200 tracking-normal',
      heading: 'text-black tracking-normal',
      text: 'text-black tracking-normal',
      mutedText: 'text-neutral-600 tracking-normal',
      label: 'text-black tracking-normal',
      border: 'border-neutral-200',
      input:
        'bg-white text-black border-neutral-300 placeholder:text-neutral-500 focus:border-black focus:outline-none tracking-normal',
      submitButton:
        'bg-black text-white border border-black hover:bg-neutral-800 hover:border-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors tracking-normal',
      iconContainer: 'bg-neutral-100 border-neutral-200 text-black',
      icon: 'text-black',
      link: 'text-black underline-offset-4 hover:underline tracking-normal',
      statusSuccess: 'bg-neutral-50 border-neutral-300 text-black tracking-normal',
      statusError: 'bg-neutral-100 border-neutral-900 text-black tracking-normal',
      errorText: 'text-neutral-900 tracking-normal',
    };
  }

  return {
    wrapper: 'bg-black text-white border-neutral-800 tracking-normal',
    surface: 'bg-neutral-950 border-neutral-800 text-white tracking-normal',
    eyebrow: 'text-neutral-400 tracking-normal',
    badge: 'bg-neutral-900 text-neutral-200 border-neutral-800 tracking-normal',
    heading: 'text-white tracking-normal',
    text: 'text-white tracking-normal',
    mutedText: 'text-neutral-400 tracking-normal',
    label: 'text-white tracking-normal',
    border: 'border-neutral-800',
    input:
      'bg-black text-white border-neutral-700 placeholder:text-neutral-500 focus:border-white focus:outline-none tracking-normal',
    submitButton:
      'bg-white text-black border border-white hover:bg-neutral-200 hover:border-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors tracking-normal',
    iconContainer: 'bg-neutral-900 border-neutral-800 text-white',
    icon: 'text-white',
    link: 'text-white underline-offset-4 hover:underline tracking-normal',
    statusSuccess: 'bg-neutral-950 border-neutral-700 text-white tracking-normal',
    statusError: 'bg-neutral-900 border-neutral-300 text-white tracking-normal',
    errorText: 'text-neutral-200 tracking-normal',
  };
}

const DEFAULT_FORM_COPY = {
  nameLabel: 'Name',
  emailLabel: 'Email',
  messageLabel: 'Message',
  submitLabel: 'Send Message',
  successMessage: 'Thank you for your message. We will get back to you shortly.',
  errorMessage: 'Please check the highlighted fields and try again.',
} as const;

export const DEFAULT_CONTACT1_DATA: Contact1Props = {
  theme: 'light',
  layout: {
    padding: '64px',
  },
  eyebrow: 'Contact',
  heading: 'Get in touch',
  description:
    'Have a question or want to discuss a project? Send us a message and our team will respond promptly.',
  ...DEFAULT_FORM_COPY,
};

export const DEFAULT_CONTACT2_DATA: Contact2Props = {
  theme: 'dark',
  layout: {
    padding: '64px',
  },
  badge: 'Contact',
  heading: 'Contact our team',
  description:
    'Reach out directly using our office contact details or send a message through the form.',
  email: 'hello@example.com',
  phone: '+1 (555) 234-5678',
  address: '100 Main Street, Suite 400, New York, NY 10001',
  hours: 'Monday – Friday, 9:00 AM – 5:00 PM',
  ...DEFAULT_FORM_COPY,
};

function normalizeOptionalText(value?: string | null): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function resolveOptionalCopy(
  value: string | undefined,
  defaultValue: string | undefined
): string | undefined {
  return normalizeOptionalText(value === undefined ? defaultValue : value);
}

function resolveRequiredText(
  value: string | undefined,
  defaultValue: string | undefined,
  fallback: string
): string {
  return normalizeOptionalText(value) ?? normalizeOptionalText(defaultValue) ?? fallback;
}

function resolveContactTheme(
  theme: string | undefined,
  fallback: 'dark' | 'light'
): 'dark' | 'light' {
  return theme === 'light' || theme === 'dark' ? theme : fallback;
}

/**
 * Formats a trimmed valid email address as a mailto: href, or undefined if invalid/empty.
 */
export function formatContactEmailHref(email?: string | null): string | undefined {
  const trimmed = normalizeOptionalText(email);
  if (!trimmed || !validateEmail(trimmed)) {
    return undefined;
  }
  return `mailto:${trimmed}`;
}

/**
 * Extracts digits from a phone string (preserving an optional leading +) into a tel: href.
 */
export function formatContactPhoneHref(phone?: string | null): string | undefined {
  const trimmed = normalizeOptionalText(phone);
  if (!trimmed) {
    return undefined;
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 0) {
    return undefined;
  }
  const prefix = trimmed.startsWith('+') ? '+' : '';
  return `tel:${prefix}${digits}`;
}

export interface ResolvedContact1Props {
  theme: 'dark' | 'light';
  themeClasses: ContactThemeClasses;
  layout: LayoutFieldProps;
  eyebrow?: string;
  heading: string;
  description?: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

export interface ResolvedContact2Props {
  theme: 'dark' | 'light';
  themeClasses: ContactThemeClasses;
  layout: LayoutFieldProps;
  badge?: string;
  heading: string;
  description?: string;
  email?: string;
  emailHref?: string;
  phone?: string;
  phoneHref?: string;
  address?: string;
  hours?: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

type ContactBaseProps = Pick<
  Contact1Props,
  | 'theme'
  | 'layout'
  | 'heading'
  | 'description'
  | 'nameLabel'
  | 'emailLabel'
  | 'messageLabel'
  | 'submitLabel'
  | 'successMessage'
  | 'errorMessage'
>;

function resolveContactBaseProps(props: Partial<ContactBaseProps>, defaults: ContactBaseProps) {
  const theme = resolveContactTheme(props.theme, defaults.theme);
  const themeClasses = getContactThemeClasses(theme);
  const layout: LayoutFieldProps =
    typeof props.layout?.padding === 'string' && props.layout.padding.trim().length > 0
      ? { padding: props.layout.padding }
      : { ...defaults.layout };
  const heading = resolveRequiredText(props.heading, defaults.heading, defaults.heading);
  const description = resolveOptionalCopy(props.description, defaults.description);
  const nameLabel = resolveRequiredText(
    props.nameLabel,
    defaults.nameLabel,
    DEFAULT_FORM_COPY.nameLabel
  );
  const emailLabel = resolveRequiredText(
    props.emailLabel,
    defaults.emailLabel,
    DEFAULT_FORM_COPY.emailLabel
  );
  const messageLabel = resolveRequiredText(
    props.messageLabel,
    defaults.messageLabel,
    DEFAULT_FORM_COPY.messageLabel
  );
  const submitLabel = resolveRequiredText(
    props.submitLabel,
    defaults.submitLabel,
    DEFAULT_FORM_COPY.submitLabel
  );
  const successMessage = resolveRequiredText(
    props.successMessage,
    defaults.successMessage,
    DEFAULT_FORM_COPY.successMessage
  );
  const errorMessage = resolveRequiredText(
    props.errorMessage,
    defaults.errorMessage,
    DEFAULT_FORM_COPY.errorMessage
  );

  return {
    theme,
    themeClasses,
    layout,
    heading,
    description,
    nameLabel,
    emailLabel,
    messageLabel,
    submitLabel,
    successMessage,
    errorMessage,
  };
}

/**
 * Normalizes Contact1 props with defaults, trimmed labels/messages, and pure monochrome tokens.
 */
export function resolveContact1Props(props: Partial<Contact1Props>): ResolvedContact1Props {
  const base = resolveContactBaseProps(props, DEFAULT_CONTACT1_DATA);
  const eyebrow = resolveOptionalCopy(props.eyebrow, DEFAULT_CONTACT1_DATA.eyebrow);

  const resolved: ResolvedContact1Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    heading: base.heading,
    nameLabel: base.nameLabel,
    emailLabel: base.emailLabel,
    messageLabel: base.messageLabel,
    submitLabel: base.submitLabel,
    successMessage: base.successMessage,
    errorMessage: base.errorMessage,
  };

  if (eyebrow !== undefined) {
    resolved.eyebrow = eyebrow;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }

  return resolved;
}

/**
 * Normalizes Contact2 props with defaults, contact links, trimmed labels/messages, and theme tokens.
 */
export function resolveContact2Props(props: Partial<Contact2Props>): ResolvedContact2Props {
  const base = resolveContactBaseProps(props, DEFAULT_CONTACT2_DATA);
  const badge = resolveOptionalCopy(props.badge, DEFAULT_CONTACT2_DATA.badge);
  const email = resolveOptionalCopy(props.email, DEFAULT_CONTACT2_DATA.email);
  const phone = resolveOptionalCopy(props.phone, DEFAULT_CONTACT2_DATA.phone);
  const address = resolveOptionalCopy(props.address, DEFAULT_CONTACT2_DATA.address);
  const hours = resolveOptionalCopy(props.hours, DEFAULT_CONTACT2_DATA.hours);
  const emailHref = formatContactEmailHref(email);
  const phoneHref = formatContactPhoneHref(phone);

  const resolved: ResolvedContact2Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    heading: base.heading,
    nameLabel: base.nameLabel,
    emailLabel: base.emailLabel,
    messageLabel: base.messageLabel,
    submitLabel: base.submitLabel,
    successMessage: base.successMessage,
    errorMessage: base.errorMessage,
  };

  if (badge !== undefined) {
    resolved.badge = badge;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }
  if (email !== undefined) {
    resolved.email = email;
  }
  if (emailHref !== undefined) {
    resolved.emailHref = emailHref;
  }
  if (phone !== undefined) {
    resolved.phone = phone;
  }
  if (phoneHref !== undefined) {
    resolved.phoneHref = phoneHref;
  }
  if (address !== undefined) {
    resolved.address = address;
  }
  if (hours !== undefined) {
    resolved.hours = hours;
  }

  return resolved;
}

export type ContactSubmissionField = 'name' | 'email' | 'message';

export interface ContactSubmissionInput {
  name?: string | null;
  email?: string | null;
  message?: string | null;
}

export type ContactSubmissionErrors = Partial<Record<ContactSubmissionField, string>>;

export interface ContactSanitizedSubmission {
  name: string;
  email: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: ContactSubmissionErrors;
  sanitized: ContactSanitizedSubmission;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function normalizeSubmissionField(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Validates and trims contact form submission fields, reusing validateEmail from form-utils.
 */
export function validateContactSubmission(
  input?: ContactSubmissionInput | null
): ContactValidationResult {
  const safeInput = isRecord(input) ? input : {};
  const name = normalizeSubmissionField(safeInput.name);
  const email = normalizeSubmissionField(safeInput.email);
  const message = normalizeSubmissionField(safeInput.message);

  const errors: ContactSubmissionErrors = {};

  if (!name) {
    errors.name = 'Please enter your name.';
  }

  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!message) {
    errors.message = 'Please enter a message.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name,
      email,
      message,
    },
  };
}
