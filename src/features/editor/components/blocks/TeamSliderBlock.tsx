import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import {
  getGridColumnsClass,
  getTeamImageShapeClass,
} from '@/features/editor/config/field-options';
import { useSlider } from '@/features/editor/hooks/useSlider';
import type { TeamSliderProps } from '@/features/editor/types';

export function TeamSliderBlock({
  eyebrow,
  title,
  description,
  imageShape,
  members,
  cardsPerView,
  autoScroll,
  autoScrollInterval,
  scrollDirection,
  showArrows,
  showDots,
  theme,
  layout,
}: TeamSliderProps) {
  const isDark = theme === 'dark';

  const { currentIndex, totalPages, next, prev, goTo } = useSlider({
    totalItems: members.length,
    itemsPerView: cardsPerView,
    autoScroll,
    autoScrollInterval,
    scrollDirection,
  });

  const startIndex = currentIndex * cardsPerView;
  const visibleMembers = members.slice(startIndex, startIndex + cardsPerView);
  const imageClass = getTeamImageShapeClass(imageShape);

  return (
    <BlockLayout layout={layout}>
      <div
        className={`rounded-2xl border p-8 transition-colors ${
          isDark
            ? 'border-neutral-800 bg-neutral-950 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-2">
            {eyebrow && (
              <p
                className={`text-xs font-semibold tracking-widest uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {eyebrow}
              </p>
            )}
            {title && <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>}
            {description && (
              <p
                className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {description}
              </p>
            )}
          </div>

          {showArrows && totalPages > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous team members"
                className={`rounded-lg border p-2 transition-colors ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next team members"
                className={`rounded-lg border p-2 transition-colors ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className={`mt-8 grid gap-6 ${getGridColumnsClass(cardsPerView)}`}>
          {visibleMembers.map((member, idx) => (
            <div
              key={`${member.name}-${String(startIndex + idx)}`}
              className={`flex flex-col rounded-xl border p-5 transition-all ${
                imageShape === 'rounded' ? 'items-center text-center' : 'items-start text-left'
              } ${
                isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-slate-200 bg-slate-50/70'
              }`}
            >
              <div className={imageShape === 'rounded' ? 'mb-4' : 'mb-4 w-full'}>
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className={imageClass} />
                ) : (
                  <div
                    className={`${imageClass} flex items-center justify-center ${
                      isDark ? 'bg-neutral-800 text-slate-400' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <User className="h-10 w-10" />
                  </div>
                )}
              </div>

              <h3 className="text-base font-semibold">{member.name}</h3>
              <p
                className={`mt-0.5 text-xs font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {member.role}
              </p>
              {member.bio && (
                <p
                  className={`mt-2.5 text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>

        {showDots && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={`team-dot-${String(idx)}`}
                  type="button"
                  onClick={() => {
                    goTo(idx);
                  }}
                  aria-label={`Go to team page ${String(idx + 1)}`}
                  className={`h-2 rounded-full transition-all ${
                    isActive
                      ? isDark
                        ? 'w-6 bg-white'
                        : 'w-6 bg-slate-900'
                      : isDark
                        ? 'w-2 bg-neutral-700 hover:bg-neutral-600'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
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
