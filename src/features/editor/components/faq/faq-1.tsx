import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { type FAQ1Props, type FAQItem } from '@/features/editor/types';
import { type FAQThemeClasses, resolveFAQ1Props } from '@/features/editor/utils/faq-utils';

type FAQ1AccordionListProps = {
  items: FAQItem[];
  defaultOpenIndex?: number;
  allowMultipleOpen: boolean;
  themeClasses: FAQThemeClasses;
  baseId: string;
};

/**
 * Interactive WAI-ARIA compliant accordion list for FAQ1.
 * Keyed by defaultOpenIndex and allowMultipleOpen in the parent so inspector
 * changes reset expansion state cleanly without effects.
 */
function FAQ1AccordionList({
  items,
  defaultOpenIndex,
  allowMultipleOpen,
  themeClasses,
  baseId,
}: FAQ1AccordionListProps) {
  const [openIndices, setOpenIndices] = useState<number[]>(() =>
    defaultOpenIndex !== undefined ? [defaultOpenIndex] : []
  );

  const openSet = new Set(openIndices.filter((index) => index >= 0 && index < items.length));

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const validPrev = prev.filter((i) => i >= 0 && i < items.length);
      if (allowMultipleOpen) {
        return validPrev.includes(index)
          ? validPrev.filter((i) => i !== index)
          : [...validPrev, index];
      }
      return validPrev.includes(index) ? [] : [index];
    });
  };

  return (
    <div className={`mt-10 border-t ${themeClasses.itemBorder}`}>
      {items.map((item, index) => {
        const triggerId = `${baseId}-faq-trigger-${String(index)}`;
        const panelId = `${baseId}-faq-panel-${String(index)}`;
        const isOpen = openSet.has(index);

        return (
          <div
            key={`${item.question}-${String(index)}`}
            className={`border-b ${themeClasses.itemBorder}`}
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  toggleItem(index);
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-base font-medium tracking-normal transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${themeClasses.text}`}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${themeClasses.chevron} ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={`pb-5 text-sm leading-relaxed sm:text-base ${themeClasses.mutedText}`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
      className={`w-full border-y ${resolved.themeClasses.wrapper}`}
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
          <FAQ1AccordionList
            key={`${String(resolved.defaultOpenIndex ?? 'none')}-${String(resolved.allowMultipleOpen)}`}
            items={resolved.items}
            defaultOpenIndex={resolved.defaultOpenIndex}
            allowMultipleOpen={resolved.allowMultipleOpen}
            themeClasses={resolved.themeClasses}
            baseId={baseId}
          />
        )}
      </BlockLayout>
    </section>
  );
}
