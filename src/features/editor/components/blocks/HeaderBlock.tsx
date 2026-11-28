import { useState } from 'react';
import { Menu, Scale, X } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import type { HeaderProps } from '@/features/editor/types';

export function HeaderBlock({
  brandName,
  logoUrl,
  navItems,
  ctaLabel,
  showCta,
  sticky,
  theme,
  layout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header
      className={`w-full border-b transition-colors ${sticky ? 'sticky top-0 z-40' : ''} ${
        isDark
          ? 'border-neutral-800 bg-neutral-950 text-white'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <BlockLayout layout={layout} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex min-h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName || 'Brand Logo'}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <div
                className={`flex h-10 w-10 items-center justify-center ${
                  isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white'
                }`}
              >
                <Scale className="h-5 w-5" />
              </div>
            )}
            <span className="text-xl font-bold tracking-tight">{brandName || 'CMS Law'}</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item, idx) => (
              <button
                key={`${item.label}-${String(idx)}`}
                type="button"
                className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {showCta && ctaLabel && (
              <button
                type="button"
                className={`inline-flex items-center px-5 py-2.5 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'bg-white text-neutral-950 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {ctaLabel}
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => {
              setMobileMenuOpen((prev) => !prev);
            }}
            className={`inline-flex items-center justify-center p-2 md:hidden ${
              isDark
                ? 'text-slate-300 hover:bg-neutral-800 hover:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className={`mt-4 space-y-3 border-t pt-4 md:hidden ${
              isDark ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            <nav className="flex flex-col space-y-1">
              {navItems.map((item, idx) => (
                <button
                  key={`mobile-${item.label}-${String(idx)}`}
                  type="button"
                  className={`px-3 py-2 text-left text-sm font-medium ${
                    isDark
                      ? 'text-slate-300 hover:bg-neutral-900 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            {showCta && ctaLabel && (
              <div className="pt-2">
                <button
                  type="button"
                  className={`w-full px-4 py-2.5 text-center text-sm font-semibold ${
                    isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white'
                  }`}
                >
                  {ctaLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </BlockLayout>
    </header>
  );
}
