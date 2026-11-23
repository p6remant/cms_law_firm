import { BookOpen, Cloud, GitBranch, Lock, Sparkles, Users } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import { FieldTabs } from '@/features/editor/components/FieldTabs';
import {
  ALIGN_OPTIONS,
  DEFAULT_LAYOUT,
  getGridColumnsClass,
  getTextAlignClass,
  layoutField,
  SPACING_OPTIONS,
} from '@/features/editor/config/field-options';
import { type CardIconName, type PuckConfig, type PuckPageData } from '@/features/editor/types';

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

export const puckConfig: PuckConfig = {
  categories: {
    introduction: {
      title: 'Introduction',
      components: ['Hero'],
    },
    content: {
      title: 'Content',
      components: ['FeatureGrid', 'Card', 'CTA', 'FAQ', 'Steps', 'FeatureSplit', 'Bento'],
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
      components: ['Button'],
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

    CTA: {
      label: 'CTA',
      fields: {
        heading: { type: 'text', label: 'Heading' },
        description: { type: 'textarea', label: 'Description' },
        buttonLabel: { type: 'text', label: 'Button label' },
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
              {fields.heading}
              {fields.description}
              {fields.buttonLabel}
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
      defaultProps: {
        heading: 'Ready to launch your legal CMS?',
        description: 'Build, preview, and manage structured pages effortlessly.',
        buttonLabel: 'Try Puck Cloud →',
        theme: 'dark',
        layout: { padding: '24px' },
      },
      render: ({ heading, description, buttonLabel, theme, layout }) => {
        const isDark = theme === 'dark';
        return (
          <BlockLayout layout={layout}>
            <div
              className={`rounded-2xl p-8 text-center ${
                isDark
                  ? 'bg-neutral-950 text-white'
                  : 'border border-slate-200 bg-slate-50 text-slate-900'
              }`}
            >
              <div className="mx-auto max-w-2xl space-y-3">
                <h2 className="text-2xl font-bold">{heading}</h2>
                <p className={isDark ? 'text-sm text-neutral-400' : 'text-sm text-slate-600'}>
                  {description}
                </p>
                <div className="pt-2">
                  <span
                    className={`inline-flex items-center rounded-lg px-4 py-2 text-xs font-semibold ${
                      isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white'
                    }`}
                  >
                    {buttonLabel}
                  </span>
                </div>
              </div>
            </div>
          </BlockLayout>
        );
      },
    },

    FAQ: {
      label: 'FAQ',
      fields: {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        items: {
          type: 'array',
          label: 'Questions',
          getItemSummary: (item) => item.question || 'Question',
          defaultItemProps: {
            question: 'How does the visual editor work?',
            answer: 'Drag blocks from the left sidebar and configure them in the right panel.',
          },
          arrayFields: {
            question: { type: 'text', label: 'Question' },
            answer: { type: 'textarea', label: 'Answer' },
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
        title: 'Frequently Asked Questions',
        description: 'Common questions about managing content and layouts.',
        items: [
          {
            question: 'Can I customize every block?',
            answer: 'Yes, each block exposes Content and Appearance settings on the right sidebar.',
          },
          {
            question: 'Are changes responsive?',
            answer: 'Yes, use the viewport switcher in the editor to preview mobile and desktop.',
          },
        ],
        layout: { padding: '24px' },
      },
      render: ({ title, description, items, layout }) => (
        <BlockLayout layout={layout}>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-600">{description}</p>
            </div>
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {items.map((item, idx) => (
                <div key={`${item.question}-${String(idx)}`} className="space-y-1.5 p-5">
                  <h3 className="text-sm font-semibold text-slate-900">{item.question}</h3>
                  <p className="text-sm text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
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
  ],
};
