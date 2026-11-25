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
    <BlockLayout layout={layout} className={sticky ? 'sticky top-0 z-40' : undefined}>
      <header
        className={`rounded-2xl border px-6 py-4 transition-colors ${
          isDark
            ? 'border-neutral-800 bg-neutral-950 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-xs'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName || 'Brand Logo'}
                className="h-9 w-9 rounded-lg object-cover"
              />
            ) : (
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white'
                }`}
              >
                <Scale className="h-5 w-5" />
              </div>
            )}
            <span className="text-lg font-bold tracking-tight">{brandName || 'CMS Law'}</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
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
                className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
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
            className={`inline-flex items-center justify-center rounded-lg p-2 md:hidden ${
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
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, idx) => (
                <button
                  key={`mobile-${item.label}-${String(idx)}`}
                  type="button"
                  className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${
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
                  className={`w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                    isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white'
                  }`}
                >
                  {ctaLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </BlockLayout>
  );
}
