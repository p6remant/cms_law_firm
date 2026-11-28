import { useRef } from 'react';
import { Film, Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { useVideoScrollPlay } from '@/features/editor/hooks/useVideoScrollPlay';
import type { VideoBlockProps } from '@/features/editor/types';
import { getVideoAspectRatioClass, resolveVideoSource } from '@/features/editor/utils/media-utils';

export function VideoBlock({
  eyebrow,
  title,
  description,
  videoUrl,
  posterUrl,
  caption,
  autoPlayOnScroll,
  loop,
  muted,
  showControls,
  aspectRatio,
  theme,
  layout,
}: VideoBlockProps) {
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const resolvedSource = resolveVideoSource(videoUrl);
  const aspectClass = getVideoAspectRatioClass(aspectRatio);

  const { isPlaying, isMuted, setIsPlaying, togglePlay, toggleMute } = useVideoScrollPlay({
    containerRef,
    videoRef,
    iframeRef,
    videoKind: resolvedSource.kind,
    autoPlayOnScroll,
    initialMuted: muted,
    src: resolvedSource.src,
  });

  const handleFullscreen = () => {
    const el = videoRef.current ?? containerRef.current;
    if (el && typeof el.requestFullscreen === 'function') {
      void el.requestFullscreen();
    }
  };

  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section
      ref={containerRef}
      className={`w-full border-b transition-colors ${
        isDark
          ? 'border-neutral-800 bg-neutral-950 text-white'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <BlockLayout layout={layout} className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {hasHeader && (
          <div className="mb-6 max-w-2xl space-y-2">
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
                className={`text-sm leading-relaxed sm:text-base ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={`group relative overflow-hidden border ${aspectClass} ${
            isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-slate-950'
          }`}
        >
          {resolvedSource.isValid && resolvedSource.kind === 'native' && (
            <>
              <video
                ref={videoRef}
                src={resolvedSource.src}
                poster={posterUrl || undefined}
                loop={loop}
                muted={isMuted}
                controls={showControls}
                playsInline
                preload="metadata"
                onPlay={() => {
                  setIsPlaying(true);
                }}
                onPause={() => {
                  setIsPlaying(false);
                }}
                className="h-full w-full object-cover"
              />

              {/* Floating Quick Controls Bar */}
              <div className="pointer-events-none absolute top-3 right-3 left-3 flex items-center justify-between gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="pointer-events-auto inline-flex items-center gap-1.5 border border-white/15 bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    className="inline-flex items-center gap-1 hover:text-slate-200"
                  >
                    {isPlaying ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                </div>

                <div className="pointer-events-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="inline-flex items-center gap-1 border border-white/15 bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/85"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="h-3.5 w-3.5" />
                        <span>Muted</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Sound On</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    aria-label="Fullscreen video"
                    className="inline-flex items-center justify-center border border-white/15 bg-black/70 p-1.5 text-white transition-colors hover:bg-black/85"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {resolvedSource.isValid &&
            (resolvedSource.kind === 'youtube' || resolvedSource.kind === 'vimeo') && (
              <iframe
                ref={iframeRef}
                src={resolvedSource.src}
                title={title || 'Embedded Video'}
                className="h-full w-full border-0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            )}

          {!resolvedSource.isValid && (
            <div
              className={`flex h-full w-full flex-col items-center justify-center p-8 text-center ${
                isDark ? 'bg-neutral-900/60 text-slate-300' : 'bg-slate-50 text-slate-600'
              }`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center border ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 text-slate-400'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <Film className="h-7 w-7" />
              </div>
              <p className="mt-4 text-sm font-semibold">No Video Media Selected</p>
              <p className="mt-1 max-w-md text-xs leading-relaxed opacity-80">
                {resolvedSource.errorMessage}
              </p>
            </div>
          )}
        </div>

        {caption && (
          <div className="mt-3 text-xs">
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{caption}</p>
          </div>
        )}
      </BlockLayout>
    </section>
  );
}
