import type { MapLocationMode } from '../types';

export const DEFAULT_MAP_COORDINATES = {
  lat: 40.7128,
  lng: -74.006,
} as const;

export interface GoogleMapsUrlParseResult {
  embedUrl?: string;
  coordinates?: { lat: number; lng: number };
  query?: string;
  isIframeSnippet: boolean;
}

export interface ResolveMapEmbedOptions {
  locationMode: MapLocationMode;
  latitude?: number | string;
  longitude?: number | string;
  googleMapsUrl?: string;
  zoom?: number;
}

export interface MapEmbedResult {
  embedUrl: string | null;
  isValid: boolean;
  errorMessage?: string;
}

export interface ResolveDirectionsOptions {
  locationMode: MapLocationMode;
  latitude?: number | string;
  longitude?: number | string;
  googleMapsUrl?: string;
  address?: string;
}

export function clampZoom(zoom?: number | string | null): number {
  if (zoom === undefined || zoom === null) {
    return 15;
  }
  const num = typeof zoom === 'number' ? zoom : Number(zoom);
  if (!Number.isFinite(num)) {
    return 15;
  }
  return Math.min(20, Math.max(1, Math.round(num)));
}

/**
 * Validates and converts latitude/longitude values.
 * Latitude must be within [-90, 90] and longitude within [-180, 180].
 * Returns null if input is missing, non-numeric, or out of range.
 */
export function parseCoordinates(lat: unknown, lng: unknown): { lat: number; lng: number } | null {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return null;
  }

  const toCoord = (val: unknown): number | null => {
    if (typeof val === 'number') {
      return Number.isFinite(val) ? val : null;
    }
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return null;
      const num = Number(trimmed);
      return Number.isFinite(num) ? num : null;
    }
    return null;
  };

  const parsedLat = toCoord(lat);
  const parsedLng = toCoord(lng);

  if (parsedLat === null || parsedLng === null) {
    return null;
  }

  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    return null;
  }

  return {
    lat: parsedLat,
    lng: parsedLng,
  };
}

/**
 * Parses user-provided Google Maps input string.
 * Supports iframe embed snippets, direct embed URLs, place URLs with @lat,lng,
 * coordinate queries, and place search URLs.
 */
export function parseGoogleMapsUrl(rawUrl: string): GoogleMapsUrlParseResult | null {
  if (!rawUrl) {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  let isIframeSnippet = false;
  let targetUrl = trimmed;

  // 1. Detect iframe code and extract src attribute
  const iframeMatch = targetUrl.match(/<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
  const iframeSrc = iframeMatch?.[1];
  if (iframeSrc) {
    isIframeSnippet = true;
    targetUrl = iframeSrc.trim();
  }

  // Decode standard HTML entities in URL
  targetUrl = targetUrl.replace(/&amp;/g, '&');

  // Handle scheme-relative URLs
  if (targetUrl.startsWith('//')) {
    targetUrl = `https:${targetUrl}`;
  }

  // 2. Parse URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    try {
      parsedUrl = new URL(`https://${targetUrl}`);
      targetUrl = `https://${targetUrl}`;
    } catch {
      return null;
    }
  }

  // Validate Google Maps hostname
  const hostname = parsedUrl.hostname.toLowerCase();
  const isGoogleHost =
    hostname.includes('google.') || hostname.includes('goo.gl') || hostname === 'maps.google.com';

  if (!isGoogleHost) {
    return null;
  }

  let embedUrl: string | undefined;
  let coordinates: { lat: number; lng: number } | undefined;
  let query: string | undefined;

  // 3. Direct embed URL detection
  const isDirectEmbed =
    parsedUrl.pathname.includes('/maps/embed') || parsedUrl.searchParams.get('output') === 'embed';

  if (isDirectEmbed) {
    embedUrl = targetUrl;
  }

  // 4. Coordinates extraction from path (e.g., /@40.7128,-74.006,15z)
  const pathWithHash = parsedUrl.pathname + parsedUrl.hash;
  const atMatch = pathWithHash.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch && atMatch[1] && atMatch[2]) {
    const coords = parseCoordinates(atMatch[1], atMatch[2]);
    if (coords) {
      coordinates = coords;
    }
  }

  // 5. Coordinates extraction from pb param (e.g. !2d-73.9856!3d40.7484)
  const pb = parsedUrl.searchParams.get('pb') || targetUrl;
  const pbMatch = pb.match(/!2d(-?\d+(?:\.\d+)?)(?:!3d|.*!3d)(-?\d+(?:\.\d+)?)/);
  if (pbMatch && pbMatch[1] && pbMatch[2] && !coordinates) {
    // !2d is longitude, !3d is latitude
    const coords = parseCoordinates(pbMatch[2], pbMatch[1]);
    if (coords) {
      coordinates = coords;
    }
  }

  // 6. Query / Coordinate extraction from query params (q, ll, query, center)
  const qParam =
    parsedUrl.searchParams.get('q') ||
    parsedUrl.searchParams.get('query') ||
    parsedUrl.searchParams.get('ll') ||
    parsedUrl.searchParams.get('center');

  if (qParam) {
    const coordMatch = qParam.trim().match(/^([-+]?\d*(?:\.\d+)?),\s*([-+]?\d*(?:\.\d+)?)$/);
    if (coordMatch && coordMatch[1] && coordMatch[2]) {
      const coords = parseCoordinates(coordMatch[1], coordMatch[2]);
      if (coords && !coordinates) {
        coordinates = coords;
      }
    } else {
      query = qParam.trim();
    }
  }

  // 7. Place name extraction from pathname (e.g., /place/Empire+State+Building/)
  const placeMatch = parsedUrl.pathname.match(/\/place\/([^/@]+)/);
  const placeParam = placeMatch?.[1];
  if (placeParam) {
    const placeName = decodeURIComponent(placeParam.replace(/\+/g, ' ')).trim();
    if (placeName) {
      query = placeName;
    }
  }

  // 8. Search query from pathname (e.g., /search/Statue+of+Liberty)
  const searchMatch = parsedUrl.pathname.match(/\/(?:maps\/)?search\/([^/@?]+)/);
  const searchParam = searchMatch?.[1];
  if (searchParam && !query) {
    const searchName = decodeURIComponent(searchParam.replace(/\+/g, ' ')).trim();
    if (searchName) {
      query = searchName;
    }
  }

  if (!embedUrl && !coordinates && !query && !isIframeSnippet) {
    return null;
  }

  return {
    ...(embedUrl ? { embedUrl } : {}),
    ...(coordinates ? { coordinates } : {}),
    ...(query ? { query } : {}),
    isIframeSnippet,
  };
}

