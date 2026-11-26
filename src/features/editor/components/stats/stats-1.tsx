import { useId } from 'react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { type Stats1Props } from '@/features/editor/types';
import { getStatsStripGridClass, resolveStats1Props } from '@/features/editor/utils/stats-utils';

function getStripItemDividerClass(index: number, itemCount: number): string {
  if (itemCount <= 1 || index === 0) {
    return '';
  }
  if (itemCount === 2) {
    return 'border-t sm:border-t-0 sm:border-l';
  }
  if (itemCount === 3) {
    return 'border-t md:border-t-0 md:border-l';
  }

  const classes = [
    'border-t',
    index >= 2 ? 'sm:border-t' : 'sm:border-t-0',
    ...(index % 2 === 1 ? ['sm:border-l'] : []),
    index >= 4 ? 'lg:border-t' : 'lg:border-t-0',
    ...(index % 4 !== 0 ? ['lg:border-l'] : []),
  ];

  return classes.join(' ');
}

/**
 * Editable Stats 1 section block featuring an editorial metric strip/grid
 * with hairline dividers and pure black/white theme switching.
 */
export function Stats1(props: Stats1Props) {
  const resolved = resolveStats1Props(props);
  const headingId = useId();
  const hasHeader = Boolean(resolved.eyebrow || resolved.heading || resolved.description);
  const hasItems = resolved.items.length > 0;
  const gridClass = getStatsStripGridClass(resolved.items.length);

  return (
    <section
      aria-labelledby={resolved.heading ? headingId : undefined}
      aria-label={resolved.heading ? undefined : 'Key statistics'}
      className={`w-full border-y ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {hasHeader && (
          <div className="max-w-2xl">
            {resolved.eyebrow && (
              <p className={`mb-3 text-xs font-medium uppercase ${resolved.themeClasses.eyebrow}`}>
                {resolved.eyebrow}
              </p>
            )}
            {resolved.heading && (
              <h2
                id={headingId}
                className={`text-2xl font-semibold sm:text-3xl lg:text-4xl ${resolved.themeClasses.heading}`}
              >
                {resolved.heading}
              </h2>
            )}
            {resolved.description && (
              <p
                className={`${resolved.heading ? 'mt-3 ' : ''}text-base leading-relaxed ${resolved.themeClasses.mutedText}`}
              >
                {resolved.description}
              </p>
            )}
          </div>
        )}

        {hasItems && (
          <dl
            className={`${hasHeader ? 'mt-10 ' : ''}grid ${gridClass} rounded-lg border ${resolved.themeClasses.divider}`}
          >
            {resolved.items.map((item, index) => {
              const dividerClasses = getStripItemDividerClass(index, resolved.items.length);
              return (
                <div
                  key={`${item.value}-${item.label}-${String(index)}`}
                  className={`flex flex-col p-6 sm:p-8${dividerClasses ? ` ${dividerClasses} ${resolved.themeClasses.divider}` : ''}`}
                >
                  <dt className={`order-2 mt-2 text-sm font-medium ${resolved.themeClasses.label}`}>
                    {item.label}
                  </dt>
                  <dd
                    className={`order-1 text-3xl font-semibold tabular-nums sm:text-4xl lg:text-5xl ${resolved.themeClasses.value}`}
                  >
                    {item.value}
                  </dd>
                  {item.description && (
                    <dd
                      className={`order-3 mt-2 text-sm leading-relaxed ${resolved.themeClasses.mutedText}`}
                    >
                      {item.description}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        )}
      </BlockLayout>
    </section>
  );
}
