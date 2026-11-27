import { type Config, type Data, type RichText, type Slot } from '@puckeditor/core';

export type SpacingValue = '0px' | '8px' | '16px' | '24px' | '32px' | '48px' | '64px' | '96px';

export type LayoutFieldProps = {
  padding: SpacingValue;
};

export type WithLayout<T> = T & {
  layout: LayoutFieldProps;
};

export type TextAlign = 'left' | 'center' | 'right';

export type HeroProps = WithLayout<{
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  align: TextAlign;
  theme: 'dark' | 'light';
}>;

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQContactCTAProps = {
  title?: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  buttonTarget?: '_self' | '_blank';
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
};

export type FAQ1Props = WithLayout<{
  theme: 'dark' | 'light';
  eyebrow?: string;
  heading: string;
  description?: string;
  items: FAQItem[];
  defaultOpenIndex?: number;
  allowMultipleOpen?: boolean;
}>;

export type FAQ2Props = WithLayout<{
  theme: 'dark' | 'light';
  badge?: string;
  heading: string;
  description?: string;
  items: FAQItem[];
  contactCta?: FAQContactCTAProps;
  defaultOpenIndex?: number;
  allowMultipleOpen?: boolean;
}>;

export type LogoItem = {
  name: string;
};

export type LogosProps = WithLayout<{
  heading: string;
  logos: LogoItem[];
}>;

export type StatItem = {
  value: string;
  label: string;
  description?: string;
};

export type Stats1Props = WithLayout<{
  theme: 'dark' | 'light';
  items: StatItem[];
}>;

export type Stats2Props = WithLayout<{
  theme: 'dark' | 'light';
  items: StatItem[];
}>;

export type GridProps = WithLayout<{
  columns: 2 | 3 | 4;
  gap: number;
  items: Slot;
}>;

export type FlexProps = WithLayout<{
  direction: 'row' | 'column';
  justify: 'start' | 'center' | 'between';
  gap: number;
  items: Slot;
}>;

export type SpaceProps = {
  size: SpacingValue;
  direction: 'vertical' | 'horizontal';
};

export type HeadingProps = WithLayout<{
  title: string;
  level: 'h1' | 'h2' | 'h3';
  align: TextAlign;
}>;

export type TextProps = WithLayout<{
  content: string;
  align: TextAlign;
  size: 'sm' | 'base' | 'lg';
}>;

export type RichTextProps = WithLayout<{
  richtext: RichText;
}>;

export type ButtonProps = WithLayout<{
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  align: TextAlign;
}>;

export type MapLocationMode = 'coordinates' | 'link';
export type MapHeight = 'sm' | 'md' | 'lg' | 'full';
export type MapAspectRatio = 'auto' | '16/9' | '4/3' | '1/1';

export type MapProps = WithLayout<{
  title: string;
  eyebrow?: string;
  description?: string;
  address?: string;
  locationMode: MapLocationMode;
  latitude: number | string;
  longitude: number | string;
  googleMapsUrl?: string;
  zoom: number;
  height: MapHeight;
  aspectRatio: MapAspectRatio;
  showDirectionsButton: boolean;
  directionsButtonLabel: string;
  theme: 'dark' | 'light';
}>;

export type FormFieldWidth = 'full' | 'half';
export type InputFieldType = 'text' | 'email' | 'tel' | 'number';
export type FormButtonVariant = 'primary' | 'secondary' | 'outline';
export type SelectOption = { label: string; value: string };

export type InputFieldProps = {
  name: string;
  label: string;
  type: InputFieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  width: FormFieldWidth;
};

export type TextareaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  helperText?: string;
  width: FormFieldWidth;
};

export type SelectFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  options: string;
  required?: boolean;
  helperText?: string;
  width: FormFieldWidth;
};

export type FormButtonProps = {
  label: string;
  variant: FormButtonVariant;
  width: FormFieldWidth | 'auto';
  align: TextAlign;
};

export type FormProps = WithLayout<{
  title?: string;
  description?: string;
  submitEndpoint?: string;
  submitMethod: 'POST' | 'GET';
  successMessage?: string;
  errorMessage?: string;
  theme: 'dark' | 'light';
  fields: Slot;
}>;

export type SocialPlatform =
  'linkedin' | 'twitter' | 'facebook' | 'youtube' | 'instagram' | 'github' | 'pinterest';

export type SocialLinkItem = {
  platform: SocialPlatform;
  href: string;
  label?: string;
};

export type FooterLinkItem = {
  label: string;
  href: string;
  isExternal?: boolean;
  badge?: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLinkItem[];
};

export type OfficeLocationItem = {
  city: string;
  address: string;
  phone: string;
  email?: string;
};

export type FooterSplitProps = WithLayout<{
  theme: 'dark' | 'light';
  statementQuote: string;
  statementAuthor?: string;
  firmName: string;
  tagline?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  primaryAddress?: string;
  links?: FooterLinkItem[];
  socialLinks?: SocialLinkItem[];
  copyrightNotice?: string;
  legalDisclaimer?: string;
  showBackToTop?: boolean;
}>;

export type FooterSimpleProps = WithLayout<{
  theme: 'dark' | 'light';
  logoText?: string;
  brandName?: string;
  brandSubtitle?: string;
  logoUrl?: string;
  description?: string;
  socialLinks?: SocialLinkItem[];
  contactTitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  linkColumns?: FooterColumn[];
  copyrightNotice?: string;
  bottomLinks?: FooterLinkItem[];
}>;

