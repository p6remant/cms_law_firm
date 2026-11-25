import { createLucideIcon, Globe, type LucideIcon } from 'lucide-react';
import type {
  FooterColumn,
  FooterLinkItem,
  FooterMultiColumnProps,
  FooterSplitProps,
  LayoutFieldProps,
  OfficeLocationItem,
  SocialLinkItem,
  SocialPlatform,
} from '../types';

export { Globe, type LucideIcon };

export interface FooterThemeClasses {
  wrapper: string;
  heading: string;
  text: string;
  mutedText: string;
  link: string;
  border: string;
  badge: string;
  disclaimer: string;
}

export function getFooterThemeClasses(theme: 'light' | 'dark'): FooterThemeClasses {
  if (theme === 'light') {
    return {
      wrapper: 'bg-stone-50 text-stone-900 border-stone-200',
      heading: 'text-stone-950 font-serif tracking-tight',
      text: 'text-stone-900',
      mutedText: 'text-stone-600',
      link: 'text-stone-600 hover:text-stone-950 transition-colors',
      border: 'border-stone-200',
      badge: 'bg-stone-100 text-stone-700 border-stone-200',
      disclaimer: 'text-stone-600 border-stone-200',
    };
  }

  return {
    wrapper: 'bg-zinc-950 text-zinc-100 border-zinc-800',
    heading: 'text-white font-serif tracking-tight',
    text: 'text-zinc-100',
    mutedText: 'text-zinc-400',
    link: 'text-zinc-300 hover:text-white transition-colors',
    border: 'border-zinc-800',
    badge: 'bg-zinc-900 text-zinc-300 border-zinc-700/60',
    disclaimer: 'text-zinc-400 border-zinc-800/80',
  };
}

/**
 * Custom bespoke Lucide-compatible icons for major social/professional networks.
 */
export const Linkedin: LucideIcon = createLucideIcon('Linkedin', [
  [
    'path',
    {
      d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
      key: 'p1',
    },
  ],
  ['rect', { width: '4', height: '12', x: '2', y: '9', key: 'r1' }],
  ['circle', { cx: '4', cy: '4', r: '2', key: 'c1' }],
]);

export const Twitter: LucideIcon = createLucideIcon('Twitter', [
  [
    'path',
    {
      d: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
      key: 'p1',
    },
  ],
]);

export const Facebook: LucideIcon = createLucideIcon('Facebook', [
  [
    'path',
    {
      d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
      key: 'p1',
    },
  ],
]);

export const Youtube: LucideIcon = createLucideIcon('Youtube', [
  [
    'path',
    {
      d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17',
      key: 'p1',
    },
  ],
  ['path', { d: 'm10 15 5-3-5-3z', key: 'p2' }],
]);

export const Instagram: LucideIcon = createLucideIcon('Instagram', [
  [
    'rect',
    {
      width: '20',
      height: '20',
      x: '2',
      y: '2',
      rx: '5',
      ry: '5',
      key: 'r1',
    },
  ],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: 'p1' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'l1' }],
]);

export const Github: LucideIcon = createLucideIcon('Github', [
  [
    'path',
    {
      d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
      key: 'p1',
    },
  ],
  ['path', { d: 'M9 18c-4.51 2-5-2-7-2', key: 'p2' }],
]);

export function getSocialIcon(platform?: SocialPlatform | (string & {})): LucideIcon {
  if (!platform) {
    return Globe;
  }

  const normalized = platform.toLowerCase().trim();
  switch (normalized) {
    case 'linkedin':
      return Linkedin;
    case 'twitter':
      return Twitter;
    case 'facebook':
      return Facebook;
    case 'youtube':
      return Youtube;
    case 'instagram':
      return Instagram;
    case 'github':
      return Github;
    default:
      return Globe;
  }
}

/**
 * Determines whether a given URL is external.
 * Returns true for absolute URLs ('https://', 'http://', '//').
 * Returns false for internal anchors, relative paths, 'mailto:', 'tel:'.
 */
export function isExternalLink(href?: string | null): boolean {
  if (!href) {
    return false;
  }
  const trimmed = href.trim();
  if (!trimmed) {
    return false;
  }
  return /^(?:https?:)?\/\//i.test(trimmed);
}

