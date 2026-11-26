import { type ArrayField, type ObjectField } from '@puckeditor/core';
import { BookOpen, Cloud, GitBranch, Lock, Sparkles, Users } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { CTA1, CTA2 } from '@/features/editor/components/cta';
import { FAQ1 } from '@/features/editor/components/faq';
import { FieldTabs } from '@/features/editor/components/FieldTabs';
import { Footer2, FooterSimple } from '@/features/editor/components/footer';
import {
  FormButton,
  FormContainer,
  InputField,
  SelectField,
  TextareaField,
} from '@/features/editor/components/form';
import { MapBlock } from '@/features/editor/components/MapBlock';
import {
  ALIGN_OPTIONS,
  BUTTON_WIDTH_OPTIONS,
  DEFAULT_LAYOUT,
  FIELD_WIDTH_OPTIONS,
  FOOTER_THEME_OPTIONS,
  FORM_BUTTON_VARIANT_OPTIONS,
  FORM_METHOD_OPTIONS,
  FORM_THEME_OPTIONS,
  getGridColumnsClass,
  getTextAlignClass,
  INPUT_TYPE_OPTIONS,
  layoutField,
  MAP_ASPECT_RATIO_OPTIONS,
  MAP_HEIGHT_OPTIONS,
  MAP_LOCATION_MODE_OPTIONS,
  MAP_THEME_OPTIONS,
  SOCIAL_PLATFORM_OPTIONS,
  SPACING_OPTIONS,
} from '@/features/editor/config/field-options';
import {
  type CardIconName,
  type CTAActionType,
  type CTAButtonProps,
  type CTAButtonVariant,
  type CTAFeatureItem,
  type FAQItem,
  type FooterColumn,
  type FooterLinkItem,
  type PuckConfig,
  type PuckPageData,
  type SocialLinkItem,
} from '@/features/editor/types';
import { DEFAULT_CTA1_DATA, DEFAULT_CTA2_DATA } from '@/features/editor/utils/cta-utils';
import { DEFAULT_FAQ1_DATA } from '@/features/editor/utils/faq-utils';
import {
  DEFAULT_FOOTER_2_DATA,
  DEFAULT_FOOTER_SIMPLE_DATA,
} from '@/features/editor/utils/footer-utils';

function renderCardIcon(icon: CardIconName) {
  const iconClass = 'h-4 w-4 text-slate-900';
  switch (icon) {
    case 'lock':
      return <Lock className={iconClass} />;
    case 'cloud':
      return <Cloud className={iconClass} />;
    case 'git-branch':
      return <GitBranch className={iconClass} />;
    case 'users':
      return <Users className={iconClass} />;
    case 'book-open':
      return <BookOpen className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
}

const footerSocialLinksField: ArrayField<SocialLinkItem[]> = {
  type: 'array',
  label: 'Social Icons',
  getItemSummary: (item) => item.label || item.platform,
  defaultItemProps: {
    platform: 'facebook',
    href: 'https://facebook.com',
    label: 'Facebook',
  },
  arrayFields: {
    platform: {
      type: 'select',
      label: 'Platform',
      options: SOCIAL_PLATFORM_OPTIONS,
    },
    href: { type: 'text', label: 'Profile URL' },
    label: { type: 'text', label: 'Accessible Label (Optional)' },
  },
};

const footerLinkColumnsField: ArrayField<FooterColumn[]> = {
  type: 'array',
  label: 'Link Columns',
  getItemSummary: (item) => item.title || 'Link Column',
  defaultItemProps: {
    title: 'Links',
    links: [{ label: 'New Link', href: '#', isExternal: false }],
  },
  arrayFields: {
    title: { type: 'text', label: 'Column Title (Optional)' },
    links: {
      type: 'array',
      label: 'Links',
      getItemSummary: (item) => item.label || 'Link',
      defaultItemProps: {
        label: 'New Link',
        href: '#',
        isExternal: false,
      },
      arrayFields: {
        label: { type: 'text', label: 'Link Label' },
        href: { type: 'text', label: 'URL / Path' },
        isExternal: {
          type: 'radio',
          label: 'Open in New Tab',
          options: [
            { label: 'Auto', value: false },
            { label: 'External', value: true },
          ],
        },
      },
    },
  },
};

const footerBottomLinksField: ArrayField<FooterLinkItem[]> = {
  type: 'array',
  label: 'Bottom Bar Links',
  getItemSummary: (item) => item.label || 'Link',
  defaultItemProps: {
    label: 'Link',
    href: '#',
    isExternal: false,
  },
  arrayFields: {
    label: { type: 'text', label: 'Link Label' },
    href: { type: 'text', label: 'URL / Path' },
    isExternal: {
      type: 'radio',
      label: 'Open in New Tab',
      options: [
        { label: 'Auto', value: false },
        { label: 'External', value: true },
      ],
    },
  },
};

const CTA_THEME_OPTIONS: { label: string; value: 'dark' | 'light' }[] = [
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
];

const CTA_ACTION_TYPE_OPTIONS: { label: string; value: CTAActionType }[] = [
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'Buttons', value: 'button' },
];

const CTA_BUTTON_VARIANT_OPTIONS: { label: string; value: CTAButtonVariant }[] = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
];

const CTA_TARGET_OPTIONS: { label: string; value: '_self' | '_blank' }[] = [
  { label: 'Same Tab (_self)', value: '_self' },
  { label: 'New Tab (_blank)', value: '_blank' },
];

function createCTAButtonField(label: string): ObjectField<CTAButtonProps> {
  return {
    type: 'object',
    label,
    collapsible: true,
    defaultExpanded: true,
    objectFields: {
      text: { type: 'text', label: 'Button Text' },
      href: { type: 'text', label: 'Link URL / Path' },
      target: { type: 'radio', label: 'Open Target', options: CTA_TARGET_OPTIONS },
      variant: { type: 'select', label: 'Button Variant', options: CTA_BUTTON_VARIANT_OPTIONS },
    },
  };
}

