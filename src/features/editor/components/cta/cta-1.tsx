import { useId, useState, type SyntheticEvent } from 'react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { CTAActionLink } from '@/features/editor/components/cta/cta-action-link';
import { type CTA1Props } from '@/features/editor/types';
import { resolveCTA1Props } from '@/features/editor/utils/cta-utils';
import { validateEmail } from '@/features/editor/utils/form-utils';

/**
 * Editable CTA 1 section block supporting controlled newsletter subscription
 * and dual action link modes with pure black/white theme switching.
 */
export function CTA1(props: CTA1Props) {
  const resolved = resolveCTA1Props(props);
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const headingId = useId();
  const emailInputId = useId();
  const feedbackId = useId();
  const disclaimerId = useId();

  const handleNewsletterSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    setFeedback({ type: 'success', message: 'Thank you for subscribing.' });
    setEmail('');
  };

  const describedByIds: string[] = [];
  if (feedback) {
    describedByIds.push(feedbackId);
  }
  if (resolved.disclaimer) {
    describedByIds.push(disclaimerId);
  }
  const describedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;
  const hasButtons = Boolean(resolved.primaryButton) || Boolean(resolved.secondaryButton);

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-b ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-7">
            {resolved.eyebrow && (
              <p className={`mb-3 text-xs font-medium uppercase ${resolved.themeClasses.eyebrow}`}>
                {resolved.eyebrow}
              </p>
            )}
            <h2
              id={headingId}
              className={`text-2xl font-semibold sm:text-3xl lg:text-4xl ${resolved.themeClasses.heading}`}
            >
              {resolved.heading}
            </h2>
            {resolved.description && (
              <p
                className={`mt-3 max-w-2xl text-base leading-relaxed ${resolved.themeClasses.mutedText}`}
              >
                {resolved.description}
              </p>
            )}
          </div>

          <div className="lg:col-span-5">
            {resolved.actionType === 'newsletter' ? (
              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                className="w-full max-w-lg lg:ml-auto"
              >
                <label htmlFor={emailInputId} className="sr-only">
                  {resolved.newsletterPlaceholder}
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <input
                    id={emailInputId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (feedback) {
                        setFeedback(null);
                      }
                    }}
                    placeholder={resolved.newsletterPlaceholder}
                    aria-label={resolved.newsletterPlaceholder}
                    aria-invalid={feedback?.type === 'error' ? true : undefined}
                    aria-describedby={describedBy}
                    className={`w-full flex-1 border px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${resolved.themeClasses.input}`}
                  />
                  <button
                    type="submit"
                    className={`inline-flex shrink-0 cursor-pointer items-center justify-center px-5 py-2.5 text-sm font-medium whitespace-nowrap ${resolved.newsletterButtonClasses}`}
                  >
                    {resolved.newsletterButtonText}
                  </button>
                </div>
                {feedback && (
                  <p
                    id={feedbackId}
                    role={feedback.type === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                    className={`mt-2.5 text-xs ${feedback.type === 'success' ? 'font-medium' : ''} ${resolved.themeClasses.mutedText}`}
                  >
                    {feedback.message}
                  </p>
                )}
                {resolved.disclaimer && (
                  <p
                    id={disclaimerId}
                    className={`mt-3 text-xs leading-relaxed ${resolved.themeClasses.disclaimer}`}
                  >
                    {resolved.disclaimer}
                  </p>
                )}
              </form>
            ) : (
              hasButtons && (
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  {resolved.primaryButton && resolved.primaryButtonClasses && (
                    <CTAActionLink
                      button={resolved.primaryButton}
                      classes={resolved.primaryButtonClasses}
                    />
                  )}
                  {resolved.secondaryButton && resolved.secondaryButtonClasses && (
                    <CTAActionLink
                      button={resolved.secondaryButton}
                      classes={resolved.secondaryButtonClasses}
                    />
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </BlockLayout>
    </section>
  );
}