export const DEFAULT_FOOTER_MULTI_COLUMN_DATA: FooterMultiColumnProps = {
  theme: 'dark',
  layout: {
    padding: '64px',
  },
  firmName: 'Vanguard & Sterling LLP',
  tagline: 'Global Counsel. Uncompromising Excellence.',
  description:
    'Premier international legal counsel providing strategic representation in complex corporate transactions, high-stakes litigation, and regulatory compliance across global jurisdictions.',
  offices: [
    {
      city: 'New York',
      address: '767 Fifth Avenue, 38th Floor, New York, NY 10153',
      phone: '+1 (212) 555-0190',
      email: 'newyork@vanguardsterling.law',
    },
    {
      city: 'London',
      address: '100 Bishopsgate, Level 24, London EC2N 4AG, United Kingdom',
      phone: '+44 20 7946 0910',
      email: 'london@vanguardsterling.law',
    },
    {
      city: 'San Francisco',
      address: '555 California Street, Suite 4200, San Francisco, CA 94104',
      phone: '+1 (415) 555-0142',
      email: 'sanfrancisco@vanguardsterling.law',
    },
  ],
  columns: [
    {
      title: 'Practices',
      links: [
        { label: 'Corporate & M&A', href: '/practices/corporate' },
        { label: 'Securities & Capital Markets', href: '/practices/securities' },
        { label: 'Antitrust & Competition', href: '/practices/antitrust' },
        { label: 'Commercial Litigation', href: '/practices/litigation' },
        { label: 'Intellectual Property', href: '/practices/ip' },
      ],
    },
    {
      title: 'Industries',
      links: [
        { label: 'Technology & AI', href: '/industries/technology', badge: 'Active' },
        { label: 'Financial Institutions', href: '/industries/financial' },
        { label: 'Life Sciences & Healthcare', href: '/industries/healthcare' },
        { label: 'Energy & Infrastructure', href: '/industries/energy' },
      ],
    },
    {
      title: 'The Firm',
      links: [
        { label: 'About Vanguard & Sterling', href: '/about' },
        { label: 'Partners & Counsel', href: '/attorneys' },
        { label: 'Global Offices', href: '/locations' },
        { label: 'Pro Bono & Community', href: '/pro-bono' },
        { label: 'Diversity & Inclusion', href: '/diversity' },
      ],
    },
    {
      title: 'Client Resources',
      links: [
        { label: 'Legal Insights & Briefs', href: '/insights' },
        { label: 'SEC Regulatory Briefings', href: '/briefings', isExternal: true },
        { label: 'Client Portal', href: 'https://portal.vanguardsterling.law', isExternal: true },
        { label: 'Careers & Summer Program', href: '/careers' },
      ],
    },
  ],
  socialLinks: [
    {
      platform: 'linkedin',
      href: 'https://www.linkedin.com/company/vanguard-sterling',
      label: 'LinkedIn',
    },
    { platform: 'twitter', href: 'https://x.com/vanguardlaw', label: 'X (Twitter)' },
    {
      platform: 'facebook',
      href: 'https://facebook.com/vanguardsterling',
      label: 'Facebook',
    },
    {
      platform: 'youtube',
      href: 'https://youtube.com/@vanguardsterling',
      label: 'YouTube',
    },
  ],
  copyrightNotice: '© 2026 Vanguard & Sterling LLP. All rights reserved.',
  legalDisclaimer:
    'ATTORNEY ADVERTISING. Prior results do not guarantee a similar outcome. The materials on this website are provided for general informational purposes only and do not constitute formal legal advice. No attorney-client relationship is formed through the use or transmission of information via this website.',
  regulatoryNotice:
    'Licensed by the State Bar of California and New York State Unified Court System. Authorized and regulated by the Solicitors Regulation Authority (SRA ID: 684201).',
};