const ctaFeaturesField: ArrayField<CTAFeatureItem[]> = {
  type: 'array',
  label: 'Feature Highlights',
  getItemSummary: (item) => item.text || 'Feature',
  defaultItemProps: {
    text: 'Dedicated support from start to finish',
  },
  arrayFields: {
    text: { type: 'text', label: 'Feature Text' },
  },
};

const FAQ_THEME_OPTIONS: { label: string; value: 'dark' | 'light' }[] = [
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
];

const FAQ_ALLOW_MULTIPLE_OPTIONS: { label: string; value: boolean }[] = [
  { label: 'Single', value: false },
  { label: 'Multiple', value: true },
];

const faqItemsField: ArrayField<FAQItem[]> = {
  type: 'array',
  label: 'FAQ Items',
  getItemSummary: (item) => item.question || 'FAQ Item',
  defaultItemProps: {
    question: 'New question?',
    answer: 'Provide a clear, concise answer here.',
  },
  arrayFields: {
    question: { type: 'text', label: 'Question' },
    answer: { type: 'textarea', label: 'Answer' },
  },
};

export const puckConfig: PuckConfig = {
  categories: {
    introduction: {
      title: 'Introduction',
      components: ['Hero'],
    },
    content: {
      title: 'Content',
      components: ['FeatureGrid', 'Card', 'Steps', 'FeatureSplit', 'Bento', 'CTA1', 'CTA2', 'FAQ1'],
    },
    socialProof: {
      title: 'Social Proof',
      components: ['Logos', 'Stats'],
    },
    layout: {
      title: 'Layout',
      components: ['Grid', 'Flex', 'Space'],
    },
    typography: {
      title: 'Typography',
      components: ['Heading', 'Text', 'RichText'],
    },
    interactive: {
      title: 'Actions',
      components: ['Button', 'Map'],
    },
    forms: {
      title: 'Forms',
      components: ['Form', 'InputField', 'SelectField', 'TextareaField', 'FormButton'],
    },
    navigation: {
      title: 'Navigation & Footers',
      components: ['FooterSimple', 'Footer2'],
    },
    other: {
      title: 'Other',
      components: ['Template'],
    },
  },
  components: {
    Hero: {
      label: 'Hero',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        heading: { type: 'text', label: 'Heading' },
        subheading: { type: 'textarea', label: 'Subheading' },
        ctaLabel: { type: 'text', label: 'Button label' },
        align: { type: 'radio', label: 'Alignment', options: ALIGN_OPTIONS },
        theme: {
          type: 'radio',
          label: 'Theme',
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ],
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.eyebrow}
              {fields.heading}
              {fields.subheading}
              {fields.ctaLabel}
            </>
          }
          appearance={
            <>
              {fields.align}
              {fields.theme}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        eyebrow: 'CMS LAW PLATFORM',
        heading: 'Deploy instantly with Puck Cloud',
        subheading:
          'A modular, purpose-built backend for Puck, designed to get you into production. Use as much of it as you need.',
        ctaLabel: 'Try Puck Cloud',
        align: 'center',
        theme: 'dark',
        layout: { padding: '48px' },
      },
      render: ({ eyebrow, heading, subheading, ctaLabel, align, theme, layout }) => {
        const isDark = theme === 'dark';
        return (
          <BlockLayout
            layout={layout}
            className={
              isDark
                ? 'rounded-2xl bg-neutral-950 px-8 text-white'
                : 'rounded-2xl border border-slate-200 bg-slate-50 px-8 text-slate-900'
            }
          >
            <div className={`mx-auto max-w-3xl space-y-4 py-12 ${getTextAlignClass(align)}`}>
              {eyebrow && (
                <p
                  className={`text-xs font-semibold tracking-widest uppercase ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {eyebrow}
                </p>
              )}
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{heading}</h1>
              <p
                className={`text-base leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {subheading}
              </p>
              {ctaLabel && (
                <div className="pt-3">
                  <span
                    className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold ${
                      isDark ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'
                    }`}
                  >
                    {ctaLabel}
                  </span>
                </div>
              )}
            </div>
          </BlockLayout>
        );
      },
    },

    FeatureGrid: {
      label: 'Feature Grid',
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        cards: { type: 'slot', allow: ['Card'] },
        columns: {
          type: 'select',
          label: 'Columns',
          options: [
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
          ],
        },
        cardMode: {
          type: 'radio',
          label: 'Card style',
          options: [
            { label: 'Card', value: 'card' },
            { label: 'Flat', value: 'flat' },
          ],
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.title}
              {fields.description}
              {fields.cards}
            </>
          }
          appearance={
            <>
              {fields.columns}
              {fields.cardMode}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        title: 'Deploy instantly with Puck Cloud',
        description:
          'A modular, purpose-built backend for Puck, designed to get you into production. Use as much of it as you need.',
        columns: 3,
        cardMode: 'card',
        layout: { padding: '48px' },
        cards: [
          {
            type: 'Card',
            props: {
              title: 'AI',
              description:
                "Generate predictable pages with AI that's constrained to your components.",
              icon: 'sparkles',
              mode: 'card',
              layout: DEFAULT_LAYOUT,
            },
          },
          {
            type: 'Card',
            props: {
              title: 'Auth (Coming Soon)',
              description: 'Add managed authentication with access control, or integrate your own.',
              icon: 'lock',
              mode: 'card',
              layout: DEFAULT_LAYOUT,
            },
          },
          {
            type: 'Card',
            props: {
              title: 'Assets (Coming Soon)',
              description:
                "A purpose-built asset store, powered by Cloudflare's best-in-class CDN.",
              icon: 'cloud',
              mode: 'card',
              layout: DEFAULT_LAYOUT,
            },
          },
        ],
      },
      render: ({ title, description, columns, cards: Cards, layout }) => (
        <BlockLayout layout={layout} className="rounded-2xl bg-neutral-950 px-8 py-12 text-white">
          <div className="mx-auto max-w-6xl space-y-10">
            {(title || description) && (
              <div className="mx-auto max-w-2xl space-y-3 text-center">
                {title && (
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
                )}
                {description && <p className="text-base text-neutral-400">{description}</p>}
              </div>
            )}
            <Cards className={`grid gap-4 ${getGridColumnsClass(columns)}`} />
          </div>
        </BlockLayout>
      ),
    },

    Card: {
      label: 'Card',
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        description: { type: 'textarea', label: 'Description', contentEditable: true },
        icon: {
          type: 'select',
          label: 'Icon',
          options: [
            { label: 'Sparkles (AI)', value: 'sparkles' },
            { label: 'Lock (Auth)', value: 'lock' },
            { label: 'Cloud (Assets)', value: 'cloud' },
            { label: 'Branch (Branching)', value: 'git-branch' },
            { label: 'Users (Multiplayer)', value: 'users' },
            { label: 'Book (Pages)', value: 'book-open' },
          ],
        },
        mode: {
          type: 'radio',
          label: 'Mode',
          options: [
            { label: 'Card', value: 'card' },
            { label: 'Flat', value: 'flat' },
          ],
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.title}
              {fields.description}
              {fields.icon}
            </>
          }
          appearance={
            <>
              {fields.mode}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        title: 'Assets (Coming Soon)',
        description: "A purpose-built asset store, powered by Cloudflare's best-in-class CDN.",
        icon: 'cloud',
        mode: 'card',
        layout: DEFAULT_LAYOUT,
      },
      render: ({ title, description, icon, mode, layout }) => (
        <BlockLayout layout={layout}>
          <div
            className={
              mode === 'card'
                ? 'h-full rounded-xl border border-neutral-800 bg-neutral-900/90 p-6 text-white shadow-xs'
                : 'h-full rounded-xl bg-transparent p-6 text-slate-900'
            }
          >
            <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white">
              {renderCardIcon(icon)}
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p
              className={`mt-2 text-xs leading-relaxed ${
                mode === 'card' ? 'text-neutral-400' : 'text-slate-600'
              }`}
            >
              {description}
            </p>
          </div>
        </BlockLayout>
      ),
    },

    Steps: {
      label: 'Steps',
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        steps: {
          type: 'array',
          label: 'Steps',
          getItemSummary: (item) => item.title || 'Step',
          defaultItemProps: {
            title: 'New Step',
            description: 'Describe this step in your workflow.',
          },
          arrayFields: {
            title: { type: 'text', label: 'Title' },
            description: { type: 'textarea', label: 'Description' },
          },
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.title}
              {fields.description}
              {fields.steps}
            </>
          }
          appearance={fields.layout}
        />
      ),
      defaultProps: {
        title: 'How It Works',
        description: 'Get from draft to published page in three simple steps.',
        steps: [
          { title: 'Select a Block', description: 'Drag any section from the Blocks drawer.' },
          { title: 'Customize Content', description: 'Edit copy and layout in the right panel.' },
          { title: 'Publish Page', description: 'Preview and publish your page instantly.' },
        ],
        layout: { padding: '24px' },
      },
      render: ({ title, description, steps, layout }) => (
        <BlockLayout layout={layout}>
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-600">{description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={`${step.title}-${String(index)}`}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </BlockLayout>
      ),
    },

    FeatureSplit: {
      label: 'Feature Split',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        ctaLabel: { type: 'text', label: 'CTA label' },
        imagePosition: {
          type: 'radio',
          label: 'Media position',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.eyebrow}
              {fields.title}
              {fields.description}
              {fields.ctaLabel}
            </>
          }
          appearance={
            <>
              {fields.imagePosition}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        eyebrow: 'WORKFLOW',
        title: 'Structured Legal Content at Scale',
        description:
          'Combine reusable design tokens with strict TypeScript components so editors stay on brand.',
        ctaLabel: 'Learn More',
        imagePosition: 'right',
        layout: { padding: '24px' },
      },
      render: ({ eyebrow, title, description, ctaLabel, imagePosition, layout }) => (
        <BlockLayout layout={layout}>
          <div className="grid items-center gap-8 rounded-2xl border border-slate-200 bg-white p-8 md:grid-cols-2">
            <div className={imagePosition === 'left' ? 'md:order-2' : 'md:order-1'}>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
              {ctaLabel && (
                <div className="mt-5">
                  <span className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                    {ctaLabel}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`flex h-52 items-center justify-center rounded-xl bg-slate-100 text-xs font-medium text-slate-500 ${
                imagePosition === 'left' ? 'md:order-1' : 'md:order-2'
              }`}
            >
              Feature Media Preview
            </div>
          </div>
        </BlockLayout>
      ),
    },

    Bento: {
      label: 'Bento',
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        items: {
          type: 'array',
          label: 'Bento cards',
          getItemSummary: (item) => item.title || 'Bento item',
          defaultItemProps: {
            title: 'Bento Feature',
            description: 'Highlight key platform capabilities.',
            span: 'normal',
          },
          arrayFields: {
            title: { type: 'text', label: 'Title' },
            description: { type: 'textarea', label: 'Description' },
            span: {
              type: 'radio',
              label: 'Column span',
              options: [
                { label: '1 Column', value: 'normal' },
                { label: '2 Columns', value: 'wide' },
              ],
            },
          },
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.title}
              {fields.description}
              {fields.items}
            </>
          }
          appearance={fields.layout}
        />
      ),
      defaultProps: {
        title: 'Platform Highlights',
        description: 'Everything needed to manage modern legal publications.',
        items: [
          {
            title: 'Visual Drag & Drop',
            description: 'Compose complex layouts without writing markup.',
            span: 'wide',
          },
          {
            title: 'Type-Safe Config',
            description: 'Backed by strict TypeScript schemas.',
            span: 'normal',
          },
        ],
        layout: { padding: '24px' },
      },
      render: ({ title, description, items, layout }) => (
        <BlockLayout layout={layout}>
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-600">{description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {items.map((item, idx) => (
                <div
                  key={`${item.title}-${String(idx)}`}
                  className={`rounded-xl border border-slate-200 bg-slate-50 p-6 ${
                    item.span === 'wide' ? 'md:col-span-2' : 'md:col-span-1'
                  }`}
                >
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </BlockLayout>
      ),
    },

    Logos: {
      label: 'Logos',
      fields: {
        heading: { type: 'text', label: 'Heading' },
        logos: {
          type: 'array',
          label: 'Partners',
          getItemSummary: (item) => item.name || 'Partner',
          defaultItemProps: { name: 'Partner Firm' },
          arrayFields: {
            name: { type: 'text', label: 'Name' },
          },
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.heading}
              {fields.logos}
            </>
          }
          appearance={fields.layout}
        />
      ),
      defaultProps: {
        heading: 'Trusted by leading global organizations',
        logos: [
          { name: 'LexCorp' },
          { name: 'Apex Legal' },
          { name: 'Vanguard LLP' },
          { name: 'veriTech' },
        ],
        layout: { padding: '24px' },
      },
      render: ({ heading, logos, layout }) => (
        <BlockLayout layout={layout}>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {heading}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-8">
              {logos.map((logo, idx) => (
                <span
                  key={`${logo.name}-${String(idx)}`}
                  className="text-sm font-bold tracking-tight text-slate-400"
                >
                  {logo.name}
                </span>
              ))}
            </div>
          </div>
        </BlockLayout>
      ),
    },

    Stats: {
      label: 'Stats',
      fields: {
        title: { type: 'text', label: 'Title' },
        items: {
          type: 'array',
          label: 'Metrics',
          getItemSummary: (item) => `${item.value} - ${item.label}`,
          defaultItemProps: { label: 'Metric', value: '100%' },
          arrayFields: {
            value: { type: 'text', label: 'Value' },
            label: { type: 'text', label: 'Label' },
          },
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.title}
              {fields.items}
            </>
          }
          appearance={fields.layout}
        />
      ),
      defaultProps: {
        title: 'Impact in Numbers',
        items: [
          { value: '99.9%', label: 'Uptime SLA' },
          { value: '500+', label: 'Published Pages' },
          { value: '24/7', label: 'Global Support' },
        ],
        layout: { padding: '24px' },
      },
      render: ({ title, items, layout }) => (
        <BlockLayout layout={layout}>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            {title && (
              <h3 className="mb-4 text-center text-sm font-semibold text-slate-500">{title}</h3>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              {items.map((stat, idx) => (
                <div
                  key={`${stat.label}-${String(idx)}`}
                  className="rounded-lg bg-slate-50 p-4 text-center"
                >
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </BlockLayout>
      ),
    },

    Grid: {
      label: 'Grid',
      fields: {
        items: { type: 'slot' },
        columns: {
          type: 'select',
          label: 'Columns',
          options: [
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
          ],
        },
        gap: { type: 'number', label: 'Gap (px)', min: 0, max: 64 },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={fields.items}
          appearance={
            <>
              {fields.columns}
              {fields.gap}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        columns: 3,
        gap: 16,
        items: [],
        layout: DEFAULT_LAYOUT,
      },
      render: ({ columns, gap, items: Items, layout }) => (
        <BlockLayout layout={layout}>
          <Items
            style={{ gap: `${String(gap)}px` }}
            className={`grid ${getGridColumnsClass(columns)}`}
          />
        </BlockLayout>
      ),
    },

    Flex: {
      label: 'Flex',
      fields: {
        items: { type: 'slot' },
        direction: {
          type: 'radio',
          label: 'Direction',
          options: [
            { label: 'Row', value: 'row' },
            { label: 'Column', value: 'column' },
          ],
        },
        justify: {
          type: 'select',
          label: 'Justify',
          options: [
            { label: 'Start', value: 'start' },
            { label: 'Center', value: 'center' },
            { label: 'Space Between', value: 'between' },
          ],
        },
        gap: { type: 'number', label: 'Gap (px)', min: 0, max: 64 },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={fields.items}
          appearance={
            <>
              {fields.direction}
              {fields.justify}
              {fields.gap}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        direction: 'row',
        justify: 'start',
        gap: 16,
        items: [],
        layout: DEFAULT_LAYOUT,
      },
      render: ({ direction, justify, gap, items: Items, layout }) => {
        const justifyClass =
          justify === 'center'
            ? 'justify-center'
            : justify === 'between'
              ? 'justify-between'
              : 'justify-start';
        const directionClass = direction === 'column' ? 'flex-col' : 'flex-row flex-wrap';

        return (
          <BlockLayout layout={layout}>
            <Items
              style={{ gap: `${String(gap)}px` }}
              className={`flex ${directionClass} ${justifyClass}`}
            />
          </BlockLayout>
        );
      },
    },

    Space: {
      label: 'Space',
      fields: {
        size: {
          type: 'select',
          label: 'Size',
          options: SPACING_OPTIONS,
        },
        direction: {
          type: 'radio',
          label: 'Direction',
          options: [
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' },
          ],
        },
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          appearance={
            <>
              {fields.size}
              {fields.direction}
            </>
          }
        />
      ),
      defaultProps: {
        size: '24px',
        direction: 'vertical',
      },
      render: ({ size, direction }) => (
        <div
          style={
            direction === 'horizontal'
              ? { width: size, height: '100%', display: 'inline-block' }
              : { height: size, width: '100%' }
          }
        />
      ),
    },

    Heading: {
      label: 'Heading',
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        level: {
          type: 'select',
          label: 'Level',
          options: [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
          ],
        },
        align: { type: 'radio', label: 'Alignment', options: ALIGN_OPTIONS },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={fields.title}
          appearance={
            <>
              {fields.level}
              {fields.align}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        title: 'Section Heading',
        level: 'h2',
        align: 'left',
        layout: DEFAULT_LAYOUT,
      },
      render: ({ title, level, align, layout }) => {
        const alignClass = getTextAlignClass(align);
        return (
          <BlockLayout layout={layout}>
            {level === 'h1' && (
              <h1 className={`text-3xl font-bold text-slate-900 ${alignClass}`}>{title}</h1>
            )}
            {level === 'h2' && (
              <h2 className={`text-2xl font-bold text-slate-900 ${alignClass}`}>{title}</h2>
            )}
            {level === 'h3' && (
              <h3 className={`text-xl font-semibold text-slate-900 ${alignClass}`}>{title}</h3>
            )}
          </BlockLayout>
        );
      },
    },

    Text: {
      label: 'Text',
      fields: {
        content: { type: 'textarea', label: 'Text', contentEditable: true },
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'base' },
            { label: 'Large', value: 'lg' },
          ],
        },
        align: { type: 'radio', label: 'Alignment', options: ALIGN_OPTIONS },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={fields.content}
          appearance={
            <>
              {fields.size}
              {fields.align}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        content:
          'Enter legal article content, practice area overview, or case summary details here.',
        size: 'base',
        align: 'left',
        layout: DEFAULT_LAYOUT,
      },
      render: ({ content, size, align, layout }) => {
        const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
        return (
          <BlockLayout layout={layout}>
            <p className={`leading-7 text-slate-700 ${sizeClass} ${getTextAlignClass(align)}`}>
              {content}
            </p>
          </BlockLayout>
        );
      },
    },

    RichText: {
      label: 'RichText',
      fields: {
        richtext: { type: 'richtext', label: 'Rich text', contentEditable: true },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs content={fields.richtext} appearance={fields.layout} />
      ),
      defaultProps: {
        richtext: '<h2>Rich Text Heading</h2><p>Add formatted body content here.</p>',
        layout: DEFAULT_LAYOUT,
      },
      render: ({ richtext, layout }) => (
        <BlockLayout layout={layout}>
          <div className="prose max-w-none text-slate-700">{richtext}</div>
        </BlockLayout>
      ),
    },

    Button: {
      label: 'Button',
      fields: {
        label: { type: 'text', label: 'Label', contentEditable: true },
        href: { type: 'text', label: 'URL' },
        variant: {
          type: 'radio',
          label: 'Variant',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
        align: { type: 'radio', label: 'Alignment', options: ALIGN_OPTIONS },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.label}
              {fields.href}
            </>
          }
          appearance={
            <>
              {fields.variant}
              {fields.align}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        label: 'Try Puck Cloud →',
        href: '#',
        variant: 'primary',
        align: 'center',
        layout: DEFAULT_LAYOUT,
      },
      render: ({ label, href, variant, align, layout }) => {
        const variantClass =
          variant === 'secondary'
            ? 'bg-white text-slate-900 border border-slate-200'
            : variant === 'outline'
              ? 'border border-slate-400 text-slate-900 bg-transparent'
              : 'bg-slate-900 text-white';

        return (
          <BlockLayout layout={layout} className={getTextAlignClass(align)}>
            <a
              href={href}
              onClick={(e) => {
                e.preventDefault();
              }}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-xs font-semibold transition ${variantClass}`}
            >
              {label}
            </a>
          </BlockLayout>
        );
      },
    },

    Map: {
      label: 'Map',
      fields: {
        eyebrow: { type: 'text', label: 'Eyebrow' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        address: { type: 'textarea', label: 'Address' },
        locationMode: {
          type: 'radio',
          label: 'Location source',
          options: MAP_LOCATION_MODE_OPTIONS,
        },
        latitude: { type: 'text', label: 'Latitude' },
        longitude: { type: 'text', label: 'Longitude' },
        googleMapsUrl: { type: 'text', label: 'Google Maps URL / Embed' },
        zoom: { type: 'number', label: 'Zoom level', min: 1, max: 20 },
        height: { type: 'select', label: 'Height', options: MAP_HEIGHT_OPTIONS },
        aspectRatio: { type: 'select', label: 'Aspect ratio', options: MAP_ASPECT_RATIO_OPTIONS },
        showDirectionsButton: {
          type: 'radio',
          label: 'Directions button',
          options: [
            { label: 'Show', value: true },
            { label: 'Hide', value: false },
          ],
        },
        directionsButtonLabel: { type: 'text', label: 'Button label' },
        theme: { type: 'radio', label: 'Theme', options: MAP_THEME_OPTIONS },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.eyebrow}
              {fields.title}
              {fields.description}
              {fields.address}
              {fields.locationMode}
              {fields.latitude}
              {fields.longitude}
              {fields.googleMapsUrl}
              {fields.showDirectionsButton}
              {fields.directionsButtonLabel}
            </>
          }
          appearance={
            <>
              {fields.zoom}
              {fields.height}
              {fields.aspectRatio}
              {fields.theme}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        title: 'Office Location',
        eyebrow: 'VISIT US',
        description: 'Visit our law firm headquarters for in-person consultation and case reviews.',
        address: '123 Legal Avenue, Suite 400, New York, NY 10001',
        locationMode: 'coordinates',
        latitude: 40.7128,
        longitude: -74.006,
        googleMapsUrl: '',
        zoom: 15,
        height: 'md',
        aspectRatio: '16/9',
        showDirectionsButton: true,
        directionsButtonLabel: 'Get Directions',
        theme: 'light',
        layout: { padding: '32px' },
      },
      render: (props) => <MapBlock {...props} />,
    },

    Template: {
      label: 'Template',
      fields: {
        templateName: { type: 'text', label: 'Template name' },
        children: { type: 'slot' },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.templateName}
              {fields.children}
            </>
          }
          appearance={fields.layout}
        />
      ),
      defaultProps: {
        templateName: 'Custom Section Template',
        children: [],
        layout: DEFAULT_LAYOUT,
      },
      render: ({ children: ChildrenSlot, layout }) => (
        <BlockLayout layout={layout}>
          <ChildrenSlot className="space-y-4" />
        </BlockLayout>
      ),
    },

    Form: {
      label: 'Form Container',
      fields: {
        title: { type: 'text', label: 'Form Title' },
        description: { type: 'textarea', label: 'Description' },
        submitEndpoint: { type: 'text', label: 'Submit Endpoint (URL)' },
        submitMethod: {
          type: 'radio',
          label: 'Submit Method',
          options: FORM_METHOD_OPTIONS,
        },
        successMessage: { type: 'text', label: 'Success Message' },
        errorMessage: { type: 'text', label: 'Error Message' },
        theme: {
          type: 'radio',
          label: 'Theme',
          options: FORM_THEME_OPTIONS,
        },
        fields: {
          type: 'slot',
          allow: ['InputField', 'SelectField', 'TextareaField', 'FormButton'],
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.title}
              {fields.description}
              {fields.fields}
              {fields.submitEndpoint}
              {fields.successMessage}
            </>
          }
          appearance={
            <>
              {fields.theme}
              {fields.submitMethod}
              {fields.errorMessage}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: {
        title: 'Request a Legal Consultation',
        description:
          'Fill out the form below to connect with an experienced attorney for a confidential case evaluation.',
        submitEndpoint: '',
        submitMethod: 'POST',
        successMessage: 'Thank you! Your consultation request has been submitted.',
        errorMessage: 'Unable to submit your request. Please try again or contact us directly.',
        theme: 'light',
        layout: { padding: '32px' },
        fields: [
          {
            type: 'InputField',
            props: {
              name: 'full_name',
              label: 'Full Name',
              type: 'text',
              placeholder: 'e.g. John Doe',
              required: true,
              helperText: '',
              width: 'half',
            },
          },
          {
            type: 'InputField',
            props: {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              placeholder: 'e.g. john@example.com',
              required: true,
              helperText: '',
              width: 'half',
            },
          },
          {
            type: 'SelectField',
            props: {
              name: 'practice_area',
              label: 'Practice Area',
              placeholder: 'Select practice area...',
              options:
                'Corporate Law | corporate\nCommercial Litigation | litigation\nReal Estate & Land Use | real_estate\nEmployment & Labor | employment',
              required: false,
              helperText: '',
              width: 'full',
            },
          },
          {
            type: 'TextareaField',
            props: {
              name: 'message',
              label: 'Case Details',
              placeholder: 'Please briefly describe your legal inquiry...',
              rows: 4,
              required: true,
              helperText: '',
              width: 'full',
            },
          },
          {
            type: 'FormButton',
            props: {
              label: 'Submit Consultation Request',
              variant: 'primary',
              width: 'full',
              align: 'left',
            },
          },
        ],
      },
      render: (props) => <FormContainer {...props} />,
    },

    InputField: {
      label: 'Input Field',
      fields: {
        name: { type: 'text', label: 'Field Name (HTML attribute)' },
        label: { type: 'text', label: 'Field Label' },
        type: {
          type: 'select',
          label: 'Input Type',
          options: INPUT_TYPE_OPTIONS,
        },
        placeholder: { type: 'text', label: 'Placeholder' },
        required: {
          type: 'radio',
          label: 'Required',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
        helperText: { type: 'text', label: 'Helper Text' },
        width: {
          type: 'radio',
          label: 'Width',
          options: FIELD_WIDTH_OPTIONS,
        },
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.label}
              {fields.name}
              {fields.placeholder}
              {fields.helperText}
            </>
          }
          appearance={
            <>
              {fields.type}
              {fields.required}
              {fields.width}
            </>
          }
        />
      ),
      defaultProps: {
        name: 'full_name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. John Doe',
        required: true,
        helperText: '',
        width: 'full',
      },
      render: (props) => <InputField {...props} />,
    },

    TextareaField: {
      label: 'Textarea Field',
      fields: {
        name: { type: 'text', label: 'Field Name (HTML attribute)' },
        label: { type: 'text', label: 'Field Label' },
        placeholder: { type: 'text', label: 'Placeholder' },
        rows: { type: 'number', label: 'Number of Rows', min: 2, max: 20 },
        required: {
          type: 'radio',
          label: 'Required',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
        helperText: { type: 'text', label: 'Helper Text' },
        width: {
          type: 'radio',
          label: 'Width',
          options: FIELD_WIDTH_OPTIONS,
        },
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.label}
              {fields.name}
              {fields.placeholder}
              {fields.helperText}
            </>
          }
          appearance={
            <>
              {fields.rows}
              {fields.required}
              {fields.width}
            </>
          }
        />
      ),
      defaultProps: {
        name: 'message',
        label: 'Case Details',
        placeholder: 'Please briefly describe your legal inquiry...',
        rows: 4,
        required: true,
        helperText: '',
        width: 'full',
      },
      render: (props) => <TextareaField {...props} />,
    },

    SelectField: {
      label: 'Select Dropdown',
      fields: {
        name: { type: 'text', label: 'Field Name (HTML attribute)' },
        label: { type: 'text', label: 'Field Label' },
        placeholder: { type: 'text', label: 'Placeholder' },
        options: { type: 'textarea', label: 'Options (Label | value per line)' },
        required: {
          type: 'radio',
          label: 'Required',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
        helperText: { type: 'text', label: 'Helper Text' },
        width: {
          type: 'radio',
          label: 'Width',
          options: FIELD_WIDTH_OPTIONS,
        },
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.label}
              {fields.name}
              {fields.placeholder}
              {fields.options}
              {fields.helperText}
            </>
          }
          appearance={
            <>
              {fields.required}
              {fields.width}
            </>
          }
        />
      ),
      defaultProps: {
        name: 'practice_area',
        label: 'Practice Area',
        placeholder: 'Select practice area...',
        options:
          'Corporate Law | corporate\nCommercial Litigation | litigation\nReal Estate & Land Use | real_estate\nEmployment & Labor | employment',
        required: false,
        helperText: '',
        width: 'full',
      },
      render: (props) => <SelectField {...props} />,
    },

    FormButton: {
      label: 'Form Submit Button',
      fields: {
        label: { type: 'text', label: 'Button Label' },
        variant: {
          type: 'radio',
          label: 'Variant',
          options: FORM_BUTTON_VARIANT_OPTIONS,
        },
        width: {
          type: 'radio',
          label: 'Width',
          options: BUTTON_WIDTH_OPTIONS,
        },
        align: {
          type: 'radio',
          label: 'Alignment',
          options: ALIGN_OPTIONS,
        },
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={<>{fields.label}</>}
          appearance={
            <>
              {fields.variant}
              {fields.width}
              {fields.align}
            </>
          }
        />
      ),
      defaultProps: {
        label: 'Submit Consultation Request',
        variant: 'primary',
        width: 'full',
        align: 'left',
      },
      render: (props) => <FormButton {...props} />,
    },

    FooterSimple: {
      label: 'Footer 1 (Simple)',
      fields: {
        logoText: { type: 'text', label: 'Logo Text (Default)' },
        logoUrl: { type: 'text', label: 'Logo Image URL (Optional)' },
        brandSubtitle: { type: 'text', label: 'Subtitle / Tagline (Optional)' },
        description: { type: 'textarea', label: 'Description / About' },
        socialLinks: footerSocialLinksField,
        contactTitle: { type: 'text', label: 'Contact Section Title' },
        address: { type: 'textarea', label: 'Address (Multiline)' },
        phone: { type: 'text', label: 'Telephone' },
        email: { type: 'text', label: 'Email' },
        linkColumns: footerLinkColumnsField,
        copyrightNotice: { type: 'text', label: 'Copyright Text' },
        bottomLinks: footerBottomLinksField,
        theme: {
          type: 'radio',
          label: 'Theme',
          options: FOOTER_THEME_OPTIONS,
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.logoText}
              {fields.logoUrl}
              {fields.brandSubtitle}
              {fields.description}
              {fields.socialLinks}
              {fields.contactTitle}
              {fields.address}
              {fields.phone}
              {fields.email}
              {fields.linkColumns}
              {fields.copyrightNotice}
              {fields.bottomLinks}
            </>
          }
          appearance={
            <>
              {fields.theme}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: DEFAULT_FOOTER_SIMPLE_DATA,
      render: (props) => <FooterSimple {...props} />,
    },

    Footer2: {
      label: 'Footer 2',
      fields: {
        logoText: { type: 'text', label: 'Logo Text (Default)' },
        logoUrl: { type: 'text', label: 'Logo Image URL (Optional)' },
        brandSubtitle: { type: 'text', label: 'Subtitle / Tagline (Optional)' },
        description: { type: 'textarea', label: 'Description / About' },
        newsletterHeading: { type: 'text', label: 'Newsletter Heading' },
        newsletterDescription: { type: 'textarea', label: 'Newsletter Description' },
        newsletterPlaceholder: { type: 'text', label: 'Newsletter Email Placeholder' },
        newsletterButtonText: { type: 'text', label: 'Newsletter Button Label' },
        linkColumns: footerLinkColumnsField,
        contactTitle: { type: 'text', label: 'Contact Section Title' },
        address: { type: 'textarea', label: 'Address (Multiline)' },
        phone: { type: 'text', label: 'Telephone' },
        email: { type: 'text', label: 'Email' },
        socialLinks: footerSocialLinksField,
        copyrightNotice: { type: 'text', label: 'Copyright Text' },
        bottomLinks: footerBottomLinksField,
        theme: {
          type: 'radio',
          label: 'Theme',
          options: FOOTER_THEME_OPTIONS,
        },
        showNewsletter: {
          type: 'radio',
          label: 'Newsletter Strip',
          options: [
            { label: 'Show', value: true },
            { label: 'Hide', value: false },
          ],
        },
        showBackToTop: {
          type: 'radio',
          label: 'Back to Top Button',
          options: [
            { label: 'Show', value: true },
            { label: 'Hide', value: false },
          ],
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.logoText}
              {fields.logoUrl}
              {fields.brandSubtitle}
              {fields.description}
              {fields.newsletterHeading}
              {fields.newsletterDescription}
              {fields.newsletterPlaceholder}
              {fields.newsletterButtonText}
              {fields.linkColumns}
              {fields.contactTitle}
              {fields.address}
              {fields.phone}
              {fields.email}
              {fields.socialLinks}
              {fields.copyrightNotice}
              {fields.bottomLinks}
            </>
          }
          appearance={
            <>
              {fields.theme}
              {fields.showNewsletter}
              {fields.showBackToTop}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: DEFAULT_FOOTER_2_DATA,
      render: (props) => <Footer2 {...props} />,
    },

    CTA1: {
      label: 'CTA 1 (Newsletter / Action)',
      fields: {
        theme: { type: 'radio', label: 'Theme', options: CTA_THEME_OPTIONS },
        actionType: { type: 'radio', label: 'Action Mode', options: CTA_ACTION_TYPE_OPTIONS },
        eyebrow: { type: 'text', label: 'Eyebrow' },
        heading: { type: 'text', label: 'Heading' },
        description: { type: 'textarea', label: 'Description' },
        newsletterPlaceholder: { type: 'text', label: 'Newsletter Email Placeholder' },
        newsletterButtonText: { type: 'text', label: 'Newsletter Submit Label' },
        newsletterButtonVariant: {
          type: 'select',
          label: 'Newsletter Button Variant',
          options: CTA_BUTTON_VARIANT_OPTIONS,
        },
        disclaimer: { type: 'text', label: 'Newsletter Disclaimer' },
        primaryButton: createCTAButtonField('Primary Button'),
        secondaryButton: createCTAButtonField('Secondary Button'),
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.actionType}
              {fields.eyebrow}
              {fields.heading}
              {fields.description}
              {fields.newsletterPlaceholder}
              {fields.newsletterButtonText}
              {fields.disclaimer}
              {fields.primaryButton}
              {fields.secondaryButton}
            </>
          }
          appearance={
            <>
              {fields.theme}
              {fields.newsletterButtonVariant}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: DEFAULT_CTA1_DATA,
      render: (props) => <CTA1 {...props} />,
    },

    CTA2: {
      label: 'CTA 2 (Dual Action & Features)',
      fields: {
        theme: { type: 'radio', label: 'Theme', options: CTA_THEME_OPTIONS },
        badge: { type: 'text', label: 'Badge Pill' },
        heading: { type: 'text', label: 'Heading' },
        description: { type: 'textarea', label: 'Description' },
        features: ctaFeaturesField,
        primaryButton: createCTAButtonField('Primary Button'),
        secondaryButton: createCTAButtonField('Secondary Button'),
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.badge}
              {fields.heading}
              {fields.description}
              {fields.features}
              {fields.primaryButton}
              {fields.secondaryButton}
            </>
          }
          appearance={
            <>
              {fields.theme}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: DEFAULT_CTA2_DATA,
      render: (props) => <CTA2 {...props} />,
    },

    FAQ1: {
      label: 'FAQ 1 (Centered Accordion)',
      fields: {
        theme: { type: 'radio', label: 'Theme', options: FAQ_THEME_OPTIONS },
        eyebrow: { type: 'text', label: 'Eyebrow' },
        heading: { type: 'text', label: 'Heading' },
        description: { type: 'textarea', label: 'Description' },
        items: faqItemsField,
        defaultOpenIndex: {
          type: 'number',
          label: 'Default Open Index (-1 for none)',
          min: -1,
        },
        allowMultipleOpen: {
          type: 'radio',
          label: 'Open Mode',
          options: FAQ_ALLOW_MULTIPLE_OPTIONS,
        },
        layout: layoutField,
      },
      renderFields: ({ fields }) => (
        <FieldTabs
          content={
            <>
              {fields.eyebrow}
              {fields.heading}
              {fields.description}
              {fields.items}
            </>
          }
          appearance={
            <>
              {fields.theme}
              {fields.defaultOpenIndex}
              {fields.allowMultipleOpen}
              {fields.layout}
            </>
          }
        />
      ),
      defaultProps: DEFAULT_FAQ1_DATA,
      render: (props) => <FAQ1 {...props} />,
    },
  },
};

