import type {
  CTAButtonProps,
  CTAButtonVariant,
  LayoutFieldProps,
  StatItem,
  Stats1Props,
  Stats2Props,
  StatsActionCTAProps,
} from '../types.ts';
import { getCTAButtonClasses, resolveCTAButton } from './cta-utils.ts';

export interface StatsThemeClasses {
  wrapper: string;
  eyebrow: string;
  badge: string;
  heading: string;
  text: string;
  mutedText: string;
  border: string;
  divider: string;
  card: string;
  value: string;
  label: string;
  actionButton: string;
}

export function getStatsThemeClasses(theme: 'light' | 'dark'): StatsThemeClasses {
  if (theme === 'light') {
    return {
      wrapper: 'bg-white text-black border-neutral-200 tracking-normal',
      eyebrow: 'text-neutral-600 tracking-normal',
      badge: 'bg-neutral-100 text-neutral-800 border-neutral-200 tracking-normal',
      heading: 'text-black tracking-normal',
      text: 'text-black tracking-normal',
      mutedText: 'text-neutral-600 tracking-normal',
      border: 'border-neutral-200',
      divider: 'border-neutral-200 divide-neutral-200',
      card: 'bg-neutral-50 border-neutral-200 text-black tracking-normal',
      value: 'text-black tracking-normal',
      label: 'text-black tracking-normal',
      actionButton: getCTAButtonClasses('primary', 'light'),
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
    divider: 'border-neutral-800 divide-neutral-800',
    card: 'bg-neutral-950 border-neutral-800 text-white tracking-normal',
    value: 'text-white tracking-normal',
    label: 'text-white tracking-normal',
    actionButton: getCTAButtonClasses('primary', 'dark'),
  };
}

export function getStatsButtonClasses(variant: CTAButtonVariant, theme: 'light' | 'dark'): string {
  return getCTAButtonClasses(variant, theme);
}

export function getStatsStripGridClass(itemCount: number): string {
  if (itemCount <= 1 || Number.isNaN(itemCount)) {
    return 'grid-cols-1';
  }
  if (itemCount === 2) {
    return 'grid-cols-1 sm:grid-cols-2';
  }
  if (itemCount === 3) {
    return 'grid-cols-1 md:grid-cols-3';
  }
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
}

export function getStatsCardGridClass(itemCount: number): string {
  if (itemCount <= 1 || Number.isNaN(itemCount)) {
    return 'grid-cols-1';
  }
  return 'grid-cols-1 sm:grid-cols-2';
}

export const DEFAULT_STATS1_DATA: Stats1Props = {
  theme: 'light',
  layout: {
    padding: '64px',
  },
  eyebrow: 'Key Figures',
  heading: 'Measured performance across every engagement',
  description:
    'Consistent standards, transparent reporting, and dependable outcomes delivered for organizations worldwide.',
  items: [
    {
      value: '99.4%',
      label: 'Client Retention',
      description: 'Long-term partnerships sustained across multi-year engagements.',
    },
    {
      value: '$2.4B',
      label: 'Managed Volume',
      description: 'Complex transactions and strategic initiatives guided end to end.',
    },
    {
      value: '48 hrs',
      label: 'Initial Turnaround',
      description: 'Structured scope review and milestone plan delivered promptly.',
    },
    {
      value: '30+',
      label: 'Years of Practice',
      description: 'Senior leadership directly involved at every stage of delivery.',
    },
  ],
};

export const DEFAULT_STATS2_DATA: Stats2Props = {
  theme: 'dark',
  layout: {
    padding: '64px',
  },
  badge: 'Track Record',
  heading: 'Proven impact backed by measurable results',
  description:
    'Our teams pair disciplined preparation with responsive execution so every partner moves forward with clarity.',
  actionCta: {
    text: 'Schedule a Consultation',
    href: '/contact',
    target: '_self',
    variant: 'primary',
  },
  items: [
    {
      value: '1,200+',
      label: 'Completed Engagements',
      description: 'Delivered on schedule across regional and international markets.',
    },
    {
      value: '96%',
      label: 'Milestone Accuracy',
      description: 'Projects completed within agreed timelines and transparent budgets.',
    },
    {
      value: '24/7',
      label: 'Dedicated Access',
      description: 'Direct coordination with your assigned leadership team.',
    },
    {
      value: '18',
      label: 'Global Offices',
      description: 'Coordinated cross-border support wherever operations scale.',
    },
  ],
};

function normalizeOptionalText(value?: string | null): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function resolveStatsTheme(
  theme: string | undefined,
  fallback: 'dark' | 'light'
): 'dark' | 'light' {
  return theme === 'light' || theme === 'dark' ? theme : fallback;
}

export function resolveStatItems(
  items?: (Partial<StatItem> | null | undefined)[] | null
): StatItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const resolved: StatItem[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const value = typeof item.value === 'string' ? item.value.trim() : '';
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    if (value.length === 0 || label.length === 0) {
      continue;
    }
    const description = normalizeOptionalText(item.description);
    const normalized: StatItem = { value, label };
    if (description !== undefined) {
      normalized.description = description;
    }
    resolved.push(normalized);
  }

  return resolved;
}

