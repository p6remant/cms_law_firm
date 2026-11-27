import {
  BarChart,
  CheckCircle,
  Globe,
  Layers,
  Lock,
  Shield,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type {
  CTAButtonProps,
  CTAButtonVariant,
  Feature1Props,
  Feature2Props,
  FeatureIconName,
  FeatureItem,
  LayoutFieldProps,
} from '../types.ts';
import { getCTAButtonClasses, resolveCTAButton, type ResolvedCTAButton } from './cta-utils.ts';

export interface FeatureThemeClasses {
  wrapper: string;
  eyebrow: string;
  badge: string;
  heading: string;
  text: string;
  mutedText: string;
  border: string;
  card: string;
  flatItem: string;
  iconContainer: string;
  icon: string;
  mediaFrame: string;
  mediaPlaceholderMuted: string;
}

/**
 * Returns pure monochrome theme classes using neutral grayscale tokens and normal tracking.
 */
export function getFeatureThemeClasses(theme: 'light' | 'dark'): FeatureThemeClasses {
  if (theme === 'light') {
    return {
      wrapper: 'bg-white text-black border-neutral-200 tracking-normal',
      eyebrow: 'text-neutral-600 tracking-normal',
      badge: 'bg-neutral-100 text-neutral-800 border-neutral-200 tracking-normal',
      heading: 'text-black tracking-normal',
      text: 'text-black tracking-normal',
      mutedText: 'text-neutral-600 tracking-normal',
      border: 'border-neutral-200',
      card: 'bg-neutral-50 border-neutral-200 text-black tracking-normal',
      flatItem: 'bg-transparent border-neutral-200 text-black tracking-normal',
      iconContainer: 'bg-neutral-100 border-neutral-200 text-black',
      icon: 'text-black',
      mediaFrame: 'bg-neutral-50 border-neutral-200 text-black tracking-normal',
      mediaPlaceholderMuted: 'bg-neutral-100 border-neutral-200 text-neutral-600 tracking-normal',
    };
  }

  return {
    wrapper: 'bg-black text-white border-neutral-800 tracking-normal',
    eyebrow: 'text-neutral-400 tracking-normal',
    badge: 'bg-neutral-900 text-neutral-200 border-neutral-800 tracking-normal',
    heading: 'text-white tracking-normal',
    text: 'text-white tracking-normal',
    mutedText: 'text-neutral-400 tracking-normal',
    border: 'border-neutral-800',
    card: 'bg-neutral-950 border-neutral-800 text-white tracking-normal',
    flatItem: 'bg-transparent border-neutral-800 text-white tracking-normal',
    iconContainer: 'bg-neutral-900 border-neutral-800 text-white',
    icon: 'text-white',
    mediaFrame: 'bg-neutral-950 border-neutral-800 text-white tracking-normal',
    mediaPlaceholderMuted: 'bg-neutral-900 border-neutral-800 text-neutral-400 tracking-normal',
  };
}

/**
 * Delegates feature CTA button styling to the shared monochrome CTA utility.
 */
export function getFeatureButtonClasses(
  variant: CTAButtonVariant,
  theme: 'light' | 'dark'
): string {
  return getCTAButtonClasses(variant, theme);
}

/**
 * Maps configured column count to responsive Tailwind CSS grid classes, defaulting to 3 columns.
 */
export function getFeatureGridClass(columns: 2 | 3 | 4 | (number & {})): string {
  switch (columns) {
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    case 3:
    default:
      return 'grid-cols-1 md:grid-cols-3';
  }
}

export const FEATURE_ICON_NAMES: readonly FeatureIconName[] = [
  'sparkles',
  'shield',
  'zap',
  'layers',
  'globe',
  'lock',
  'users',
  'bar-chart',
  'check-circle',
];

const FEATURE_ICON_MAP: Record<FeatureIconName, LucideIcon> = {
  sparkles: Sparkles,
  shield: Shield,
  zap: Zap,
  layers: Layers,
  globe: Globe,
  lock: Lock,
  users: Users,
  'bar-chart': BarChart,
  'check-circle': CheckCircle,
};

function normalizeFeatureIconName(icon?: string | null): FeatureIconName | undefined {
  if (typeof icon !== 'string') {
    return undefined;
  }

  switch (icon.trim().toLowerCase()) {
    case 'sparkles':
      return 'sparkles';
    case 'shield':
      return 'shield';
    case 'zap':
      return 'zap';
    case 'layers':
      return 'layers';
    case 'globe':
      return 'globe';
    case 'lock':
      return 'lock';
    case 'users':
      return 'users';
    case 'bar-chart':
      return 'bar-chart';
    case 'check-circle':
      return 'check-circle';
    default:
      return undefined;
  }
}

/**
 * Resolves a feature icon key to its Lucide component, falling back to CheckCircle.
 */
export function getFeatureIcon(icon?: FeatureIconName | (string & {}) | null): LucideIcon {
  const normalized = normalizeFeatureIconName(icon);
  return normalized ? FEATURE_ICON_MAP[normalized] : CheckCircle;
}

export const DEFAULT_FEATURE1_DATA: Feature1Props = {
  theme: 'light',
  layout: {
    padding: '64px',
  },
  eyebrow: 'Capabilities',
  heading: 'Built for clarity and dependable execution',
  description:
    'Structured practices and clear coordination keep complex work moving forward without unnecessary friction.',
  columns: 3,
  cardMode: 'card',
  items: [
    {
      icon: 'shield',
      title: 'Dedicated Oversight',
      description:
        'Every engagement is guided by senior leadership accountable for standards and outcomes.',
    },
    {
      icon: 'layers',
      title: 'Structured Workflows',
      description:
        'Clear milestones and documented handoffs keep each stage organized and predictable.',
    },
    {
      icon: 'users',
      title: 'Direct Collaboration',
      description:
        'Work directly with the specialists managing your matter without unnecessary intermediaries.',
    },
    {
      icon: 'bar-chart',
      title: 'Measured Progress',
      description:
        'Concise status reporting tracks deliverables, timelines, and budget alignment accurately.',
    },
    {
      icon: 'lock',
      title: 'Confidential Handling',
      description:
        'Sensitive records and communications remain protected under strict access controls.',
    },
    {
      icon: 'check-circle',
      title: 'Consistent Delivery',
      description:
        'Tested review checkpoints maintain quality from initial intake through final completion.',
    },
  ],
};

export const DEFAULT_FEATURE2_DATA: Feature2Props = {
  theme: 'dark',
  layout: {
    padding: '64px',
  },
  badge: 'Platform Overview',
  heading: 'Structured oversight across every stage',
  description:
    'Coordinate teams, documentation, and critical deadlines in one disciplined environment built for accountability.',
  mediaPosition: 'right',
  items: [
    {
      icon: 'sparkles',
      title: 'Focused Intake',
      description: 'Capture objectives, key documents, and stakeholder priorities from day one.',
    },
    {
      icon: 'zap',
      title: 'Timely Turnaround',
      description: 'Respond promptly to shifting requirements with clear ownership at every step.',
    },
    {
      icon: 'globe',
      title: 'Cross-Region Alignment',
      description: 'Keep distributed teams working from a single, reliable source of record.',
    },
  ],
  ctaButton: {
    text: 'Learn More',
    href: '/services',
    target: '_self',
    variant: 'primary',
  },
};

function normalizeOptionalText(value?: string | null): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const UNSAFE_URI_SCHEME_PATTERN = /^(?:javascript|data|vbscript):/i;
const URI_SCHEME_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/**
 * Validates and trims image URLs/paths, rejecting unsafe schemes, control characters, and malformed URLs.
 */
export function sanitizeFeatureImageUrl(rawUrl?: string | null): string | undefined {
  if (typeof rawUrl !== 'string') {
    return undefined;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return undefined;
  }

  const hasControlChar = Array.from(trimmed).some((char) => {
    const code = char.charCodeAt(0);
    return code <= 0x1f || code === 0x7f;
  });
  if (hasControlChar) {
    return undefined;
  }

  const schemeCheckTarget = Array.from(trimmed)
    .filter((char) => !/\s/.test(char))
    .join('');

  if (UNSAFE_URI_SCHEME_PATTERN.test(schemeCheckTarget)) {
    return undefined;
  }

  if (trimmed.startsWith('//')) {
    if (trimmed.length <= 2 || trimmed.startsWith('///')) {
      return undefined;
    }
    try {
      const parsed = new URL(`https:${trimmed}`);
      return parsed.hostname.length > 0 ? trimmed : undefined;
    } catch {
      return undefined;
    }
  }

  if (URI_SCHEME_PATTERN.test(schemeCheckTarget)) {
    if (!/^https?:\/\//i.test(trimmed)) {
      return undefined;
    }
    try {
      const parsed = new URL(trimmed);
      if (
        (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') ||
        parsed.hostname.length === 0
      ) {
        return undefined;
      }
      return trimmed;
    } catch {
      return undefined;
    }
  }

  return trimmed;
}

/**
 * Filters and normalizes feature items, omitting blank or invalid icon keys.
 */
export function resolveFeatureItems(
  items?: (Partial<FeatureItem> | null | undefined)[] | null
): FeatureItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const resolved: FeatureItem[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const description = typeof item.description === 'string' ? item.description.trim() : '';
    if (title.length === 0 || description.length === 0) {
      continue;
    }

    const normalized: FeatureItem = { title, description };
    const normalizedIcon = normalizeFeatureIconName(
      typeof item.icon === 'string' ? item.icon : undefined
    );
    if (normalizedIcon !== undefined) {
      normalized.icon = normalizedIcon;
    }

    resolved.push(normalized);
  }

  return resolved;
}

export interface ResolvedFeature1Props {
  theme: 'dark' | 'light';
  themeClasses: FeatureThemeClasses;
  layout: LayoutFieldProps;
  eyebrow?: string;
  heading: string;
  description?: string;
  columns: 2 | 3 | 4;
  gridClass: string;
  cardMode: 'card' | 'flat';
  items: FeatureItem[];
}

export interface ResolvedFeature2Props {
  theme: 'dark' | 'light';
  themeClasses: FeatureThemeClasses;
  layout: LayoutFieldProps;
  badge?: string;
  heading: string;
  description?: string;
  items: FeatureItem[];
  mediaPosition: 'left' | 'right';
  imageUrl?: string;
  imageAlt?: string;
  ctaButton?: ResolvedCTAButton;
  ctaButtonClasses?: string;
}

interface FeatureBaseDefaults {
  theme: 'dark' | 'light';
  layout: LayoutFieldProps;
  heading: string;
  description?: string;
  items: FeatureItem[];
}

function resolveFeatureTheme(
  theme: string | undefined,
  fallback: 'dark' | 'light'
): 'dark' | 'light' {
  return theme === 'light' || theme === 'dark' ? theme : fallback;
}

function resolveFeatureBaseProps(
  props: Partial<Pick<Feature1Props, 'theme' | 'layout' | 'heading' | 'description' | 'items'>>,
  defaults: FeatureBaseDefaults
) {
  const theme = resolveFeatureTheme(props.theme, defaults.theme);
  const themeClasses = getFeatureThemeClasses(theme);
  const layout: LayoutFieldProps =
    typeof props.layout?.padding === 'string' && props.layout.padding.length > 0
      ? { padding: props.layout.padding }
      : { ...defaults.layout };
  const heading = normalizeOptionalText(props.heading) ?? defaults.heading;
  const description =
    props.description === undefined
      ? defaults.description
      : normalizeOptionalText(props.description);
  const items = resolveFeatureItems(props.items === undefined ? defaults.items : props.items);

  return {
    theme,
    themeClasses,
    layout,
    heading,
    description,
    items,
  };
}

function resolveFeatureColumns(columns: unknown): 2 | 3 | 4 {
  return columns === 2 || columns === 3 || columns === 4 ? columns : DEFAULT_FEATURE1_DATA.columns;
}

function resolveFeatureCardMode(cardMode: unknown): 'card' | 'flat' {
  return cardMode === 'card' || cardMode === 'flat' ? cardMode : DEFAULT_FEATURE1_DATA.cardMode;
}

function resolveFeatureMediaPosition(mediaPosition: unknown): 'left' | 'right' {
  return mediaPosition === 'left' || mediaPosition === 'right'
    ? mediaPosition
    : DEFAULT_FEATURE2_DATA.mediaPosition;
}

function resolveOptionalFeatureCTA(
  button: CTAButtonProps | undefined,
  defaultButton: CTAButtonProps | undefined,
  theme: 'light' | 'dark'
): { button: ResolvedCTAButton; classes: string } | undefined {
  const resolved =
    button === undefined
      ? resolveCTAButton(defaultButton, undefined, 'primary')
      : resolveCTAButton(button, undefined, 'primary');

  if (!resolved.text) {
    return undefined;
  }

  return {
    button: resolved,
    classes: getFeatureButtonClasses(resolved.variant, theme),
  };
}

/**
 * Normalizes Feature1 props with defaults, enum fallbacks, and pure monochrome theme tokens.
 */
export function resolveFeature1Props(props: Partial<Feature1Props>): ResolvedFeature1Props {
  const base = resolveFeatureBaseProps(props, DEFAULT_FEATURE1_DATA);
  const eyebrow =
    props.eyebrow === undefined
      ? DEFAULT_FEATURE1_DATA.eyebrow
      : normalizeOptionalText(props.eyebrow);
  const columns = resolveFeatureColumns(props.columns);
  const gridClass = getFeatureGridClass(columns);
  const cardMode = resolveFeatureCardMode(props.cardMode);

  const resolved: ResolvedFeature1Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    heading: base.heading,
    columns,
    gridClass,
    cardMode,
    items: base.items,
  };

  if (eyebrow !== undefined) {
    resolved.eyebrow = eyebrow;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }

  return resolved;
}

