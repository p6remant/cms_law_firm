import { useId } from 'react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { FeatureIcon } from '@/features/editor/components/feature/feature-icon';
import { type Feature1Props } from '@/features/editor/types';
import { resolveFeature1Props } from '@/features/editor/utils/feature-utils';

/**
 * Editable Feature 1 section block rendering a responsive 2/3/4-column
 * capability grid with card or flat border modes and pure black/white theme switching.
 */
export function Feature1(props: Feature1Props) {
  const resolved = resolveFeature1Props(props);
  const headingId = useId();
  const isCardMode = resolved.cardMode === 'card';

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-b ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
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
              className={`mt-4 max-w-2xl text-base leading-relaxed ${resolved.themeClasses.mutedText}`}
            >
              {resolved.description}
            </p>
          )}
        </div>

        {resolved.items.length > 0 && (
          <ul
            className={`mt-12 grid ${resolved.gridClass} ${isCardMode ? 'gap-6' : 'gap-x-8 gap-y-10'}`}
          >
            {resolved.items.map((item, index) => (
              <li
                key={`${item.title}-${String(index)}`}
                className={
                  isCardMode
                    ? `flex h-full flex-col border p-6 sm:p-8 ${resolved.themeClasses.card}`
                    : `flex h-full flex-col border-t pt-6 ${resolved.themeClasses.flatItem}`
                }
              >
                <div
                  className={`mb-5 inline-flex h-10 w-10 shrink-0 items-center justify-center border ${resolved.themeClasses.iconContainer}`}
                >
                  <FeatureIcon
                    icon={item.icon}
                    className={`h-5 w-5 shrink-0 ${resolved.themeClasses.icon}`}
                  />
                </div>
                <h3
                  className={`text-base font-semibold sm:text-lg ${resolved.themeClasses.heading}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed sm:text-base ${resolved.themeClasses.mutedText}`}
                >
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </BlockLayout>
    </section>
  );
}
