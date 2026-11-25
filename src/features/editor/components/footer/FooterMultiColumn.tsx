import { ArrowUpRight, Mail, MapPin, Phone, Scale, ShieldCheck } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { type FooterMultiColumnProps } from '@/features/editor/types';
import { resolveFooterMultiColumnProps } from '@/features/editor/utils/footer-utils';

export function FooterMultiColumn(props: FooterMultiColumnProps) {
  const resolved = resolveFooterMultiColumnProps(props);
  const isLight = resolved.theme === 'light';
  const hasColumns = resolved.columns.length > 0;
  const hasUpperComplianceRow =
    Boolean(resolved.copyrightNotice) || resolved.socialLinks.length > 0;
  const hasLowerComplianceBlock = Boolean(resolved.legalDisclaimer || resolved.regulatoryNotice);
  const hasComplianceTier = hasUpperComplianceRow || hasLowerComplianceBlock;

  return (
    <footer
      aria-label={`${resolved.firmName} directory footer`}
      className={`w-full border-t ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Tier 1: Firm Branding & Global Offices */}
        <div
          className={
            hasColumns || hasComplianceTier
              ? `border-b pb-12 ${resolved.themeClasses.border}`
              : undefined
          }
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="flex items-start gap-4 sm:gap-5 lg:col-span-7">
              {resolved.logoUrl ? (
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border p-1.5 ${
                    isLight ? 'border-stone-300 bg-white' : 'border-zinc-700/80 bg-zinc-900'
                  }`}
                >
                  <img
                    src={resolved.logoUrl}
                    alt={resolved.firmName}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  aria-hidden="true"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center border font-serif text-base font-semibold tracking-wider ${
                    isLight
                      ? 'border-stone-300 bg-stone-100 text-stone-900'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-100'
                  }`}
                >
                  {resolved.monogram}
                </div>
              )}

              <div>
                <h2
                  className={`text-2xl font-semibold sm:text-3xl ${resolved.themeClasses.heading}`}
                >
                  {resolved.firmName}
                </h2>
                {resolved.tagline && (
                  <p
                    className={`mt-1.5 text-[11px] font-medium tracking-[0.2em] uppercase ${resolved.themeClasses.mutedText}`}
                  >
                    {resolved.tagline}
                  </p>
                )}
              </div>
            </div>

            {resolved.description && (
              <p
                className={`text-sm leading-relaxed lg:col-span-5 ${resolved.themeClasses.mutedText}`}
              >
                {resolved.description}
              </p>
            )}
          </div>

          {resolved.offices.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resolved.offices.map((office, index) => (
                <div
                  key={`${office.city || 'office'}-${String(index)}`}
                  className={`border p-5 transition-colors ${
                    isLight
                      ? 'border-stone-200 bg-white/80 hover:border-stone-300 hover:bg-white'
                      : 'border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
                  }`}
                >
                  {office.city && (
                    <div className="flex items-center gap-2">
                      <MapPin
                        className={`h-3.5 w-3.5 shrink-0 ${resolved.themeClasses.mutedText}`}
                        aria-hidden="true"
                      />
                      <h3
                        className={`text-xs font-semibold tracking-[0.18em] uppercase ${resolved.themeClasses.text}`}
                      >
                        {office.city}
                      </h3>
                    </div>
                  )}

                  {office.address && (
                    <p
                      className={`${office.city ? 'mt-2.5 ' : ''}text-xs leading-relaxed ${resolved.themeClasses.mutedText}`}
                    >
                      {office.address}
                    </p>
                  )}

                  {(office.phone || office.email) && (
                    <div
                      className={`mt-4 flex flex-col gap-1.5 border-t pt-3 text-xs ${resolved.themeClasses.border}`}
                    >
                      {office.phone &&
                        (office.phoneHref ? (
                          <a
                            href={office.phoneHref}
                            className={`inline-flex items-center gap-2 tabular-nums ${resolved.themeClasses.link}`}
                          >
                            <Phone className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden="true" />
                            <span>{office.phone}</span>
                          </a>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-2 tabular-nums ${resolved.themeClasses.mutedText}`}
                          >
                            <Phone className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden="true" />
                            <span>{office.phone}</span>
                          </span>
                        ))}

                      {office.email &&
                        (office.emailHref ? (
                          <a
                            href={office.emailHref}
                            className={`inline-flex items-center gap-2 break-all ${resolved.themeClasses.link}`}
                          >
                            <Mail className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden="true" />
                            <span>{office.email}</span>
                          </a>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-2 break-all ${resolved.themeClasses.mutedText}`}
                          >
                            <Mail className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden="true" />
                            <span>{office.email}</span>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tier 2: Multi-Column Directory Navigation */}
        {hasColumns && (
          <nav
            aria-label="Footer directory"
            className={
              hasComplianceTier ? `border-b py-12 ${resolved.themeClasses.border}` : 'pt-12'
            }
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {resolved.columns.map((column, colIndex) => (
                <div key={`${column.title || 'column'}-${String(colIndex)}`}>
                  {column.title && (
                    <h3
                      className={`text-[11px] font-semibold tracking-[0.2em] uppercase ${resolved.themeClasses.text}`}
                    >
                      {column.title}
                    </h3>
                  )}
                  {column.links.length > 0 && (
                    <ul className={`${column.title ? 'mt-4 ' : ''}space-y-2.5`}>
                      {column.links.map((link, linkIndex) => (
                        <li key={`${link.label || link.href}-${String(linkIndex)}`}>
                          <a
                            href={link.href}
                            target={link.target}
                            rel={link.rel}
                            className={`group inline-flex items-center gap-1.5 text-sm ${resolved.themeClasses.link}`}
                          >
                            <span>{link.label || link.href}</span>
                            {link.isExternal && (
                              <>
                                <ArrowUpRight
                                  className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                                  aria-hidden="true"
                                />
                                <span className="sr-only"> (opens in new tab)</span>
                              </>
                            )}
                            {link.badge && (
                              <span
                                className={`ml-1 inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${resolved.themeClasses.badge}`}
                              >
                                {link.badge}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </nav>
        )}

        {/* Tier 3: Social & Regulatory Compliance */}
        {hasComplianceTier && (
          <div className="pt-8">
            {hasUpperComplianceRow && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {resolved.copyrightNotice && (
                  <div
                    className={`flex items-center gap-2.5 text-xs ${resolved.themeClasses.mutedText}`}
                  >
                    <Scale className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden="true" />
                    <span>{resolved.copyrightNotice}</span>
                  </div>
                )}

                {resolved.socialLinks.length > 0 && (
                  <div
                    className={`flex flex-wrap items-center gap-2${
                      resolved.copyrightNotice ? '' : ' sm:ml-auto'
                    }`}
                    aria-label="Social channels"
                  >
                    {resolved.socialLinks.map((item, index) => {
                      const SocialIcon = item.icon;
                      return (
                        <a
                          key={`${item.platform}-${item.href}-${String(index)}`}
                          href={item.href}
                          aria-label={item.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex h-8 w-8 items-center justify-center border transition-colors ${
                            isLight
                              ? 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-950'
                              : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-white'
                          }`}
                        >
                          <SocialIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {hasLowerComplianceBlock && (
              <div
                className={`space-y-2.5 text-[11px] leading-relaxed ${
                  hasUpperComplianceRow ? 'mt-6 border-t pt-6 ' : ''
                }${resolved.themeClasses.disclaimer}`}
              >
                {resolved.legalDisclaimer && (
                  <p className="flex items-start gap-2">
                    <ShieldCheck
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80"
                      aria-hidden="true"
                    />
                    <span>{resolved.legalDisclaimer}</span>
                  </p>
                )}
                {resolved.regulatoryNotice && <p>{resolved.regulatoryNotice}</p>}
              </div>
            )}
          </div>
        )}
      </BlockLayout>
    </footer>
  );
}
