import type {
  CTAButtonProps,
  CTAButtonVariant,
  FAQ1Props,
  FAQ2Props,
  FAQContactCTAProps,
  FAQItem,
  LayoutFieldProps,
} from '../types.ts';
import { getCTAButtonClasses, resolveCTAButton } from './cta-utils.ts';

export interface FAQThemeClasses {
  wrapper: string;
  heading: string;
  text: string;
  mutedText: string;
  border: string;
  itemBorder: string;
  badge: string;
  chevron: string;
  contactCard: string;
  contactButton: string;
}

export function getFAQThemeClasses(theme: 'light' | 'dark'): FAQThemeClasses {
  if (theme === 'light') {
    return {
      wrapper: 'bg-white text-black border-neutral-200 tracking-normal',
      heading: 'text-black tracking-normal',
      text: 'text-black tracking-normal',
      mutedText: 'text-neutral-600 tracking-normal',
      border: 'border-neutral-200',
      itemBorder: 'border-neutral-200',
      badge: 'bg-neutral-100 text-neutral-800 border-neutral-200 tracking-normal',
      chevron: 'text-neutral-600',
      contactCard: 'bg-neutral-50 border-neutral-200 text-black tracking-normal',
      contactButton: getCTAButtonClasses('primary', 'light'),
    };
  }

  return {
    wrapper: 'bg-black text-white border-neutral-800 tracking-normal',
    heading: 'text-white tracking-normal',
    text: 'text-white tracking-normal',
    mutedText: 'text-neutral-400 tracking-normal',
    border: 'border-neutral-800',
    itemBorder: 'border-neutral-800',
    badge: 'bg-neutral-900 text-neutral-200 border-neutral-800 tracking-normal',
    chevron: 'text-neutral-400',
    contactCard: 'bg-neutral-950 border-neutral-800 text-white tracking-normal',
    contactButton: getCTAButtonClasses('primary', 'dark'),
  };
}

export function getFAQButtonClasses(variant: CTAButtonVariant, theme: 'light' | 'dark'): string {
  return getCTAButtonClasses(variant, theme);
}

export const DEFAULT_FAQ1_DATA: FAQ1Props = {
  theme: 'light',
  layout: {
    padding: '64px',
  },
  eyebrow: 'FAQ',
  heading: 'Frequently asked questions',
  description:
    'Find clear answers to common questions about getting started, project timelines, and how we work together.',
  items: [
    {
      question: 'How do we get started?',
      answer:
        'Reach out through our contact form or schedule an introductory call. We review your goals and outline the next steps within one business day.',
    },
    {
      question: 'What happens during an initial consultation?',
      answer:
        'We discuss your objectives, review any relevant background materials, and clarify priorities so you leave with a practical path forward.',
    },
    {
      question: 'What are your typical timelines?',
      answer:
        'Every engagement follows an agreed milestone schedule shared upfront, with clear check-ins at each stage so you always know what comes next.',
    },
    {
      question: 'How is pricing structured?',
      answer:
        'We provide transparent proposals before any work begins, offering fixed-fee packages for defined scopes or structured retainers for ongoing support.',
    },
    {
      question: 'Can we adjust the scope if our needs change?',
      answer:
        'Yes. Whenever priorities shift, we review any timeline or fee updates with you in advance before making changes to the plan.',
    },
  ],
  defaultOpenIndex: 0,
  allowMultipleOpen: false,
};

