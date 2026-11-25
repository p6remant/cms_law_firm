import { useId, useState, type SyntheticEvent } from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { type Footer2Props } from '@/features/editor/types';
import { resolveFooter2Props, type ResolvedFooterLink } from '@/features/editor/utils/footer-utils';

function getLinkColumnsGridClass(count: number): string {
  if (count >= 4) {
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
  }
  if (count === 3) {
    return 'grid-cols-1 sm:grid-cols-3';
  }
  if (count === 2) {
    return 'grid-cols-1 sm:grid-cols-2';
  }
  return 'grid-cols-1';
}

function FooterLinkAnchor({
  link,
  linkClassName,
  badgeClassName,
}: {
  link: ResolvedFooterLink;
  linkClassName: string;
  badgeClassName?: string;
}) {
  return (
    <a
      href={link.href}
      target={link.target}
      rel={link.rel}
      className={`inline-flex items-center gap-1 ${linkClassName}`}
    >
      <span>{link.label || link.href}</span>
      {badgeClassName && link.badge && (
        <span
          className={`ml-1.5 inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-normal ${badgeClassName}`}
        >
          {link.badge}
        </span>
      )}
      {link.isExternal && (
        <>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
          <span className="sr-only"> (opens in new tab)</span>
        </>
      )}
    </a>
  );
}

/**
 * Editable Footer 2 block featuring a top newsletter strip, brand/contact column,
 * responsive link columns, and a bottom bar with social links and Back-to-Top action.
 */
