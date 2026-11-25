import type {
  CTAActionType,
  CTA1Props,
  CTA2Props,
  CTAButtonProps,
  CTAButtonVariant,
  LayoutFieldProps,
} from '../types.ts';

export interface CTAThemeClasses {
  wrapper: string;
  surface: string;
  eyebrow: string;
  heading: string;
  text: string;
  mutedText: string;
  badge: string;
  border: string;
  input: string;
  disclaimer: string;
  featureIcon: string;
}

export function getCTAThemeClasses(theme: 'light' | 'dark'): CTAThemeClasses {
  if (theme === 'light') {
    return {
      wrapper: 'bg-white text-black border-neutral-200 tracking-normal',
      surface: 'bg-neutral-50 border-neutral-200 text-black tracking-normal',
      eyebrow: 'text-neutral-600 tracking-normal',
      heading: 'text-black tracking-normal',
      text: 'text-black tracking-normal',
      mutedText: 'text-neutral-600 tracking-normal',
      badge: 'bg-neutral-100 text-neutral-800 border-neutral-200 tracking-normal',
      border: 'border-neutral-200',
      input:
        'bg-white text-black border-neutral-300 placeholder:text-neutral-500 focus:border-black tracking-normal',
      disclaimer: 'text-neutral-600 tracking-normal',
      featureIcon: 'text-black',
    };
  }

  return {
    wrapper: 'bg-black text-white border-neutral-800 tracking-normal',
    surface: 'bg-neutral-950 border-neutral-800 text-white tracking-normal',
    eyebrow: 'text-neutral-400 tracking-normal',
    heading: 'text-white tracking-normal',
    text: 'text-white tracking-normal',
    mutedText: 'text-neutral-400 tracking-normal',
    badge: 'bg-neutral-900 text-neutral-200 border-neutral-800 tracking-normal',
    border: 'border-neutral-800',
    input:
      'bg-black text-white border-neutral-700 placeholder:text-neutral-500 focus:border-white tracking-normal',
    disclaimer: 'text-neutral-400 tracking-normal',
    featureIcon: 'text-white',
  };
}

const LIGHT_BUTTON_CLASSES: Record<CTAButtonVariant, string> = {
  primary:
    'bg-black text-white border border-black hover:bg-neutral-800 hover:border-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors tracking-normal',
  secondary:
    'bg-neutral-100 text-black border border-neutral-200 hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors tracking-normal',
  outline:
    'bg-transparent text-black border border-neutral-300 hover:bg-neutral-100 hover:border-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors tracking-normal',
  ghost:
    'bg-transparent text-black border border-transparent hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors tracking-normal',
};

const DARK_BUTTON_CLASSES: Record<CTAButtonVariant, string> = {
  primary:
    'bg-white text-black border border-white hover:bg-neutral-200 hover:border-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors tracking-normal',
  secondary:
    'bg-neutral-900 text-white border border-neutral-800 hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors tracking-normal',
  outline:
    'bg-transparent text-white border border-neutral-700 hover:bg-neutral-900 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors tracking-normal',
  ghost:
    'bg-transparent text-white border border-transparent hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors tracking-normal',
};

export function getCTAButtonClasses(variant: CTAButtonVariant, theme: 'light' | 'dark'): string {
  const classesByVariant = theme === 'light' ? LIGHT_BUTTON_CLASSES : DARK_BUTTON_CLASSES;

  switch (variant) {
    case 'secondary':
      return classesByVariant.secondary;
    case 'outline':
      return classesByVariant.outline;
    case 'ghost':
      return classesByVariant.ghost;
    case 'primary':
    default:
      return classesByVariant.primary;
  }
}

export interface ResolvedCTAButton {
  text: string;
  href: string;
  target: '_self' | '_blank';
  isExternal: boolean;
  rel?: 'noopener noreferrer';
  variant: CTAButtonVariant;
}

const UNSAFE_URI_SCHEME_PATTERN = /^(?:javascript|data|vbscript):/i;

export function isExternalUrl(href?: string | null): boolean {
  if (!href) {
    return false;
  }
  const trimmed = href.trim();
  if (!trimmed) {
    return false;
  }
  return /^(?:https?:)?\/\//i.test(trimmed);
}