export const DEFAULT_FAQ2_DATA: FAQ2Props = {
  theme: 'dark',
  layout: {
    padding: '64px',
  },
  badge: 'FAQ',
  heading: 'Answers to common questions',
  description:
    'Explore key details about our process, communication standards, and how we support clients from initial inquiry through delivery.',
  items: [
    {
      question: 'Who will I work with day to day?',
      answer:
        'You are paired with a dedicated point of contact who coordinates every stage of the engagement and keeps communication straightforward.',
    },
    {
      question: 'How quickly can an engagement begin?',
      answer:
        'Once scope and terms are confirmed, onboarding typically begins within a few business days using a shared kickoff checklist.',
    },
    {
      question: 'How do you handle confidentiality and sensitive records?',
      answer:
        'All client documents are managed under strict access controls and confidentiality protocols from the moment they are shared.',
    },
    {
      question: 'What level of ongoing reporting is included?',
      answer:
        'You receive concise status updates tied to agreed milestones along with direct access for questions between scheduled check-ins.',
    },
    {
      question: 'Can we start with a focused initial phase?',
      answer:
        'Yes. Many clients begin with an initial assessment or single phase before expanding into a broader long-term engagement.',
    },
  ],
  contactCta: {
    title: 'Still have questions?',
    description:
      'Cannot find the answer you are looking for? Reach out to our team for personalized guidance.',
    buttonText: 'Contact Us',
    buttonHref: '/contact',
    buttonTarget: '_self',
    buttonVariant: 'primary',
  },
  defaultOpenIndex: 0,
  allowMultipleOpen: false,
};

function normalizeOptionalText(value?: string | null): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function resolveFAQTheme(theme: string | undefined, fallback: 'dark' | 'light'): 'dark' | 'light' {
  return theme === 'light' || theme === 'dark' ? theme : fallback;
}

function resolveDefaultOpenIndex(
  defaultOpenIndex: number | undefined,
  itemCount: number,
  fallbackIndex: number | undefined
): number | undefined {
  if (itemCount <= 0) {
    return undefined;
  }
  const candidate = defaultOpenIndex === undefined ? fallbackIndex : defaultOpenIndex;
  if (typeof candidate !== 'number' || !Number.isInteger(candidate)) {
    return undefined;
  }
  if (candidate < 0 || candidate >= itemCount) {
    return undefined;
  }
  return candidate;
}

export function resolveFAQItems(items?: (Partial<FAQItem> | null | undefined)[] | null): FAQItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const resolved: FAQItem[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const question = typeof item.question === 'string' ? item.question.trim() : '';
    const answer = typeof item.answer === 'string' ? item.answer.trim() : '';
    if (question.length > 0 && answer.length > 0) {
      resolved.push({ question, answer });
    }
  }

  return resolved;
}

export interface ResolvedFAQContactCTA {
  title?: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  buttonTarget: '_self' | '_blank';
  isExternal: boolean;
  rel?: 'noopener noreferrer';
  buttonVariant: CTAButtonVariant;
  buttonClasses: string;
}

export function resolveFAQContactCTA(
  contactCta: Partial<FAQContactCTAProps> | undefined,
  theme: 'light' | 'dark' = 'dark'
): ResolvedFAQContactCTA | undefined {
  if (!contactCta || typeof contactCta !== 'object') {
    return undefined;
  }

  const title = normalizeOptionalText(contactCta.title);
  const description = normalizeOptionalText(contactCta.description);

  const buttonInput: CTAButtonProps = {
    text: typeof contactCta.buttonText === 'string' ? contactCta.buttonText : '',
  };
  if (typeof contactCta.buttonHref === 'string') {
    buttonInput.href = contactCta.buttonHref;
  }
  if (contactCta.buttonTarget !== undefined) {
    buttonInput.target = contactCta.buttonTarget;
  }
  if (contactCta.buttonVariant !== undefined) {
    buttonInput.variant = contactCta.buttonVariant;
  }

  const resolvedButton = resolveCTAButton(buttonInput, undefined, 'primary');
  if (!title && !description && !resolvedButton.text) {
    return undefined;
  }

  const resolved: ResolvedFAQContactCTA = {
    buttonText: resolvedButton.text,
    buttonHref: resolvedButton.href,
    buttonTarget: resolvedButton.target,
    isExternal: resolvedButton.isExternal,
    buttonVariant: resolvedButton.variant,
    buttonClasses: getFAQButtonClasses(resolvedButton.variant, theme),
  };

  if (title !== undefined) {
    resolved.title = title;
  }
  if (description !== undefined) {
    resolved.description = description;
  }
  if (resolvedButton.rel !== undefined) {
    resolved.rel = resolvedButton.rel;
  }

  return resolved;
}

