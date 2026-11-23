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

export type CardIconName = 'sparkles' | 'lock' | 'cloud' | 'git-branch' | 'users' | 'book-open';

export type CardProps = WithLayout<{
  title: string;
  description: string;
  icon: CardIconName;
  mode: 'card' | 'flat';
}>;

export type FeatureGridProps = WithLayout<{
  title: string;
  description: string;
  columns: 2 | 3 | 4;
  cardMode: 'card' | 'flat';
  cards: Slot;
}>;

export type CTAProps = WithLayout<{
  heading: string;
  description: string;
  buttonLabel: string;
  theme: 'dark' | 'light';
}>;

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQProps = WithLayout<{
  title: string;
  description: string;
  items: FAQItem[];
}>;

export type StepItem = {
  title: string;
  description: string;
};

export type StepsProps = WithLayout<{
  title: string;
  description: string;
  steps: StepItem[];
}>;

export type FeatureSplitProps = WithLayout<{
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  imagePosition: 'left' | 'right';
}>;

export type BentoItem = {
  title: string;
  description: string;
  span: 'normal' | 'wide';
};

export type BentoProps = WithLayout<{
  title: string;
  description: string;
  items: BentoItem[];
}>;

export type LogoItem = {
  name: string;
};

export type LogosProps = WithLayout<{
  heading: string;
  logos: LogoItem[];
}>;

export type StatItem = {
  label: string;
  value: string;
};

export type StatsProps = WithLayout<{
  title: string;
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

export type TemplateProps = WithLayout<{
  templateName: string;
  children: Slot;
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

export type EditorComponentProps = {
  Hero: HeroProps;
  FeatureGrid: FeatureGridProps;
  Card: CardProps;
  CTA: CTAProps;
  FAQ: FAQProps;
  Steps: StepsProps;
  FeatureSplit: FeatureSplitProps;
  Bento: BentoProps;
  Logos: LogosProps;
  Stats: StatsProps;
  Grid: GridProps;
  Flex: FlexProps;
  Space: SpaceProps;
  Heading: HeadingProps;
  Text: TextProps;
  RichText: RichTextProps;
  Button: ButtonProps;
  Template: TemplateProps;
};

export type PuckConfig = Config<EditorComponentProps>;
export type PuckPageData = Data<EditorComponentProps>;
