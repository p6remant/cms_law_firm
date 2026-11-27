import { type RefObject, useCallback, useEffect, useState } from 'react';

export type UseVideoScrollPlayOptions = {
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  videoKind: 'native' | 'youtube' | 'vimeo' | 'empty';
  autoPlayOnScroll: boolean;
  initialMuted: boolean;
  src: string;
};

export function useVideoScrollPlay({
  containerRef,
  videoRef,
  iframeRef,
  videoKind,
  autoPlayOnScroll,
  initialMuted,
  src,
}: UseVideoScrollPlayOptions) {
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muteOverride, setMuteOverride] = useState<{
    baseMuted: boolean;
    muted: boolean;
  } | null>(null);

  const isMuted =
    muteOverride && muteOverride.baseMuted === initialMuted ? muteOverride.muted : initialMuted;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, videoRef]);

  const sendEmbedCommand = useCallback(
    (action: 'play' | 'pause') => {
      const iframeWindow = iframeRef?.current?.contentWindow;
      if (!iframeWindow) return;

      if (videoKind === 'youtube') {
        const func = action === 'play' ? 'playVideo' : 'pauseVideo';
        iframeWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
      } else if (videoKind === 'vimeo') {
        iframeWindow.postMessage(JSON.stringify({ method: action }), '*');
      }
    },
    [iframeRef, videoKind]
  );

  const playVideo = useCallback(async () => {
    if (videoKind === 'native') {
      const videoEl = videoRef.current;
      if (!videoEl) return;

      try {
        await videoEl.play();
        setIsPlaying(true);
      } catch {
        // Browsers require muted attribute for programmatic scroll-triggered autoplay
        videoEl.muted = true;
        setMuteOverride({ baseMuted: initialMuted, muted: true });
        try {
          await videoEl.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    } else if (videoKind === 'youtube' || videoKind === 'vimeo') {
      sendEmbedCommand('play');
      setIsPlaying(true);
    }
  }, [videoKind, videoRef, initialMuted, sendEmbedCommand]);

  const pauseVideo = useCallback(() => {
    if (videoKind === 'native') {
      const videoEl = videoRef.current;
      if (!videoEl) return;
      videoEl.pause();
      setIsPlaying(false);
    } else if (videoKind === 'youtube' || videoKind === 'vimeo') {
      sendEmbedCommand('pause');
      setIsPlaying(false);
    }
  }, [videoKind, videoRef, sendEmbedCommand]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseVideo();
    } else {
      void playVideo();
    }
  }, [isPlaying, pauseVideo, playVideo]);

  const toggleMute = useCallback(() => {
    const videoEl = videoRef.current;
    const nextMuted = !isMuted;
    setMuteOverride({ baseMuted: initialMuted, muted: nextMuted });
    if (videoEl) {
      videoEl.muted = nextMuted;
    }
  }, [isMuted, initialMuted, videoRef]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        setIsInView(visible);

        if (!autoPlayOnScroll) return;

        if (visible) {
          void playVideo();
        } else {
          pauseVideo();
        }
      },
      {
        threshold: [0, 0.35, 0.65],
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, autoPlayOnScroll, playVideo, pauseVideo, src]);

  return {
    isInView,
    isPlaying,
    isMuted,
    setIsPlaying,
    togglePlay,
    toggleMute,
  };
}
