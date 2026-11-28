import { useId } from 'react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { FAQAccordionList } from '@/features/editor/components/faq/faq-accordion';
import { type FAQ1Props } from '@/features/editor/types';
import { resolveFAQ1Props } from '@/features/editor/utils/faq-utils';

/**
 * Editable FAQ 1 section block featuring a centered single-column editorial
 * accordion with pure black/white theme switching and full ARIA semantics.
 */
export function FAQ1(props: FAQ1Props) {
  const resolved = resolveFAQ1Props(props);
  const headingId = useId();
  const baseId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-b ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
        <div className="text-center">
          {resolved.eyebrow && (
            <p className={`mb-3 text-xs font-medium uppercase ${resolved.themeClasses.mutedText}`}>
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

        {resolved.items.length > 0 && (
          <FAQAccordionList
            key={`${String(resolved.defaultOpenIndex ?? 'none')}-${String(resolved.allowMultipleOpen)}`}
            items={resolved.items}
            defaultOpenIndex={resolved.defaultOpenIndex}
            allowMultipleOpen={resolved.allowMultipleOpen}
            themeClasses={resolved.themeClasses}
            baseId={baseId}
            className="mt-10"
          />
        )}
      </BlockLayout>
    </section>
  );
}