export type Footer2Props = WithLayout<{
  theme: 'dark' | 'light';
  logoText?: string;
  logoUrl?: string;
  brandSubtitle?: string;
  description?: string;
  showNewsletter?: boolean;
  newsletterHeading?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  linkColumns?: FooterColumn[];
  contactTitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLinkItem[];
  copyrightNotice?: string;
  bottomLinks?: FooterLinkItem[];
  showBackToTop?: boolean;
}>;

export type CTAButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export type CTAActionType = 'newsletter' | 'button';

export type CTAButtonProps = {
  text: string;
  href?: string;
  target?: '_self' | '_blank';
  variant?: CTAButtonVariant;
};

export type CTA1Props = WithLayout<{
  theme: 'dark' | 'light';
  actionType?: CTAActionType;
  eyebrow?: string;
  heading: string;
  description?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  newsletterButtonVariant?: CTAButtonVariant;
  disclaimer?: string;
  primaryButton?: CTAButtonProps;
  secondaryButton?: CTAButtonProps;
}>;

export type CTAFeatureItem = {
  text: string;
};

export type CTA2Props = WithLayout<{
  theme: 'dark' | 'light';
  badge?: string;
  heading: string;
  description?: string;
  features?: CTAFeatureItem[];
  primaryButton?: CTAButtonProps;
  secondaryButton?: CTAButtonProps;
}>;
export type ScrollDirection = 'left' | 'right';
export type TeamImageShape = 'rounded' | 'square' | 'rectangle';

export type NavItem = {
  label: string;
};

export type HeaderProps = WithLayout<{
  brandName: string;
  logoUrl?: string;
  navItems: NavItem[];
  ctaLabel: string;
  showCta: boolean;
  sticky: boolean;
  theme: 'light' | 'dark';
}>;

export type HeroSlideItem = {
  badge?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  bgImage?: string;
};

export type HeroSliderProps = WithLayout<{
  slides: HeroSlideItem[];
  autoScroll: boolean;
  autoScrollInterval: number;
  scrollDirection: ScrollDirection;
  showArrows: boolean;
  showDots: boolean;
  align: TextAlign;
  theme: 'dark' | 'light';
}>;

export type TeamMemberItem = {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
};

export type TeamSliderProps = WithLayout<{
  eyebrow?: string;
  title: string;
  description?: string;
  imageShape: TeamImageShape;
  members: TeamMemberItem[];
  cardsPerView: 2 | 3 | 4;
  autoScroll: boolean;
  autoScrollInterval: number;
  scrollDirection: ScrollDirection;
  showArrows: boolean;
  showDots: boolean;
  theme: 'light' | 'dark';
}>;

export type ClientPartnerItem = {
  name: string;
  imageUrl?: string;
};

export type ClientPartnerProps = WithLayout<{
  title: string;
  items: ClientPartnerItem[];
  columns: 3 | 4;
  theme: 'light' | 'dark';
}>;

export type FeatureIconName =
  | 'sparkles'
  | 'shield'
  | 'zap'
  | 'layers'
  | 'globe'
  | 'lock'
  | 'users'
  | 'bar-chart'
  | 'check-circle';

export type FeatureItem = {
  icon?: FeatureIconName;
  title: string;
  description: string;
};

export type Feature1Props = WithLayout<{
  theme: 'dark' | 'light';
  eyebrow?: string;
  heading: string;
  description?: string;
  columns: 2 | 3 | 4;
  cardMode: 'card' | 'flat';
  items: FeatureItem[];
}>;

export type Feature2Props = WithLayout<{
  theme: 'dark' | 'light';
  badge?: string;
  heading: string;
  description?: string;
  items: FeatureItem[];
  mediaPosition: 'left' | 'right';
  imageUrl?: string;
  imageAlt?: string;
  ctaButton?: CTAButtonProps;
}>;

export type EditorComponentProps = {
  Header: HeaderProps;
  Hero: HeroProps;
  HeroSlider: HeroSliderProps;
  TeamSection: TeamSliderProps;
  ClientPartnerSection: ClientPartnerProps;
  Logos: LogosProps;
  Grid: GridProps;
  Flex: FlexProps;
  Space: SpaceProps;
  Heading: HeadingProps;
  Text: TextProps;
  RichText: RichTextProps;
  Button: ButtonProps;
  Map: MapProps;
  Form: FormProps;
  InputField: InputFieldProps;
  TextareaField: TextareaFieldProps;
  SelectField: SelectFieldProps;
  FormButton: FormButtonProps;
  FooterSimple: FooterSimpleProps;
  Footer2: Footer2Props;
  CTA1: CTA1Props;
  CTA2: CTA2Props;
  FAQ1: FAQ1Props;
  FAQ2: FAQ2Props;
  Stats1: Stats1Props;
  Stats2: Stats2Props;
  Feature1: Feature1Props;
  Feature2: Feature2Props;
};

export type PuckConfig = Omit<Config<EditorComponentProps>, 'components'> & {
  components: Partial<Config<EditorComponentProps>['components']>;
};
export type PuckPageData = Data<EditorComponentProps>;
