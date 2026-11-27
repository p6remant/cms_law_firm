import { useId, useState, type SyntheticEvent } from 'react';
import {
  validateContactSubmission,
  type ContactSanitizedSubmission,
  type ContactSubmissionErrors,
  type ContactSubmissionField,
  type ContactThemeClasses,
} from '@/features/editor/utils/contact-utils';
import { simulateFormSubmit } from '@/features/editor/utils/form-utils';

export interface ContactFormProps {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  themeClasses: ContactThemeClasses;
  className?: string;
}

/**
 * Shared accessible contact form with controlled fields, validation via
 * validateContactSubmission, and live submission status feedback.
 */
export function ContactForm({
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
  successMessage,
  errorMessage,
  themeClasses,
  className,
}: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ContactSubmissionErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const nameInputId = useId();
  const nameErrorId = useId();
  const emailInputId = useId();
  const emailErrorId = useId();
  const messageInputId = useId();
  const messageErrorId = useId();
  const statusId = useId();

  const handleFieldChange = (
    field: ContactSubmissionField,
    value: string,
    setter: (nextValue: string) => void
  ) => {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (status) {
      setStatus(null);
    }
  };

  const submitContact = async (sanitized: ContactSanitizedSubmission) => {
    try {
      const response = await simulateFormSubmit(undefined, { ...sanitized });
      if (response.success) {
        setStatus({ type: 'success', message: successMessage });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus({ type: 'error', message: errorMessage });
      }
    } catch {
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    const validation = validateContactSubmission({ name, email, message });
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setStatus({ type: 'error', message: errorMessage });
      return;
    }

    setFieldErrors({});
    setStatus(null);
    setIsSubmitting(true);
    void submitContact(validation.sanitized);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={className ? `space-y-5 ${className}` : 'space-y-5'}
    >
      <div>
        <label
          htmlFor={nameInputId}
          className={`mb-2 block text-sm font-medium ${themeClasses.label}`}
        >
          {nameLabel}
        </label>
        <input
          id={nameInputId}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => {
            handleFieldChange('name', e.target.value, setName);
          }}
          placeholder="Your name"
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? nameErrorId : undefined}
          className={`w-full rounded-md border px-3.5 py-2.5 text-sm transition-colors ${themeClasses.input}`}
        />
        {fieldErrors.name && (
          <p id={nameErrorId} className={`mt-1.5 text-xs ${themeClasses.errorText}`}>
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={emailInputId}
          className={`mb-2 block text-sm font-medium ${themeClasses.label}`}
        >
          {emailLabel}
        </label>
        <input
          id={emailInputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            handleFieldChange('email', e.target.value, setEmail);
          }}
          placeholder="you@example.com"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? emailErrorId : undefined}
          className={`w-full rounded-md border px-3.5 py-2.5 text-sm transition-colors ${themeClasses.input}`}
        />
        {fieldErrors.email && (
          <p id={emailErrorId} className={`mt-1.5 text-xs ${themeClasses.errorText}`}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={messageInputId}
          className={`mb-2 block text-sm font-medium ${themeClasses.label}`}
        >
          {messageLabel}
        </label>
        <textarea
          id={messageInputId}
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => {
            handleFieldChange('message', e.target.value, setMessage);
          }}
          placeholder="Write your message..."
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? messageErrorId : undefined}
          className={`w-full rounded-md border px-3.5 py-2.5 text-sm transition-colors ${themeClasses.input}`}
        />
        {fieldErrors.message && (
          <p id={messageErrorId} className={`mt-1.5 text-xs ${themeClasses.errorText}`}>
            {fieldErrors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={`inline-flex w-full cursor-pointer items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${themeClasses.submitButton}`}
      >
        {isSubmitting ? 'Sending...' : submitLabel}
      </button>

      {status && (
        <div
          id={statusId}
          role={status.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`rounded-md border px-4 py-3 text-sm ${
            status.type === 'success' ? themeClasses.statusSuccess : themeClasses.statusError
          }`}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
