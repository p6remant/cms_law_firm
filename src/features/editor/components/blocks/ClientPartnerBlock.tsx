import { Building2 } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import type { ClientPartnerItem, ClientPartnerProps } from '@/features/editor/types';

function chunkRows(items: ClientPartnerItem[], columns: number): ClientPartnerItem[][] {
  const rows: ClientPartnerItem[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return rows;
}

export function ClientPartnerBlock({ title, items, columns, theme, layout }: ClientPartnerProps) {
  const isDark = theme === 'dark';
  const rows = chunkRows(items, columns);
  const gridColsClass = columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4';

  return (
    <BlockLayout layout={layout}>
      <div
        className={`rounded-2xl border px-8 py-12 transition-colors sm:px-12 sm:py-16 ${
          isDark
            ? 'border-neutral-800 bg-neutral-950 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-xs'
        }`}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-4 lg:pr-10">
            <h2
              className={`text-2xl leading-snug font-semibold tracking-tight sm:text-3xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h2>
          </div>

          <div
            className={`lg:col-span-8 lg:border-l lg:pl-10 ${
              isDark ? 'lg:border-neutral-800' : 'lg:border-slate-200'
            }`}
          >
            <div className={`divide-y ${isDark ? 'divide-neutral-800' : 'divide-slate-200'}`}>
              {rows.map((row, rowIdx) => (
                <div
                  key={`partner-row-${String(rowIdx)}`}
                  className={`grid items-center gap-6 py-7 first:pt-2 last:pb-2 ${gridColsClass}`}
                >
                  {row.map((item, colIdx) => (
                    <div
                      key={`${item.name}-${String(rowIdx)}-${String(colIdx)}`}
                      className="flex items-center justify-start gap-2.5 px-2"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-7 w-7 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            isDark ? 'bg-neutral-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Building2 className="h-4 w-4" />
                        </div>
                      )}
                      <span
                        className={`truncate text-base font-bold tracking-tight ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BlockLayout>
  );
}
