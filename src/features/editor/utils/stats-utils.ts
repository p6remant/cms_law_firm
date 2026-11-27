import type { LayoutFieldProps, StatItem, Stats1Props, Stats2Props } from '../types.ts';

export interface StatsThemeClasses {
  wrapper: string;
  text: string;
  mutedText: string;
  border: string;
  divider: string;
  card: string;
  value: string;
  label: string;
}

export function getStatsThemeClasses(theme: 'light' | 'dark'): StatsThemeClasses {
  if (theme === 'light') {
    return {
      wrapper: 'bg-white text-black border-neutral-200 tracking-normal',
      text: 'text-black tracking-normal',
      mutedText: 'text-neutral-600 tracking-normal',
      border: 'border-neutral-200',
      divider: 'border-neutral-200 divide-neutral-200',
      card: 'bg-neutral-50 border-neutral-200 text-black tracking-normal',
      value: 'text-black tracking-normal',
      label: 'text-black tracking-normal',
    };
  }

  return {
    wrapper: 'bg-black text-white border-neutral-800 tracking-normal',
    text: 'text-white tracking-normal',
    mutedText: 'text-neutral-400 tracking-normal',
    border: 'border-neutral-800',
    divider: 'border-neutral-800 divide-neutral-800',
    card: 'bg-neutral-950 border-neutral-800 text-white tracking-normal',
    value: 'text-white tracking-normal',
    label: 'text-white tracking-normal',
  };
}

function getResponsiveStatsGridClass(itemCount: number): string {
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

export function getStatsStripGridClass(itemCount: number): string {
  return getResponsiveStatsGridClass(itemCount);
}

export function getStatsCardGridClass(itemCount: number): string {
  return getResponsiveStatsGridClass(itemCount);
}

export const DEFAULT_STATS1_DATA: Stats1Props = {
  theme: 'light',
  layout: {
    padding: '64px',
  },
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

export interface ResolvedStats1Props {
  theme: 'dark' | 'light';
  themeClasses: StatsThemeClasses;
  layout: LayoutFieldProps;
  items: StatItem[];
}

export type ResolvedStats2Props = ResolvedStats1Props;

function resolveStatsProps(
  props: Partial<Stats1Props | Stats2Props>,
  defaults: Stats1Props | Stats2Props
): ResolvedStats1Props {
  const theme = resolveStatsTheme(props.theme, defaults.theme);
  const themeClasses = getStatsThemeClasses(theme);
  const layout: LayoutFieldProps = props.layout?.padding
    ? { padding: props.layout.padding }
    : { ...defaults.layout };
  const items = resolveStatItems(props.items === undefined ? defaults.items : props.items);

  return {
    theme,
    themeClasses,
    layout,
    items,
  };
}

export function resolveStats1Props(props: Partial<Stats1Props>): ResolvedStats1Props {
  return resolveStatsProps(props, DEFAULT_STATS1_DATA);
}

export function resolveStats2Props(props: Partial<Stats2Props>): ResolvedStats2Props {
  return resolveStatsProps(props, DEFAULT_STATS2_DATA);
}
