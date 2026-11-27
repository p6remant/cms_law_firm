import { useId } from 'react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { ContactForm } from '@/features/editor/components/contact/contact-form';
import { type Contact1Props } from '@/features/editor/types';
import { resolveContact1Props } from '@/features/editor/utils/contact-utils';

/**
 * Editable Contact 1 section block rendering a simple centered contact form
 * with pure black/white theme switching and monochrome styling.
 */
export function Contact1(props: Contact1Props) {
  const resolved = resolveContact1Props(props);
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-y ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-2xl px-6 sm:px-8">
        <div className="text-center">
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
            <p className={`mt-3 text-base leading-relaxed ${resolved.themeClasses.mutedText}`}>
              {resolved.description}
            </p>
          )}
        </div>

        <div className={`mt-10 rounded-lg border p-6 sm:p-8 ${resolved.themeClasses.surface}`}>
          <ContactForm
            nameLabel={resolved.nameLabel}
            emailLabel={resolved.emailLabel}
            messageLabel={resolved.messageLabel}
            submitLabel={resolved.submitLabel}
            successMessage={resolved.successMessage}
            errorMessage={resolved.errorMessage}
            themeClasses={resolved.themeClasses}
          />
        </div>
      </BlockLayout>
    </section>
  );
}