/**
 * Normalizes Feature2 props with defaults, URL sanitization, optional CTA resolution, and theme tokens.
 */
export function resolveFeature2Props(props: Partial<Feature2Props>): ResolvedFeature2Props {
  const base = resolveFeatureBaseProps(props, DEFAULT_FEATURE2_DATA);
  const badge =
    props.badge === undefined ? DEFAULT_FEATURE2_DATA.badge : normalizeOptionalText(props.badge);
  const mediaPosition = resolveFeatureMediaPosition(props.mediaPosition);
  const imageUrl = sanitizeFeatureImageUrl(props.imageUrl);
  const imageAlt = normalizeOptionalText(props.imageAlt);
  const ctaResolved = resolveOptionalFeatureCTA(
    props.ctaButton,
    DEFAULT_FEATURE2_DATA.ctaButton,
    base.theme
  );

  const resolved: ResolvedFeature2Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    heading: base.heading,
    items: base.items,
    mediaPosition,
  };

  if (badge !== undefined) {
    resolved.badge = badge;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }
  if (imageUrl !== undefined) {
    resolved.imageUrl = imageUrl;
  }
  if (imageAlt !== undefined) {
    resolved.imageAlt = imageAlt;
  }
  if (ctaResolved !== undefined) {
    resolved.ctaButton = ctaResolved.button;
    resolved.ctaButtonClasses = ctaResolved.classes;
  }

  return resolved;
}