export interface ResolvedFAQ1Props {
  theme: 'dark' | 'light';
  themeClasses: FAQThemeClasses;
  layout: LayoutFieldProps;
  eyebrow?: string;
  heading: string;
  description?: string;
  items: FAQItem[];
  defaultOpenIndex?: number;
  allowMultipleOpen: boolean;
}

export interface ResolvedFAQ2Props {
  theme: 'dark' | 'light';
  themeClasses: FAQThemeClasses;
  layout: LayoutFieldProps;
  badge?: string;
  heading: string;
  description?: string;
  items: FAQItem[];
  contactCta?: ResolvedFAQContactCTA;
  defaultOpenIndex?: number;
  allowMultipleOpen: boolean;
}

interface FAQBaseDefaults {
  theme: 'dark' | 'light';
  layout: LayoutFieldProps;
  heading: string;
  description?: string;
  items: FAQItem[];
  defaultOpenIndex?: number;
  allowMultipleOpen?: boolean;
}

function resolveFAQBaseProps(
  props: Partial<
    Pick<
      FAQ1Props,
      | 'theme'
      | 'layout'
      | 'heading'
      | 'description'
      | 'items'
      | 'defaultOpenIndex'
      | 'allowMultipleOpen'
    >
  >,
  defaults: FAQBaseDefaults
) {
  const theme = resolveFAQTheme(props.theme, defaults.theme);
  const themeClasses = getFAQThemeClasses(theme);
  const layout: LayoutFieldProps = props.layout?.padding
    ? { padding: props.layout.padding }
    : { ...defaults.layout };
  const heading = normalizeOptionalText(props.heading) ?? defaults.heading;
  const description =
    props.description === undefined
      ? defaults.description
      : normalizeOptionalText(props.description);
  const items = resolveFAQItems(props.items === undefined ? defaults.items : props.items);
  const defaultOpenIndex = resolveDefaultOpenIndex(
    props.defaultOpenIndex,
    items.length,
    defaults.defaultOpenIndex
  );
  const allowMultipleOpen =
    typeof props.allowMultipleOpen === 'boolean'
      ? props.allowMultipleOpen
      : Boolean(defaults.allowMultipleOpen);

  return {
    theme,
    themeClasses,
    layout,
    heading,
    description,
    items,
    defaultOpenIndex,
    allowMultipleOpen,
  };
}

export function resolveFAQ1Props(props: Partial<FAQ1Props>): ResolvedFAQ1Props {
  const base = resolveFAQBaseProps(props, DEFAULT_FAQ1_DATA);
  const eyebrow =
    props.eyebrow === undefined ? DEFAULT_FAQ1_DATA.eyebrow : normalizeOptionalText(props.eyebrow);

  const resolved: ResolvedFAQ1Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    heading: base.heading,
    items: base.items,
    allowMultipleOpen: base.allowMultipleOpen,
  };

  if (eyebrow !== undefined) {
    resolved.eyebrow = eyebrow;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }
  if (base.defaultOpenIndex !== undefined) {
    resolved.defaultOpenIndex = base.defaultOpenIndex;
  }

  return resolved;
}

export function resolveFAQ2Props(props: Partial<FAQ2Props>): ResolvedFAQ2Props {
  const base = resolveFAQBaseProps(props, DEFAULT_FAQ2_DATA);
  const badge =
    props.badge === undefined ? DEFAULT_FAQ2_DATA.badge : normalizeOptionalText(props.badge);
  const contactCta = resolveFAQContactCTA(
    props.contactCta === undefined ? DEFAULT_FAQ2_DATA.contactCta : props.contactCta,
    base.theme
  );

  const resolved: ResolvedFAQ2Props = {
    theme: base.theme,
    themeClasses: base.themeClasses,
    layout: base.layout,
    heading: base.heading,
    items: base.items,
    allowMultipleOpen: base.allowMultipleOpen,
  };

  if (badge !== undefined) {
    resolved.badge = badge;
  }
  if (base.description !== undefined) {
    resolved.description = base.description;
  }
  if (contactCta !== undefined) {
    resolved.contactCta = contactCta;
  }
  if (base.defaultOpenIndex !== undefined) {
    resolved.defaultOpenIndex = base.defaultOpenIndex;
  }

  return resolved;
}
