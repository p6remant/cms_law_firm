import { type ChangeEvent, useRef, useState } from 'react';
import { Eye, Film, Maximize2, Pause, Play, Upload, Volume2, VolumeX } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { useVideoScrollPlay } from '@/features/editor/hooks/useVideoScrollPlay';
import type { VideoBlockProps } from '@/features/editor/types';
import {
  getAcceptAttribute,
  getVideoAspectRatioClass,
  resolveVideoSource,
  validateMediaFile,
} from '@/features/editor/utils/media-utils';

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [localVideoOverride, setLocalVideoOverride] = useState<{
    basePropUrl: string;
    objectUrl: string;
    fileName: string;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const activeVideoUrl =
    localVideoOverride && localVideoOverride.basePropUrl === videoUrl
      ? localVideoOverride.objectUrl
      : videoUrl;

  const resolvedSource = resolveVideoSource(activeVideoUrl);
  const aspectClass = getVideoAspectRatioClass(aspectRatio);

  const { isInView, isPlaying, isMuted, setIsPlaying, togglePlay, toggleMute } = useVideoScrollPlay(
    {
      containerRef,
      videoRef,
      iframeRef,
      videoKind: resolvedSource.kind,
      autoPlayOnScroll,
      initialMuted: muted,
      src: resolvedSource.src,
    }
  );

  const handleLocalUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file, 'video');
    if (!validation.valid) {
      setUploadError(validation.error ?? 'Invalid video file.');
      event.target.value = '';
      return;
    }

    setUploadError(null);
    const objectUrl = URL.createObjectURL(file);
    setLocalVideoOverride({
      basePropUrl: videoUrl,
      objectUrl,
      fileName: file.name,
    });
    event.target.value = '';
  };

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
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptAttribute('video')}
          onChange={handleLocalUpload}
          className="hidden"
        />

        {hasHeader && (
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
                  className={`text-sm leading-relaxed sm:text-base ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {autoPlayOnScroll && (
                <span
                  className={`inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-medium transition-colors ${
                    isInView && isPlaying
                      ? isDark
                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : isDark
                        ? 'border-neutral-800 bg-neutral-900 text-slate-400'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{isInView && isPlaying ? 'Auto-Playing in View' : 'Scroll Auto-Play'}</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900 text-slate-200 hover:bg-neutral-800'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Video</span>
              </button>
            </div>
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
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'bg-white text-neutral-950 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Select Video File (MP4 / WebM)</span>
              </button>
            </div>
          )}
        </div>

        {uploadError && <p className="mt-3 text-xs font-medium text-rose-500">{uploadError}</p>}

        {(caption || (localVideoOverride && localVideoOverride.basePropUrl === videoUrl)) && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            {caption && <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>{caption}</p>}
            {localVideoOverride && localVideoOverride.basePropUrl === videoUrl && (
              <span className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>
                Loaded file: {localVideoOverride.fileName}
              </span>
            )}
          </div>
        )}
      </BlockLayout>
    </section>
  );
}
