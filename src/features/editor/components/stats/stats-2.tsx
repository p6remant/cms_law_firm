import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { type Stats2Props } from '@/features/editor/types';
import { getStatsCardGridClass, resolveStats2Props } from '@/features/editor/utils/stats-utils';

/**
 * Editable Stats 2 section block rendering a pure metric boxed-card grid
 * with individual borders and pure black/white theme switching.
 */
export function Stats2(props: Stats2Props) {
  const resolved = resolveStats2Props(props);
  const hasItems = resolved.items.length > 0;
  const gridClass = getStatsCardGridClass(resolved.items.length);

  return (
    <section
      aria-label="Key statistics"
      className={`w-full border-y ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {hasItems && (
          <dl className={`grid ${gridClass} gap-4 sm:gap-6`}>
            {resolved.items.map((item, index) => (
              <div
                key={`${item.value}-${item.label}-${String(index)}`}
                className={`flex h-full flex-col rounded-lg border p-6 sm:p-8 ${resolved.themeClasses.card}`}
              >
                <dt className={`order-2 mt-3 text-sm font-medium ${resolved.themeClasses.label}`}>
                  {item.label}
                </dt>
                <dd
                  className={`order-1 text-3xl font-bold tabular-nums sm:text-4xl ${resolved.themeClasses.value}`}
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
            ))}
          </dl>
        )}
      </BlockLayout>
    </section>
  );
}
