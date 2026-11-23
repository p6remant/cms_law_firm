import { MapPin, MapPinOff, Navigation } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { getMapContainerClass } from '@/features/editor/config/field-options';
import type { MapProps } from '@/features/editor/types';
import { resolveDirectionsUrl, resolveMapEmbedUrl } from '@/features/editor/utils/map-location';

export function MapBlock({
  title,
  eyebrow,
  description,
  address,
  locationMode,
  latitude,
  longitude,
  googleMapsUrl,
  zoom,
  height,
  aspectRatio,
  showDirectionsButton,
  directionsButtonLabel,
  theme,
  layout,
}: MapProps) {
  const isDark = theme === 'dark';

  const embedResult = resolveMapEmbedUrl({
    locationMode,
    latitude,
    longitude,
    googleMapsUrl,
    zoom,
  });

  const directionsUrl = resolveDirectionsUrl({
    locationMode,
    latitude,
    longitude,
    googleMapsUrl,
    address,
  });

  const hasHeaderContent = Boolean(eyebrow || title || description || address);

  return (
    <BlockLayout layout={layout}>
      <div
        className={
          isDark
            ? 'rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white'
            : 'rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xs'
        }
      >
        {hasHeaderContent && (
          <div className="space-y-3">
            {eyebrow && (
              <p
                className={`text-xs font-semibold tracking-widest uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={`text-2xl font-bold tracking-tight sm:text-3xl ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={`text-sm leading-relaxed sm:text-base ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {description}
              </p>
            )}
            {address && (
              <div
                className={`flex items-start gap-2 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>{address}</span>
              </div>
            )}
          </div>
        )}

        <div className={hasHeaderContent ? 'mt-6' : undefined}>
          <div
            className={`${getMapContainerClass(height, aspectRatio)} relative overflow-hidden rounded-xl border ${
              isDark ? 'border-neutral-800' : 'border-slate-200'
            }`}
          >
            {embedResult.isValid && embedResult.embedUrl ? (
              <iframe
                src={embedResult.embedUrl}
                title={title || 'Office Location Map'}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div
                className={`flex h-full w-full flex-col items-center justify-center border-dashed p-6 text-center ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900/60 text-slate-300'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <MapPinOff className="h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm font-semibold">Map Preview Unavailable</p>
                <p className="mt-1 max-w-md text-xs leading-relaxed opacity-80">
                  {embedResult.errorMessage ||
                    'Please enter valid coordinates or a Google Maps link to display the map.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {showDirectionsButton && directionsUrl && (
          <div className="mt-6 flex items-center justify-start">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-white text-neutral-950 hover:bg-slate-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Navigation className="h-4 w-4" />
              <span>{directionsButtonLabel || 'Get Directions'}</span>
            </a>
          </div>
        )}
      </div>
    </BlockLayout>
  );
}