export const DEFAULT_FOOTER_SPLIT_DATA: FooterSplitProps = {
  theme: 'dark',
  layout: {
    padding: '64px',
  },
  firmName: 'Vanguard & Sterling LLP',
  tagline: 'Global Counsel. Uncompromising Excellence.',
  statementQuote:
    'Precision in jurisprudence, vigilance in defense. We counsel industry leaders through pivotal transformations and decisive courtroom disputes.',
  statementAuthor: 'Vanguard & Sterling LLP — Executive Committee',
  primaryEmail: 'contact@vanguardsterling.law',
  primaryPhone: '+1 (212) 555-0190',
  primaryAddress: '767 Fifth Avenue, 38th Floor, New York, NY 10153',
  links: [
    { label: 'Practices', href: '/practices' },
    { label: 'Attorneys', href: '/attorneys' },
    { label: 'Insights', href: '/insights' },
    { label: 'Offices', href: '/locations' },
    { label: 'Client Portal', href: 'https://portal.vanguardsterling.law', isExternal: true },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Engagement', href: '/terms' },
  ],
  socialLinks: [
    {
      platform: 'linkedin',
      href: 'https://www.linkedin.com/company/vanguard-sterling',
      label: 'LinkedIn',
    },
    { platform: 'twitter', href: 'https://x.com/vanguardlaw', label: 'X (Twitter)' },
    {
      platform: 'github',
      href: 'https://github.com/vanguardsterling',
      label: 'GitHub',
    },
  ],
  copyrightNotice: '© 2026 Vanguard & Sterling LLP. All rights reserved.',
  legalDisclaimer:
    'ATTORNEY ADVERTISING. Prior results do not guarantee a similar outcome. The information presented on this site is not formal legal advice. Communication through this website does not establish an attorney-client relationship.',
  showBackToTop: true,
};

export interface ResolvedFooterLink {
  label: string;
  href: string;
  isExternal: boolean;
  target?: '_blank';
  rel?: 'noopener noreferrer';
  badge?: string;
}

export interface ResolvedOfficeLocation {
  city: string;
  address: string;
  phone: string;
  email?: string;
  phoneHref: string | null;
  emailHref: string | null;
}

export interface ResolvedFooterColumn {
  title: string;
  links: ResolvedFooterLink[];
}

export interface ResolvedSocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface ResolvedFooterMultiColumn {
  theme: 'dark' | 'light';
  themeClasses: FooterThemeClasses;
  layout: LayoutFieldProps;
  firmName: string;
  monogram: string;
  tagline?: string;
  logoUrl?: string;
  description?: string;
  offices: ResolvedOfficeLocation[];
  columns: ResolvedFooterColumn[];
  socialLinks: ResolvedSocialLink[];
  copyrightNotice?: string;
  legalDisclaimer?: string;
  regulatoryNotice?: string;
}

const FIRM_NAME_STOP_WORDS = new Set([
  '&',
  'and',
  'of',
  'the',
  'llp',
  'llc',
  'pllc',
  'pc',
  'pa',
  'lp',
  'inc',
  'ltd',
]);