export const initialPageData: PuckPageData = {
  root: {
    props: {
      title: 'Puck Example',
    },
  },
  content: [
    {
      type: 'FeatureGrid',
      props: {
        id: 'FeatureGrid-initial-1',
        title: 'Deploy instantly with Puck Cloud',
        description:
          'A modular, purpose-built backend for Puck, designed to get you into production. Use as much of it as you need.',
        columns: 3,
        cardMode: 'card',
        layout: { padding: '48px' },
        cards: [
          {
            type: 'Card',
            props: {
              id: 'Card-initial-1',
              title: 'AI',
              description:
                "Generate predictable pages with AI that's constrained to your components.",
              icon: 'sparkles',
              mode: 'card',
              layout: { padding: '0px' },
            },
          },
          {
            type: 'Card',
            props: {
              id: 'Card-initial-2',
              title: 'Auth (Coming Soon)',
              description: 'Add managed authentication with access control, or integrate your own.',
              icon: 'lock',
              mode: 'card',
              layout: { padding: '0px' },
            },
          },
          {
            type: 'Card',
            props: {
              id: 'Card-initial-3',
              title: 'Assets (Coming Soon)',
              description:
                "A purpose-built asset store, powered by Cloudflare's best-in-class CDN.",
              icon: 'cloud',
              mode: 'card',
              layout: { padding: '0px' },
            },
          },
          {
            type: 'Card',
            props: {
              id: 'Card-initial-4',
              title: 'Branching (Coming Soon)',
              description:
                'Isolated environments to iterate on your Puck config without breaking production data.',
              icon: 'git-branch',
              mode: 'card',
              layout: { padding: '0px' },
            },
          },
          {
            type: 'Card',
            props: {
              id: 'Card-initial-5',
              title: 'Multiplayer (Coming Soon)',
              description: 'Bring real-time collaborative editing to your Puck instance.',
              icon: 'users',
              mode: 'card',
              layout: { padding: '0px' },
            },
          },
          {
            type: 'Card',
            props: {
              id: 'Card-initial-6',
              title: 'Pages (Coming Soon)',
              description: 'Store pages with built-in version history and data migration.',
              icon: 'book-open',
              mode: 'card',
              layout: { padding: '0px' },
            },
          },
        ],
      },
    },
    {
      type: 'Map',
      props: {
        id: 'Map-initial-1',
        title: 'New York Headquarters',
        eyebrow: 'Our Office',
        description:
          'Visit our central office in Manhattan for partner consultations, corporate litigation, and client meetings.',
        address: '120 Broadway, Suite 300, New York, NY 10271',
        locationMode: 'coordinates',
        latitude: 40.7081,
        longitude: -74.0109,
        googleMapsUrl: '',
        zoom: 15,
        height: 'md',
        aspectRatio: '16/9',
        showDirectionsButton: true,
        directionsButtonLabel: 'Get Directions',
        theme: 'light',
        layout: { padding: '48px' },
      },
    },
  ],
};
