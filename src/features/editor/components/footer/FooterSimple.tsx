import { Landmark } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { type FooterSimpleProps } from '@/features/editor/types';
import { resolveFooterSimpleProps } from '@/features/editor/utils/footer-utils';

export function FooterSimple(props: FooterSimpleProps) {
  const resolved = resolveFooterSimpleProps(props);
  const hasContactColumn =
    Boolean(resolved.contactTitle) ||
    resolved.addressLines.length > 0 ||
    Boolean(resolved.phone) ||
    Boolean(resolved.email);
  const hasAnyColumnTitle = resolved.linkColumns.some((col) => Boolean(col.title));
  const hasBottomBar = Boolean(resolved.copyrightNotice) || resolved.bottomLinks.length > 0;

  return (
    <footer
      aria-label={`${resolved.brandName} footer`}
      className={`w-full border-t ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand / Identity */}
          <div>
            <div className="flex items-center gap-3">
              {resolved.logoUrl ? (
                <img
                  src={resolved.logoUrl}
                  alt={resolved.brandName}
                  className="h-9 w-9 shrink-0 object-contain"
                />
              ) : (
                <Landmark
                  className={`h-8 w-8 shrink-0 stroke-[1.5] ${resolved.themeClasses.text}`}
                  aria-hidden="true"
                />
              )}
              <div>
                <h2 className={`text-xl leading-tight font-bold ${resolved.themeClasses.heading}`}>
                  {resolved.brandName}
                </h2>
                {resolved.brandSubtitle && (
                  <p
                    className={`mt-0.5 text-xs font-medium uppercase ${resolved.themeClasses.mutedText}`}
                  >
                    {resolved.brandSubtitle}
                  </p>
                )}
              </div>
            </div>

            {resolved.description && (
              <p className={`mt-5 text-sm leading-relaxed ${resolved.themeClasses.mutedText}`}>
                {resolved.description}
              </p>
            )}

            {resolved.socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-4" aria-label="Social media">
                {resolved.socialLinks.map((item, index) => {
                  const SocialIcon = item.icon;
                  return (
                    <a
                      key={`${item.platform}-${item.href}-${String(index)}`}
                      href={item.href}
                      aria-label={item.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={resolved.themeClasses.link}
                    >
                      <SocialIcon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Contact Info */}
          {hasContactColumn && (
            <div>
              {resolved.contactTitle && (
                <h3 className={`mb-4 text-base font-semibold ${resolved.themeClasses.heading}`}>
                  {resolved.contactTitle}
                </h3>
              )}
              <div className="space-y-3 text-sm">
                {resolved.addressLines.length > 0 && (
                  <address
                    className={`not-italic leading-relaxed ${resolved.themeClasses.mutedText}`}
                  >
                    {resolved.addressLines.map((line, idx) => (
                      <span key={`${line}-${String(idx)}`} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                )}

                {resolved.phone &&
                  (resolved.phoneHref ? (
                    <p>
                      <a
                        href={resolved.phoneHref}
                        className={`inline-block tabular-nums ${resolved.themeClasses.link}`}
                      >
                        {resolved.phone}
                      </a>
                    </p>
                  ) : (
                    <p className={`tabular-nums ${resolved.themeClasses.mutedText}`}>
                      {resolved.phone}
                    </p>
                  ))}

                {resolved.email &&
                  (resolved.emailHref ? (
                    <p>
                      <a
                        href={resolved.emailHref}
                        className={`inline-block break-all ${resolved.themeClasses.link}`}
                      >
                        {resolved.email}
                      </a>
                    </p>
                  ) : (
                    <p className={`break-all ${resolved.themeClasses.mutedText}`}>
                      {resolved.email}
                    </p>
                  ))}
              </div>
            </div>
          )}

          {/* Columns 3 & 4: Link Columns */}
          {resolved.linkColumns.map((column, colIndex) => (
            <div key={`${column.title || 'column'}-${String(colIndex)}`}>
              {column.title ? (
                <h3 className={`mb-4 text-base font-semibold ${resolved.themeClasses.heading}`}>
                  {column.title}
                </h3>
              ) : (
                hasAnyColumnTitle && (
                  <div
                    className="mb-4 hidden text-base font-semibold select-none lg:block"
                    aria-hidden="true"
                  >
                    &nbsp;
                  </div>
                )
              )}

              {column.links.length > 0 && (
                <ul className="space-y-2.5 text-sm">
                  {column.links.map((link, linkIndex) => (
                    <li key={`${link.label}-${link.href}-${String(linkIndex)}`}>
                      <a
                        href={link.href}
                        target={link.target}
                        rel={link.rel}
                        className={`inline-block ${resolved.themeClasses.link}`}
                      >
                        <span>{link.label || link.href}</span>
                        {link.isExternal && <span className="sr-only"> (opens in new tab)</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        {hasBottomBar && (
          <div
            className={`mt-12 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between ${resolved.themeClasses.border}`}
          >
            {resolved.copyrightNotice && (
              <p className={resolved.themeClasses.mutedText}>{resolved.copyrightNotice}</p>
            )}

            {resolved.bottomLinks.length > 0 && (
              <nav
                aria-label="Footer navigation"
                className={resolved.copyrightNotice ? '' : 'sm:ml-auto'}
              >
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {resolved.bottomLinks.map((link, index) => (
                    <li key={`${link.label}-${link.href}-${String(index)}`}>
                      <a
                        href={link.href}
                        target={link.target}
                        rel={link.rel}
                        className={resolved.themeClasses.link}
                      >
                        {link.label || link.href}
                        {link.isExternal && <span className="sr-only"> (opens in new tab)</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        )}
      </BlockLayout>
    </footer>
  );
}
