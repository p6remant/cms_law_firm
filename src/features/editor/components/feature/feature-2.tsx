import { useId } from 'react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { CTAActionLink } from '@/features/editor/components/cta/cta-action-link';
import { FeatureIcon } from '@/features/editor/components/feature/feature-icon';
import { type Feature2Props } from '@/features/editor/types';
import { resolveFeature2Props } from '@/features/editor/utils/feature-utils';

const VISUAL_SKELETON_ROWS = [
  { id: 'row-1', titleWidth: 'w-2/5', bodyWidth: 'w-4/5' },
  { id: 'row-2', titleWidth: 'w-1/2', bodyWidth: 'w-3/4' },
  { id: 'row-3', titleWidth: 'w-1/3', bodyWidth: 'w-5/6' },
] as const;

/**
 * Editable Feature 2 section block rendering a responsive 2-column split showcase
 * with configurable media placement, feature highlights, optional CTA, and pure black/white theme switching.
 */
export function Feature2(props: Feature2Props) {
  const resolved = resolveFeature2Props(props);
  const headingId = useId();
  const isMediaLeft = resolved.mediaPosition === 'left';

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-b ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className={isMediaLeft ? 'lg:order-2 lg:col-span-6' : 'lg:order-1 lg:col-span-6'}>
            {resolved.badge && (
              <span
                className={`mb-4 inline-flex items-center border px-3 py-1 text-xs font-medium ${resolved.themeClasses.badge}`}
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

            {resolved.items.length > 0 && (
              <ul className="mt-8 space-y-5">
                {resolved.items.map((item, index) => (
                  <li key={`${item.title}-${String(index)}`} className="flex items-start gap-4">
                    <div
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border ${resolved.themeClasses.iconContainer}`}
                    >
                      <FeatureIcon
                        icon={item.icon}
                        className={`h-5 w-5 shrink-0 ${resolved.themeClasses.icon}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-base font-semibold ${resolved.themeClasses.heading}`}>
                        {item.title}
                      </h3>
                      <p
                        className={`mt-1 text-sm leading-relaxed ${resolved.themeClasses.mutedText}`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {resolved.ctaButton && resolved.ctaButtonClasses && (
              <div className="mt-8">
                <CTAActionLink button={resolved.ctaButton} classes={resolved.ctaButtonClasses} />
              </div>
            )}
          </div>

          <div className={isMediaLeft ? 'lg:order-1 lg:col-span-6' : 'lg:order-2 lg:col-span-6'}>
            {resolved.imageUrl ? (
              <div className={`overflow-hidden border ${resolved.themeClasses.mediaFrame}`}>
                <img
                  src={resolved.imageUrl}
                  alt={resolved.imageAlt ?? resolved.heading}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                aria-hidden="true"
                className={`border p-6 sm:p-8 ${resolved.themeClasses.mediaFrame}`}
              >
                <div
                  className={`flex items-center justify-between gap-4 border-b pb-4 ${resolved.themeClasses.border}`}
                >
                  <span
                    className={`text-xs font-medium uppercase ${resolved.themeClasses.eyebrow}`}
                  >
                    {resolved.badge ?? 'Overview'}
                  </span>
                  <span
                    className={`border px-2 py-0.5 text-xs font-medium tabular-nums ${resolved.themeClasses.badge}`}
                  >
                    {String(resolved.items.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {resolved.items.length > 0
                    ? resolved.items.slice(0, 3).map((item, index) => (
                        <div
                          key={`${item.title}-${String(index)}`}
                          className={`flex items-start gap-3.5 border p-4 ${resolved.themeClasses.mediaPlaceholderMuted}`}
                        >
                          <div
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center border ${resolved.themeClasses.iconContainer}`}
                          >
                            <FeatureIcon
                              icon={item.icon}
                              className={`h-4 w-4 shrink-0 ${resolved.themeClasses.icon}`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p
                                className={`truncate text-sm font-medium ${resolved.themeClasses.heading}`}
                              >
                                {item.title}
                              </p>
                              <span
                                className={`shrink-0 text-xs font-medium tabular-nums ${resolved.themeClasses.eyebrow}`}
                              >
                                {String(index + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <p
                              className={`mt-1 line-clamp-2 text-xs leading-relaxed ${resolved.themeClasses.mutedText}`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))
                    : VISUAL_SKELETON_ROWS.map((row) => (
                        <div
                          key={row.id}
                          className={`flex items-start gap-3.5 border p-4 ${resolved.themeClasses.mediaPlaceholderMuted}`}
                        >
                          <div
                            className={`h-8 w-8 shrink-0 border ${resolved.themeClasses.border}`}
                          />
                          <div className="min-w-0 flex-1 space-y-2.5 pt-0.5">
                            <div
                              className={`h-2.5 ${row.titleWidth} border ${resolved.themeClasses.border}`}
                            />
                            <div
                              className={`h-2 ${row.bodyWidth} border ${resolved.themeClasses.border}`}
                            />
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </BlockLayout>
    </section>
  );
}