function normalizeOptionalText(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeButtonVariantValue(value: string | undefined): CTAButtonVariant | undefined {
  switch (value) {
    case 'primary':
    case 'secondary':
    case 'outline':
    case 'ghost':
      return value;
    default:
      return undefined;
  }
}

function normalizeCTAButtonVariant(
  variant?: CTAButtonVariant,
  fallbackVariant?: CTAButtonVariant
): CTAButtonVariant {
  return (
    normalizeButtonVariantValue(variant) ??
    normalizeButtonVariantValue(fallbackVariant) ??
    'primary'
  );
}

function sanitizeCTAHref(rawHref?: string): string {
  const trimmed = rawHref?.trim() ?? '';
  if (!trimmed) {
    return '#';
  }
  const schemeCheckTarget = Array.from(trimmed)
    .filter((char) => char.charCodeAt(0) > 0x1f && !/\s/.test(char))
    .join('');
  if (UNSAFE_URI_SCHEME_PATTERN.test(schemeCheckTarget)) {
    return '#';
  }
  return trimmed;
}

export function resolveCTAButton(
  button?: CTAButtonProps,
  fallbackText?: string,
  fallbackVariant?: CTAButtonVariant
): ResolvedCTAButton {
  const text = normalizeOptionalText(button?.text) ?? normalizeOptionalText(fallbackText) ?? '';
  const href = sanitizeCTAHref(button?.href);
  const variant = normalizeCTAButtonVariant(button?.variant, fallbackVariant);

  let target: '_self' | '_blank';
  let isExternal: boolean;

  const explicitTarget: string | undefined = button?.target;
  if (explicitTarget === '_blank') {
    target = '_blank';
    isExternal = true;
  } else if (explicitTarget === '_self') {
    target = '_self';
    isExternal = false;
  } else {
    isExternal = isExternalUrl(href);
    target = isExternal ? '_blank' : '_self';
  }

  const resolved: ResolvedCTAButton = {
    text,
    href,
    target,
    isExternal,
    variant,
  };

  if (target === '_blank') {
    resolved.rel = 'noopener noreferrer';
  }

  return resolved;
}

export const DEFAULT_CTA1_DATA: CTA1Props = {
  theme: 'dark',
  layout: {
    padding: '64px',
  },
  actionType: 'newsletter',
  eyebrow: 'Newsletter',
  heading: 'Stay informed with our latest updates',
  description:
    'Subscribe to receive curated insights, announcements, and resources delivered directly to your inbox.',
  newsletterPlaceholder: 'Enter your email address',
  newsletterButtonText: 'Subscribe',
  newsletterButtonVariant: 'primary',
  disclaimer: 'We respect your privacy. Unsubscribe at any time.',
  primaryButton: {
    text: 'Get Started',
    href: '/contact',
    target: '_self',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Learn More',
    href: '/about',
    target: '_self',
    variant: 'outline',
  },
};

export const DEFAULT_CTA2_DATA: CTA2Props = {
  theme: 'light',
  layout: {
    padding: '64px',
  },
  badge: 'Get Started',
  heading: 'Ready to move forward together?',
  description:
    'Connect with our team to discuss your goals, explore tailored options, and take the next step with confidence.',
  features: [
    'Clear communication at every stage',
    'Tailored guidance for your objectives',
    'Dedicated support from start to finish',
  ],
  primaryButton: {
    text: 'Schedule a Call',
    href: '/contact',
    target: '_self',
    variant: 'primary',
  },
  secondaryButton: {
    text: 'Explore Services',
    href: '/services',
    target: '_self',
    variant: 'outline',
  },
};

export interface ResolvedCTA1Props {
  theme: 'dark' | 'light';
  themeClasses: CTAThemeClasses;
  layout: LayoutFieldProps;
  actionType: CTAActionType;
  eyebrow?: string;
  heading: string;
  description?: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterButtonVariant: CTAButtonVariant;
  newsletterButtonClasses: string;
  disclaimer?: string;
  primaryButton?: ResolvedCTAButton;
  primaryButtonClasses?: string;
  secondaryButton?: ResolvedCTAButton;
  secondaryButtonClasses?: string;
}

export interface ResolvedCTA2Props {
  theme: 'dark' | 'light';
  themeClasses: CTAThemeClasses;
  layout: LayoutFieldProps;
  badge?: string;
  heading: string;
  description?: string;
  features: string[];
  primaryButton?: ResolvedCTAButton;
  primaryButtonClasses?: string;
  secondaryButton?: ResolvedCTAButton;
  secondaryButtonClasses?: string;
}

function resolveCTATheme(theme: string | undefined, fallback: 'dark' | 'light'): 'dark' | 'light' {
  return theme === 'light' || theme === 'dark' ? theme : fallback;
}

function resolveCTAActionType(actionType: string | undefined): CTAActionType {
  if (actionType === 'button' || actionType === 'newsletter') {
    return actionType;
  }
  return DEFAULT_CTA1_DATA.actionType ?? 'newsletter';
}

function resolveOptionalCTAButton(
  button: CTAButtonProps | undefined,
  defaultButton: CTAButtonProps | undefined,
  fallbackText: string,
  fallbackVariant: CTAButtonVariant,
  theme: 'light' | 'dark'
): { button: ResolvedCTAButton; classes: string } | undefined {
  const resolved =
    button === undefined
      ? resolveCTAButton(defaultButton, fallbackText, fallbackVariant)
      : resolveCTAButton(button, undefined, fallbackVariant);

  if (!resolved.text) {
    return undefined;
  }

  return {
    button: resolved,
    classes: getCTAButtonClasses(resolved.variant, theme),
  };
}

export function resolveCTA1Props(props: Partial<CTA1Props>): ResolvedCTA1Props {
  const theme = resolveCTATheme(props.theme, DEFAULT_CTA1_DATA.theme);
  const themeClasses = getCTAThemeClasses(theme);
  const layout: LayoutFieldProps = props.layout?.padding
    ? { padding: props.layout.padding }
    : { ...DEFAULT_CTA1_DATA.layout };
  const actionType = resolveCTAActionType(props.actionType);
  const eyebrow =
    props.eyebrow === undefined ? DEFAULT_CTA1_DATA.eyebrow : normalizeOptionalText(props.eyebrow);
  const heading = normalizeOptionalText(props.heading) ?? DEFAULT_CTA1_DATA.heading;
  const description =
    props.description === undefined
      ? DEFAULT_CTA1_DATA.description
      : normalizeOptionalText(props.description);
  const newsletterPlaceholder =
    normalizeOptionalText(props.newsletterPlaceholder) ??
    DEFAULT_CTA1_DATA.newsletterPlaceholder ??
    'Enter your email address';
  const newsletterButtonText =
    normalizeOptionalText(props.newsletterButtonText) ??
    DEFAULT_CTA1_DATA.newsletterButtonText ??
    'Subscribe';
  const newsletterButtonVariant = normalizeCTAButtonVariant(
    props.newsletterButtonVariant,
    DEFAULT_CTA1_DATA.newsletterButtonVariant
  );
  const newsletterButtonClasses = getCTAButtonClasses(newsletterButtonVariant, theme);
  const disclaimer =
    props.disclaimer === undefined
      ? DEFAULT_CTA1_DATA.disclaimer
      : normalizeOptionalText(props.disclaimer);

  const primaryResolved = resolveOptionalCTAButton(
    props.primaryButton,
    DEFAULT_CTA1_DATA.primaryButton,
    'Get Started',
    'primary',
    theme
  );
  const secondaryResolved = resolveOptionalCTAButton(
    props.secondaryButton,
    DEFAULT_CTA1_DATA.secondaryButton,
    'Learn More',
    'outline',
    theme
  );

  const resolved: ResolvedCTA1Props = {
    theme,
    themeClasses,
    layout,
    actionType,
    heading,
    newsletterPlaceholder,
    newsletterButtonText,
    newsletterButtonVariant,
    newsletterButtonClasses,
  };

  if (eyebrow !== undefined) {
    resolved.eyebrow = eyebrow;
  }
  if (description !== undefined) {
    resolved.description = description;
  }
  if (disclaimer !== undefined) {
    resolved.disclaimer = disclaimer;
  }
  if (primaryResolved !== undefined) {
    resolved.primaryButton = primaryResolved.button;
    resolved.primaryButtonClasses = primaryResolved.classes;
  }
  if (secondaryResolved !== undefined) {
    resolved.secondaryButton = secondaryResolved.button;
    resolved.secondaryButtonClasses = secondaryResolved.classes;
  }

  return resolved;
}

export function resolveCTA2Props(props: Partial<CTA2Props>): ResolvedCTA2Props {
  const theme = resolveCTATheme(props.theme, DEFAULT_CTA2_DATA.theme);
  const themeClasses = getCTAThemeClasses(theme);
  const layout: LayoutFieldProps = props.layout?.padding
    ? { padding: props.layout.padding }
    : { ...DEFAULT_CTA2_DATA.layout };
  const badge =
    props.badge === undefined ? DEFAULT_CTA2_DATA.badge : normalizeOptionalText(props.badge);
  const heading = normalizeOptionalText(props.heading) ?? DEFAULT_CTA2_DATA.heading;
  const description =
    props.description === undefined
      ? DEFAULT_CTA2_DATA.description
      : normalizeOptionalText(props.description);

  const rawFeatures =
    props.features === undefined ? (DEFAULT_CTA2_DATA.features ?? []) : props.features;
  const features = rawFeatures
    .map((feature) => feature.trim())
    .filter((feature) => feature.length > 0);

  const primaryResolved = resolveOptionalCTAButton(
    props.primaryButton,
    DEFAULT_CTA2_DATA.primaryButton,
    'Schedule a Call',
    'primary',
    theme
  );
  const secondaryResolved = resolveOptionalCTAButton(
    props.secondaryButton,
    DEFAULT_CTA2_DATA.secondaryButton,
    'Explore Services',
    'outline',
    theme
  );

  const resolved: ResolvedCTA2Props = {
    theme,
    themeClasses,
    layout,
    heading,
    features,
  };

  if (badge !== undefined) {
    resolved.badge = badge;
  }
  if (description !== undefined) {
    resolved.description = description;
  }
  if (primaryResolved !== undefined) {
    resolved.primaryButton = primaryResolved.button;
    resolved.primaryButtonClasses = primaryResolved.classes;
  }
  if (secondaryResolved !== undefined) {
    resolved.secondaryButton = secondaryResolved.button;
    resolved.secondaryButtonClasses = secondaryResolved.classes;
  }

  return resolved;
}