/**
 * Resolves an iframe embed URL based on editor configuration.
 */
export function resolveMapEmbedUrl(options: ResolveMapEmbedOptions): MapEmbedResult {
  const { locationMode, latitude, longitude, googleMapsUrl, zoom } = options;
  const clampedZoom = clampZoom(zoom);

  if (locationMode === 'coordinates') {
    const coords = parseCoordinates(latitude, longitude);
    if (!coords) {
      return {
        embedUrl: null,
        isValid: false,
        errorMessage:
          'Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.',
      };
    }

    return {
      embedUrl: `https://maps.google.com/maps?q=${String(coords.lat)},${String(coords.lng)}&z=${String(clampedZoom)}&output=embed`,
      isValid: true,
    };
  }

  // locationMode === 'link'
  if (!googleMapsUrl || !googleMapsUrl.trim()) {
    return {
      embedUrl: null,
      isValid: false,
      errorMessage: 'Please enter a Google Maps link or iframe embed code.',
    };
  }

  const parsed = parseGoogleMapsUrl(googleMapsUrl);
  if (!parsed) {
    return {
      embedUrl: null,
      isValid: false,
      errorMessage:
        'Unable to parse the provided Google Maps URL. Please provide a valid Google Maps link, place URL, or embed iframe.',
    };
  }

  if (parsed.embedUrl) {
    return {
      embedUrl: parsed.embedUrl,
      isValid: true,
    };
  }

  if (parsed.coordinates) {
    return {
      embedUrl: `https://maps.google.com/maps?q=${String(parsed.coordinates.lat)},${String(parsed.coordinates.lng)}&z=${String(clampedZoom)}&output=embed`,
      isValid: true,
    };
  }

  if (parsed.query) {
    return {
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(parsed.query)}&z=${String(clampedZoom)}&output=embed`,
      isValid: true,
    };
  }

  return {
    embedUrl: null,
    isValid: false,
    errorMessage: 'Unable to resolve map location from the provided URL.',
  };
}

/**
 * Resolves an external Google Maps directions link for visitors.
 * Follows fallback precedence:
 * Valid coordinates > Valid address > URL destination query > Raw Google Maps link > null.
 */
export function resolveDirectionsUrl(options: ResolveDirectionsOptions): string | null {
  const { locationMode, latitude, longitude, googleMapsUrl, address } = options;
  const trimmedAddress = address?.trim() || null;

  if (locationMode === 'coordinates') {
    const coords = parseCoordinates(latitude, longitude);
    if (coords) {
      return `https://www.google.com/maps/dir/?api=1&destination=${String(coords.lat)},${String(coords.lng)}`;
    }
    if (trimmedAddress) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trimmedAddress)}`;
    }
    return null;
  }

  // locationMode === 'link'
  if (googleMapsUrl && googleMapsUrl.trim()) {
    const parsed = parseGoogleMapsUrl(googleMapsUrl);
    if (parsed?.coordinates) {
      return `https://www.google.com/maps/dir/?api=1&destination=${String(parsed.coordinates.lat)},${String(parsed.coordinates.lng)}`;
    }
    if (trimmedAddress) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trimmedAddress)}`;
    }
    if (parsed?.query) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parsed.query)}`;
    }
    if (!parsed?.isIframeSnippet) {
      const trimmedUrl = googleMapsUrl.trim();
      try {
        const u = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
        if (
          u.hostname.includes('google.') ||
          u.hostname.includes('goo.gl') ||
          u.hostname.includes('maps.')
        ) {
          return u.toString();
        }
      } catch {
        // invalid URL
      }
    }
  }

  if (trimmedAddress) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trimmedAddress)}`;
  }

  return null;
}