function normalizeOptionalText(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function resolveFooterLink(item: FooterLinkItem): ResolvedFooterLink {
  const label = item.label.trim();
  const trimmedHref = item.href.trim();
  const href = trimmedHref || '#';
  const isExternal = Boolean(item.isExternal) || isExternalLink(href);
  const badge = normalizeOptionalText(item.badge);

  const resolved: ResolvedFooterLink = {
    label,
    href,
    isExternal,
  };

  if (isExternal) {
    resolved.target = '_blank';
    resolved.rel = 'noopener noreferrer';
  }

  if (badge !== undefined) {
    resolved.badge = badge;
  }

  return resolved;
}

export function formatPhoneHref(phone?: string | null): string | null {
  if (!phone) {
    return null;
  }

  const trimmed = phone.trim();
  if (!trimmed) {
    return null;
  }

  const hasPlus = trimmed.startsWith('+');
  const stripped = (hasPlus ? trimmed.slice(1) : trimmed).replace(/[\s\-().]/g, '');
  const digits = stripped.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  return `tel:${hasPlus ? '+' : ''}${digits}`;
}

export function formatEmailHref(email?: string | null): string | null {
  if (!email) {
    return null;
  }

  const trimmed = email.trim();
  if (!trimmed || !trimmed.includes('@')) {
    return null;
  }

  return `mailto:${trimmed}`;
}

export function getFirmMonogram(firmName?: string | null): string {
  if (!firmName) {
    return 'LF';
  }

  const rawWords = firmName
    .trim()
    .split(/[\s,&/]+/)
    .map((word) => word.replace(/[^a-zA-Z]/g, ''))
    .filter((word) => word.length > 0);

  if (rawWords.length === 0) {
    return 'LF';
  }

  const meaningfulWords = rawWords.filter((word) => !FIRM_NAME_STOP_WORDS.has(word.toLowerCase()));
  const words = meaningfulWords.length > 0 ? meaningfulWords : rawWords;

  const first = words[0];
  const second = words[1];

  if (first && second) {
    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  }

  if (first) {
    return first.slice(0, 2).toUpperCase();
  }

  return 'LF';
}

function resolveOfficeLocation(office: OfficeLocationItem): ResolvedOfficeLocation | null {
  const city = office.city.trim();
  const address = office.address.trim();
  const phone = office.phone.trim();
  const email = normalizeOptionalText(office.email);

  if (!city && !address && !phone && email === undefined) {
    return null;
  }

  const resolved: ResolvedOfficeLocation = {
    city,
    address,
    phone,
    phoneHref: formatPhoneHref(phone),
    emailHref: formatEmailHref(email),
  };

  if (email !== undefined) {
    resolved.email = email;
  }

  return resolved;
}

function resolveFooterColumn(column: FooterColumn): ResolvedFooterColumn | null {
  const title = column.title.trim();
  const links = column.links
    .filter((link) => link.label.trim().length > 0 || link.href.trim().length > 0)
    .map(resolveFooterLink);

  if (!title && links.length === 0) {
    return null;
  }

  return {
    title,
    links,
  };
}

function resolveSocialLink(item: SocialLinkItem): ResolvedSocialLink | null {
  const href = item.href.trim();
  if (!href) {
    return null;
  }

  return {
    platform: item.platform,
    href,
    label: item.label?.trim() || item.platform,
    icon: getSocialIcon(item.platform),
  };
}

export function resolveFooterMultiColumnProps(
  props: Partial<FooterMultiColumnProps>
): ResolvedFooterMultiColumn {
  const theme: 'dark' | 'light' = props.theme === 'light' ? 'light' : 'dark';
  const themeClasses = getFooterThemeClasses(theme);
  const layout = props.layout ?? DEFAULT_FOOTER_MULTI_COLUMN_DATA.layout;
  const firmName = props.firmName?.trim() || DEFAULT_FOOTER_MULTI_COLUMN_DATA.firmName;
  const monogram = getFirmMonogram(firmName);

  const tagline = normalizeOptionalText(props.tagline);
  const logoUrl = normalizeOptionalText(props.logoUrl);
  const description = normalizeOptionalText(props.description);
  const copyrightNotice = normalizeOptionalText(props.copyrightNotice);
  const legalDisclaimer = normalizeOptionalText(props.legalDisclaimer);
  const regulatoryNotice = normalizeOptionalText(props.regulatoryNotice);

  const offices = (props.offices ?? [])
    .map(resolveOfficeLocation)
    .filter((office): office is ResolvedOfficeLocation => office !== null);

  const columns = (props.columns ?? [])
    .map(resolveFooterColumn)
    .filter((column): column is ResolvedFooterColumn => column !== null);

  const socialLinks = (props.socialLinks ?? [])
    .map(resolveSocialLink)
    .filter((item): item is ResolvedSocialLink => item !== null);

  const resolved: ResolvedFooterMultiColumn = {
    theme,
    themeClasses,
    layout,
    firmName,
    monogram,
    offices,
    columns,
    socialLinks,
  };

  if (tagline !== undefined) {
    resolved.tagline = tagline;
  }
  if (logoUrl !== undefined) {
    resolved.logoUrl = logoUrl;
  }
  if (description !== undefined) {
    resolved.description = description;
  }
  if (copyrightNotice !== undefined) {
    resolved.copyrightNotice = copyrightNotice;
  }
  if (legalDisclaimer !== undefined) {
    resolved.legalDisclaimer = legalDisclaimer;
  }
  if (regulatoryNotice !== undefined) {
    resolved.regulatoryNotice = regulatoryNotice;
  }

  return resolved;
}
