import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { type FAQItem } from '@/features/editor/types';
import { type FAQThemeClasses } from '@/features/editor/utils/faq-utils';

type FAQAccordionListProps = {
  items: FAQItem[];
  defaultOpenIndex?: number;
  allowMultipleOpen: boolean;
  themeClasses: FAQThemeClasses;
  baseId: string;
  className?: string;
};

/**
 * Interactive WAI-ARIA compliant accordion list shared across FAQ blocks.
 * Keyed by defaultOpenIndex and allowMultipleOpen in the parent so inspector
 * changes reset expansion state cleanly without effects.
 */
export function FAQAccordionList({
  items,
  defaultOpenIndex,
  allowMultipleOpen,
  themeClasses,
  baseId,
  className,
}: FAQAccordionListProps) {
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
    <div
      className={
        className
          ? `${className} border-t ${themeClasses.itemBorder}`
          : `border-t ${themeClasses.itemBorder}`
      }
    >
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
