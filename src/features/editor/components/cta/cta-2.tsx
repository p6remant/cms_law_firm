import { useId } from 'react';
import { Check } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { CTAActionLink } from '@/features/editor/components/cta/cta-action-link';
import { type CTA2Props } from '@/features/editor/types';
import { resolveCTA2Props } from '@/features/editor/utils/cta-utils';

/**
 * Editable CTA 2 section block with optional badge, dual action links,
 * and feature highlights supporting pure black/white theme switching.
 */
export function CTA2(props: CTA2Props) {
  const resolved = resolveCTA2Props(props);
  const headingId = useId();
  const hasFeatures = resolved.features.length > 0;
  const hasButtons = Boolean(resolved.primaryButton) || Boolean(resolved.secondaryButton);

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-b ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div
          className={
            hasFeatures
              ? 'grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12'
              : 'mx-auto max-w-3xl'
          }
        >
          <div className={hasFeatures ? 'lg:col-span-7' : undefined}>
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
            {hasButtons && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
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
            )}
          </div>

          {hasFeatures && (
            <div className="lg:col-span-5">
              <div className={`border p-6 sm:p-8 ${resolved.themeClasses.surface}`}>
                <ul className="space-y-4">
                  {resolved.features.map((feature, idx) => (
                    <li key={`${feature}-${String(idx)}`} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${resolved.themeClasses.featureIcon}`}
                        aria-hidden="true"
                      />
                      <span className={`text-sm leading-relaxed ${resolved.themeClasses.text}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </BlockLayout>
    </section>
  );
}
