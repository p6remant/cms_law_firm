import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { getTextAlignClass } from '@/features/editor/config/field-options';
import { useSlider } from '@/features/editor/hooks/useSlider';
import type { HeroSliderProps } from '@/features/editor/types';

export function HeroSliderBlock({
  slides,
  autoScroll,
  autoScrollInterval,
  scrollDirection,
  showArrows,
  showDots,
  align,
  theme,
  layout,
}: HeroSliderProps) {
  const isDark = theme === 'dark';
  const totalSlides = slides.length;
  const { currentIndex, totalPages, next, prev, goTo } = useSlider({
    totalItems: totalSlides,
    itemsPerView: 1,
    autoScroll,
    autoScrollInterval,
    scrollDirection,
  });

  const activeSlide = slides[currentIndex] ?? {
    badge: 'CMS LAW PLATFORM',
    title: 'Add a slide to get started',
    description: 'Configure your hero slides in the right sidebar panel.',
    ctaLabel: 'Get Started',
    bgImage: '',
  };

  const hasBgImage = Boolean(activeSlide.bgImage?.trim());

  const alignContainerClass =
    align === 'center'
      ? 'mx-auto text-center items-center'
      : align === 'right'
        ? 'ml-auto text-right items-end'
        : 'mr-auto text-left items-start';

  return (
    <BlockLayout layout={layout}>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          isDark
            ? 'border-neutral-800 bg-neutral-950 text-white'
            : 'border-slate-200 bg-slate-50 text-slate-900'
        }`}
      >
        {hasBgImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={activeSlide.bgImage}
              alt={activeSlide.title || 'Slide background'}
              className="h-full w-full object-cover transition-opacity duration-500"
            />
            <div
              className={`absolute inset-0 ${isDark ? 'bg-neutral-950/75' : 'bg-slate-950/60'}`}
            />
          </div>
        )}

        <div className="relative z-10 px-8 py-16 sm:px-14 sm:py-24">
          <div
            className={`flex max-w-3xl flex-col space-y-5 ${alignContainerClass} ${getTextAlignClass(align)}`}
          >
            {activeSlide.badge && (
              <span
                className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider uppercase ${
                  hasBgImage || isDark
                    ? 'border border-white/20 bg-white/10 text-white backdrop-blur-xs'
                    : 'border border-slate-300 bg-white text-slate-700'
                }`}
              >
                {activeSlide.badge}
              </span>
            )}

            <h1
              className={`text-3xl font-bold tracking-tight sm:text-5xl ${
                hasBgImage || isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {activeSlide.title}
            </h1>

            {activeSlide.description && (
              <p
                className={`text-base leading-relaxed sm:text-lg ${
                  hasBgImage || isDark ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                {activeSlide.description}
              </p>
            )}

            {activeSlide.ctaLabel && (
              <div className="pt-2">
                <button
                  type="button"
                  className={`inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors ${
                    hasBgImage || isDark
                      ? 'bg-white text-slate-950 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {activeSlide.ctaLabel}
                </button>
              </div>
            )}
          </div>
        </div>

        {showArrows && totalPages > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className={`absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full p-2.5 transition-colors ${
                hasBgImage || isDark
                  ? 'border border-white/20 bg-neutral-900/70 text-white hover:bg-neutral-800'
                  : 'border border-slate-200 bg-white/90 text-slate-900 shadow-sm hover:bg-white'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className={`absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full p-2.5 transition-colors ${
                hasBgImage || isDark
                  ? 'border border-white/20 bg-neutral-900/70 text-white hover:bg-neutral-800'
                  : 'border border-slate-200 bg-white/90 text-slate-900 shadow-sm hover:bg-white'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {showDots && totalPages > 1 && (
          <div className="relative z-20 flex items-center justify-center gap-2 pb-6">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={`hero-dot-${String(idx)}`}
                  type="button"
                  onClick={() => {
                    goTo(idx);
                  }}
                  aria-label={`Go to slide ${String(idx + 1)}`}
                  className={`h-2.5 rounded-full transition-all ${
                    isActive
                      ? hasBgImage || isDark
                        ? 'w-7 bg-white'
                        : 'w-7 bg-slate-900'
                      : hasBgImage || isDark
                        ? 'w-2.5 bg-white/40 hover:bg-white/70'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </BlockLayout>
  );
}