export interface ResolvedStatsActionCTA {
  text: string;
  href: string;
  target: '_self' | '_blank';
  isExternal: boolean;
  rel?: 'noopener noreferrer';
  variant: CTAButtonVariant;
  classes: string;
}

export function resolveStatsActionCTA(
  cta: Partial<StatsActionCTAProps> | undefined,
  theme: 'light' | 'dark' = 'dark'
): ResolvedStatsActionCTA | undefined {
  if (!cta || typeof cta !== 'object') {
    return undefined;
  }

  const buttonInput: CTAButtonProps = {
    text: typeof cta.text === 'string' ? cta.text : '',
  };
  if (typeof cta.href === 'string') {
    buttonInput.href = cta.href;
  }
  if (cta.target !== undefined) {
    buttonInput.target = cta.target;
  }
  if (cta.variant !== undefined) {
    buttonInput.variant = cta.variant;
  }

  const resolvedButton = resolveCTAButton(buttonInput, undefined, 'primary');
  if (!resolvedButton.text) {
    return undefined;
  }

  const resolved: ResolvedStatsActionCTA = {
    text: resolvedButton.text,
    href: resolvedButton.href,
    target: resolvedButton.target,
    isExternal: resolvedButton.isExternal,
    variant: resolvedButton.variant,
    classes: getStatsButtonClasses(resolvedButton.variant, theme),
  };

  if (resolvedButton.rel !== undefined) {
    resolved.rel = resolvedButton.rel;
  }

  return resolved;
}

export interface ResolvedStats1Props {
  theme: 'dark' | 'light';
  themeClasses: StatsThemeClasses;
  layout: LayoutFieldProps;
  eyebrow?: string;
  heading?: string;
  description?: string;
  items: StatItem[];
}

export interface ResolvedStats2Props {
  theme: 'dark' | 'light';
  themeClasses: StatsThemeClasses;
  layout: LayoutFieldProps;
  badge?: string;
  heading: string;
  description?: string;
  actionCta?: ResolvedStatsActionCTA;
  items: StatItem[];
}

interface StatsBaseDefaults {
  theme: 'dark' | 'light';
  layout: LayoutFieldProps;
  description?: string;
  items: StatItem[];
}

function resolveStatsBaseProps(
  props: Partial<Pick<Stats1Props, 'theme' | 'layout' | 'description' | 'items'>>,
  defaults: StatsBaseDefaults
) {
  const theme = resolveStatsTheme(props.theme, defaults.theme);
  const themeClasses = getStatsThemeClasses(theme);
  const layout: LayoutFieldProps = props.layout?.padding
    ? { padding: props.layout.padding }
    : { ...defaults.layout };
  const description =
    props.description === undefined
      ? defaults.description
      : normalizeOptionalText(props.description);
  const items = resolveStatItems(props.items === undefined ? defaults.items : props.items);

  return {
    theme,
    themeClasses,
    layout,
    description,
    items,
  };
}

export function resolveStats1Props(props: Partial<Stats1Props>): ResolvedStats1Props {
  const base = resolveStatsBaseProps(props, DEFAULT_STATS1_DATA);
  const eyebrow =
    props.eyebrow === undefined
      ? DEFAULT_STATS1_DATA.eyebrow
      : normalizeOptionalText(props.eyebrow);
  const heading =
    props.heading === undefined
      ? DEFAULT_STATS1_DATA.heading
      : normalizeOptionalText(props.heading);

  const resolved: ResolvedStats1Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    items: base.items,
  };

  if (eyebrow !== undefined) {
    resolved.eyebrow = eyebrow;
  }
  if (heading !== undefined) {
    resolved.heading = heading;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }

  return resolved;
}

export function resolveStats2Props(props: Partial<Stats2Props>): ResolvedStats2Props {
  const base = resolveStatsBaseProps(props, DEFAULT_STATS2_DATA);
  const badge =
    props.badge === undefined ? DEFAULT_STATS2_DATA.badge : normalizeOptionalText(props.badge);
  const heading = normalizeOptionalText(props.heading) ?? DEFAULT_STATS2_DATA.heading;
  const actionCta = resolveStatsActionCTA(
    props.actionCta === undefined ? DEFAULT_STATS2_DATA.actionCta : props.actionCta,
    base.theme
  );

  const resolved: ResolvedStats2Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    heading,
    items: base.items,
  };

  if (badge !== undefined) {
    resolved.badge = badge;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }
  if (actionCta !== undefined) {
    resolved.actionCta = actionCta;
  }

  return resolved;
}
