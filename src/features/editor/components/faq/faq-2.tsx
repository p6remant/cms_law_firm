import { useId } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { FAQAccordionList } from '@/features/editor/components/faq/faq-accordion';
import { type FAQ2Props } from '@/features/editor/types';
import { resolveFAQ2Props } from '@/features/editor/utils/faq-utils';

/**
 * Editable FAQ 2 section block featuring a split-column editorial layout
 * with sticky intro, integrated contact CTA card, and pure black/white theme switching.
 */
export function FAQ2(props: FAQ2Props) {
  const resolved = resolveFAQ2Props(props);
  const headingId = useId();
  const baseId = useId();
  const hasItems = resolved.items.length > 0;

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-y ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div
          className={
            hasItems
              ? 'grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16'
              : 'mx-auto max-w-2xl'
          }
        >
          <div className={hasItems ? 'lg:col-span-5 lg:sticky lg:top-8' : undefined}>
            {resolved.badge && (
              <span
                className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${resolved.themeClasses.badge}`}
              >
                {resolved.badge}
              </span>
            )}
            <h2
              id={headingId}
              className={`text-2xl font-semibold sm:text-3xl lg:text-4xl ${resolved.themeClasses.heading}`}
            >
              {resolved.heading}
            </h2>
            {resolved.description && (
              <p
                className={`mt-4 max-w-2xl text-base leading-relaxed ${resolved.themeClasses.mutedText}`}
              >
                {resolved.description}
              </p>
            )}

            {resolved.contactCta && (
              <div className={`mt-8 rounded-lg border p-6 ${resolved.themeClasses.contactCard}`}>
                {resolved.contactCta.title && (
                  <h3 className={`text-base font-semibold ${resolved.themeClasses.heading}`}>
                    {resolved.contactCta.title}
                  </h3>
                )}
                {resolved.contactCta.description && (
                  <p
                    className={`${
                      resolved.contactCta.title ? 'mt-2 ' : ''
                    }text-sm leading-relaxed ${resolved.themeClasses.mutedText}`}
                  >
                    {resolved.contactCta.description}
                  </p>
                )}
                {resolved.contactCta.buttonText && (
                  <a
                    href={resolved.contactCta.buttonHref}
                    target={resolved.contactCta.buttonTarget}
                    rel={resolved.contactCta.rel}
                    className={`${
                      resolved.contactCta.title || resolved.contactCta.description ? 'mt-5 ' : ''
                    }inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium tracking-normal ${resolved.contactCta.buttonClasses}`}
                  >
                    <span>{resolved.contactCta.buttonText}</span>
                    {resolved.contactCta.isExternal && (
                      <>
                        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="sr-only"> (opens in new tab)</span>
                      </>
                    )}
                  </a>
                )}
              </div>
            )}
          </div>

          {hasItems && (
            <div className="lg:col-span-7">
              <FAQAccordionList
                key={`${String(resolved.defaultOpenIndex ?? 'none')}-${String(resolved.allowMultipleOpen)}`}
                items={resolved.items}
                defaultOpenIndex={resolved.defaultOpenIndex}
                allowMultipleOpen={resolved.allowMultipleOpen}
                themeClasses={resolved.themeClasses}
                baseId={baseId}
              />
            </div>
          )}
        </div>
      </BlockLayout>
    </section>
  );
}