export function Footer2(props: Footer2Props) {
  const resolved = resolveFooter2Props(props);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const newsletterInputId = useId();

  const isDark = resolved.theme === 'dark';
  const hasNewsletterCopy =
    Boolean(resolved.newsletterHeading) || Boolean(resolved.newsletterDescription);
  const hasContactInfo =
    Boolean(resolved.contactTitle) ||
    resolved.addressLines.length > 0 ||
    Boolean(resolved.phone) ||
    Boolean(resolved.email);
  const hasAnyColumnTitle = resolved.linkColumns.some((col) => Boolean(col.title));
  const hasBottomLeft = Boolean(resolved.copyrightNotice) || resolved.bottomLinks.length > 0;
  const hasBottomRight = resolved.socialLinks.length > 0 || resolved.showBackToTop;
  const hasBottomBar = hasBottomLeft || hasBottomRight;

  const handleNewsletterSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      return;
    }
    setIsSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer
      aria-label={`${resolved.logoText} footer`}
      className={`w-full border-t ${resolved.themeClasses.wrapper}`}
    >
      <BlockLayout layout={resolved.layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Top Newsletter Subscription Strip */}
        {resolved.showNewsletter && (
          <div
            className={`mb-12 flex flex-col gap-6 border-b pb-12 lg:flex-row lg:items-center lg:justify-between ${resolved.themeClasses.border}`}
          >
            {hasNewsletterCopy && (
              <div>
                {resolved.newsletterHeading && (
                  <h2
                    className={`text-lg font-semibold tracking-normal ${resolved.themeClasses.heading}`}
                  >
                    {resolved.newsletterHeading}
                  </h2>
                )}
                {resolved.newsletterDescription && (
                  <p
                    className={`mt-1.5 max-w-xl text-sm leading-relaxed tracking-normal ${resolved.themeClasses.mutedText}`}
                  >
                    {resolved.newsletterDescription}
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md lg:shrink-0">
              <label htmlFor={newsletterInputId} className="sr-only">
                {resolved.newsletterPlaceholder}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  id={newsletterInputId}
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setIsSubscribed(false);
                  }}
                  placeholder={resolved.newsletterPlaceholder}
                  aria-label={resolved.newsletterPlaceholder}
                  className={`w-full flex-1 rounded-md border px-3.5 py-2.5 text-sm tracking-normal transition-colors focus:outline-none ${resolved.themeClasses.border} ${
                    isDark
                      ? 'bg-black text-white placeholder:text-neutral-500 focus:border-white'
                      : 'bg-white text-black placeholder:text-neutral-500 focus:border-black'
                  }`}
                />
                <button
                  type="submit"
                  className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium tracking-normal transition-colors ${
                    isDark
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  {resolved.newsletterButtonText}
                </button>
              </div>
              {isSubscribed && (
                <p
                  role="status"
                  className={`mt-2 text-xs font-medium tracking-normal ${resolved.themeClasses.text}`}
                >
                  Thank you for subscribing.
                </p>
              )}
            </form>
          </div>
        )}

        {/* Main Section */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Brand & Identity + Optional Contact */}
          <div className={resolved.linkColumns.length > 0 ? 'lg:col-span-4' : 'lg:col-span-6'}>
            <div className="flex flex-col items-start gap-1">
              {resolved.logoUrl ? (
                <img
                  src={resolved.logoUrl}
                  alt={resolved.logoText}
                  className="h-8 max-w-[160px] object-contain"
                />
              ) : (
                <span
                  className={`text-2xl font-bold tracking-normal ${resolved.themeClasses.heading}`}
                >
                  {resolved.logoText}
                </span>
              )}
              {resolved.brandSubtitle && (
                <p
                  className={`text-xs font-medium uppercase tracking-normal ${resolved.themeClasses.mutedText}`}
                >
                  {resolved.brandSubtitle}
                </p>
              )}
            </div>

            {resolved.description && (
              <p
                className={`mt-4 text-sm leading-relaxed tracking-normal ${resolved.themeClasses.mutedText}`}
              >
                {resolved.description}
              </p>
            )}

            {hasContactInfo && (
              <div className="mt-6 space-y-2.5 text-sm tracking-normal">
                {resolved.contactTitle && (
                  <h3
                    className={`text-sm font-semibold tracking-normal ${resolved.themeClasses.heading}`}
                  >
                    {resolved.contactTitle}
                  </h3>
                )}

                {resolved.addressLines.length > 0 && (
                  <address
                    className={`not-italic leading-relaxed tracking-normal ${resolved.themeClasses.mutedText}`}
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
                        className={`inline-block tabular-nums tracking-normal ${resolved.themeClasses.link}`}
                      >
                        {resolved.phone}
                      </a>
                    </p>
                  ) : (
                    <p
                      className={`tabular-nums tracking-normal ${resolved.themeClasses.mutedText}`}
                    >
                      {resolved.phone}
                    </p>
                  ))}

                {resolved.email &&
                  (resolved.emailHref ? (
                    <p>
                      <a
                        href={resolved.emailHref}
                        className={`inline-block break-all tracking-normal ${resolved.themeClasses.link}`}
                      >
                        {resolved.email}
                      </a>
                    </p>
                  ) : (
                    <p className={`break-all tracking-normal ${resolved.themeClasses.mutedText}`}>
                      {resolved.email}
                    </p>
                  ))}
              </div>
            )}
          </div>

          {/* Right Columns: Navigation Link Columns */}
          {resolved.linkColumns.length > 0 && (
            <div className="lg:col-span-8">
              <div className={`grid gap-8 ${getLinkColumnsGridClass(resolved.linkColumns.length)}`}>
                {resolved.linkColumns.map((column, colIndex) => (
                  <div key={`${column.title || 'column'}-${String(colIndex)}`}>
                    {column.title ? (
                      <h3
                        className={`mb-4 text-sm font-semibold tracking-normal ${resolved.themeClasses.heading}`}
                      >
                        {column.title}
                      </h3>
                    ) : (
                      hasAnyColumnTitle && (
                        <div
                          className="mb-4 hidden text-sm font-semibold select-none sm:block"
                          aria-hidden="true"
                        >
                          &nbsp;
                        </div>
                      )
                    )}

                    {column.links.length > 0 && (
                      <ul className="space-y-2.5 text-sm tracking-normal">
                        {column.links.map((link, linkIndex) => (
                          <li key={`${link.label}-${link.href}-${String(linkIndex)}`}>
                            <FooterLinkAnchor
                              link={link}
                              linkClassName={resolved.themeClasses.link}
                              badgeClassName={resolved.themeClasses.badge}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        {hasBottomBar && (
          <div
            className={`mt-12 flex flex-col gap-6 border-t pt-6 text-sm tracking-normal lg:flex-row lg:items-center lg:justify-between ${resolved.themeClasses.border}`}
          >
            {hasBottomLeft && (
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
                {resolved.copyrightNotice && (
                  <p className={`tracking-normal ${resolved.themeClasses.mutedText}`}>
                    {resolved.copyrightNotice}
                  </p>
                )}

                {resolved.bottomLinks.length > 0 && (
                  <nav aria-label="Footer navigation">
                    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      {resolved.bottomLinks.map((link, index) => (
                        <li key={`${link.label}-${link.href}-${String(index)}`}>
                          <FooterLinkAnchor
                            link={link}
                            linkClassName={resolved.themeClasses.link}
                          />
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            )}

            {hasBottomRight && (
              <div className="flex flex-wrap items-center gap-5 lg:ml-auto">
                {resolved.socialLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4" aria-label="Social media">
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

                {resolved.showBackToTop && (
                  <button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    aria-label="Back to top"
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium tracking-normal transition-colors ${resolved.themeClasses.border} ${resolved.themeClasses.link} ${
                      isDark ? 'hover:border-white' : 'hover:border-black'
                    }`}
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Back to top</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </BlockLayout>
    </footer>
  );
}
