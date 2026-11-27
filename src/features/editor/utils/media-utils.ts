import type {
  ImageAspectRatio,
  MediaType,
  // PdfPreviewHeight,
  VideoAspectRatio,
} from '@/features/editor/types';

export type ResolvedVideoSource = {
  isValid: boolean;
  kind: 'native' | 'youtube' | 'vimeo' | 'empty';
  src: string;
  errorMessage?: string;
};

const ACCEPTED_MIME_PREFIXES: Record<MediaType, string[]> = {
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'],
  pdf: ['application/pdf'],
};

const ACCEPTED_EXTENSIONS: Record<MediaType, string[]> = {
  video: ['.mp4', '.webm', '.ogg', '.mov'],
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'],
  pdf: ['.pdf'],
};

export function getAcceptAttribute(mediaType: MediaType): string {
  switch (mediaType) {
    case 'video':
      return 'video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogg,.mov';
    case 'image':
      return 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif,.jpg,.jpeg,.png,.webp,.gif,.svg,.avif';
    case 'pdf':
      return 'application/pdf,.pdf';
  }
}

export function validateMediaFile(
  file: { name: string; type: string; size?: number },
  mediaType: MediaType
): { valid: boolean; error?: string } {
  const allowedMimes = ACCEPTED_MIME_PREFIXES[mediaType];
  const allowedExts = ACCEPTED_EXTENSIONS[mediaType];
  const lowerName = file.name.toLowerCase().trim();

  const matchesMime = Boolean(file.type && allowedMimes.includes(file.type.toLowerCase()));
  const matchesExt = allowedExts.some((ext) => lowerName.endsWith(ext));

  if (!matchesMime && !matchesExt) {
    const label =
      mediaType === 'video'
        ? 'MP4, WebM, OGG, or MOV video'
        : mediaType === 'image'
          ? 'JPG, PNG, WebP, GIF, or SVG image'
          : 'PDF document (.pdf)';
    return {
      valid: false,
      error: `Unsupported file format. Please upload a valid ${label}.`,
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${String(Math.round(bytes))} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function extractYouTubeId(input: string): string | null {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0];
      return id || null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const vParam = url.searchParams.get('v');
      if (vParam) return vParam;
      const parts = url.pathname.split('/').filter(Boolean);
      if ((parts[0] === 'embed' || parts[0] === 'shorts') && parts[1]) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

function extractVimeoId(input: string): string | null {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const parts = url.pathname.split('/').filter(Boolean);
      const lastSegment = parts[parts.length - 1];
      if (lastSegment && /^\d+$/.test(lastSegment)) {
        return lastSegment;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function resolveVideoSource(rawUrl?: string): ResolvedVideoSource {
  const trimmed = rawUrl?.trim() ?? '';
  if (!trimmed) {
    return {
      isValid: false,
      kind: 'empty',
      src: '',
      errorMessage: 'Upload a video file or enter a video URL to preview.',
    };
  }

  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:video/') || trimmed.startsWith('/')) {
    return {
      isValid: true,
      kind: 'native',
      src: trimmed,
    };
  }

  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      isValid: true,
      kind: 'youtube',
      src: `https://www.youtube.com/embed/${ytId}?enablejsapi=1&playsinline=1&rel=0`,
    };
  }

  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      isValid: true,
      kind: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeoId}?api=1&background=0`,
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return {
        isValid: true,
        kind: 'native',
        src: trimmed,
      };
    }
  } catch {
    // Fall through to invalid error
  }

  return {
    isValid: false,
    kind: 'empty',
    src: '',
    errorMessage: 'Invalid video URL. Upload an MP4/WebM file or provide a valid URL.',
  };
}

export function getVideoAspectRatioClass(aspectRatio?: VideoAspectRatio): string {
  switch (aspectRatio) {
    case '4/3':
      return 'aspect-[4/3] w-full';
    case '21/9':
      return 'aspect-[21/9] w-full';
    case '1/1':
      return 'aspect-square w-full';
    case '16/9':
    default:
      return 'aspect-video w-full';
  }
}

export function getImageAspectRatioClass(aspectRatio?: ImageAspectRatio): string {
  switch (aspectRatio) {
    case '16/9':
      return 'aspect-video w-full';
    case '4/3':
      return 'aspect-[4/3] w-full';
    case '1/1':
      return 'aspect-square w-full';
    case '3/4':
      return 'aspect-[3/4] w-full';
    case 'auto':
    default:
      return 'w-full';
  }
}

/*
export function getPdfViewerHeightClass(height?: PdfPreviewHeight): string {
  switch (height) {
    case 'sm':
      return 'h-96 w-full';
    case 'lg':
      return 'h-[42rem] w-full';
    case 'md':
    default:
      return 'h-[32rem] w-full';
  }
}
*/
