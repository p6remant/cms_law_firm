import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
import {
  DEFAULT_FEATURE1_DATA,
  DEFAULT_FEATURE2_DATA,
  FEATURE_ICON_NAMES,
  getFeatureButtonClasses,
  getFeatureGridClass,
  getFeatureIcon,
  getFeatureThemeClasses,
  resolveFeature1Props,
  resolveFeature2Props,
  resolveFeatureItems,
  sanitizeFeatureImageUrl,
} from '../utils/feature-utils.ts';
import type {
  CTAButtonVariant,
  Feature1Props,
  Feature2Props,
  FeatureIconName,
  FeatureItem,
} from '../types.ts';

const FEATURE_THEME_CLASS_KEYS = [
  'wrapper',
  'eyebrow',
  'badge',
  'heading',
  'text',
  'mutedText',
  'border',
  'card',
  'flatItem',
  'iconContainer',
  'icon',
  'mediaFrame',
  'mediaPlaceholderMuted',
] as const;

const FORBIDDEN_CLASS_PATTERNS = [
  /shadow/,
  /ring-/,
  /bg-gradient-/,
  /gradient/,
  /\b(from|via|to)-/,
  /stone|zinc|slate|gray/,
  /tracking-tight|tracking-wide|tracking-wider|tracking-widest/,
];

function assertNoForbiddenClasses(classString: string, contextLabel: string): void {
  assert.ok(classString.length > 0, `${contextLabel} should not be empty`);
  for (const pattern of FORBIDDEN_CLASS_PATTERNS) {
    assert.doesNotMatch(
      classString,
      pattern,
      `${contextLabel} must not match forbidden pattern ${String(pattern)}`
    );
  }
}

void describe('feature-utils', () => {
  void describe('getFeatureThemeClasses', () => {
    void it('returns pure white and neutral grayscale classes across all 13 keys for light theme', () => {
      const light = getFeatureThemeClasses('light');

      assert.deepStrictEqual(Object.keys(light).sort(), [...FEATURE_THEME_CLASS_KEYS].sort());

      assert.match(light.wrapper, /\bbg-white\b/);
      assert.match(light.wrapper, /\btext-black\b/);
      assert.match(light.wrapper, /\bborder-neutral-200\b/);
      assert.match(light.wrapper, /\btracking-normal\b/);

      assert.match(light.eyebrow, /\btext-neutral-600\b/);
      assert.match(light.eyebrow, /\btracking-normal\b/);

      assert.match(light.badge, /\bbg-neutral-100\b/);
      assert.match(light.badge, /\btext-neutral-800\b/);
      assert.match(light.badge, /\bborder-neutral-200\b/);
      assert.match(light.badge, /\btracking-normal\b/);

      assert.match(light.heading, /\btext-black\b/);
      assert.match(light.heading, /\btracking-normal\b/);

      assert.match(light.text, /\btext-black\b/);
      assert.match(light.text, /\btracking-normal\b/);

      assert.match(light.mutedText, /\btext-neutral-600\b/);
      assert.match(light.mutedText, /\btracking-normal\b/);

      assert.match(light.border, /\bborder-neutral-200\b/);

      assert.match(light.card, /\bbg-neutral-50\b/);
      assert.match(light.card, /\bborder-neutral-200\b/);
      assert.match(light.card, /\btext-black\b/);
      assert.match(light.card, /\btracking-normal\b/);

      assert.match(light.flatItem, /\bbg-transparent\b/);
      assert.match(light.flatItem, /\bborder-neutral-200\b/);
      assert.match(light.flatItem, /\btext-black\b/);
      assert.match(light.flatItem, /\btracking-normal\b/);

      assert.match(light.iconContainer, /\bbg-neutral-100\b/);
      assert.match(light.iconContainer, /\bborder-neutral-200\b/);
      assert.match(light.iconContainer, /\btext-black\b/);

      assert.match(light.icon, /\btext-black\b/);

      assert.match(light.mediaFrame, /\bbg-neutral-50\b/);
      assert.match(light.mediaFrame, /\bborder-neutral-200\b/);
      assert.match(light.mediaFrame, /\btext-black\b/);
      assert.match(light.mediaFrame, /\btracking-normal\b/);

      assert.match(light.mediaPlaceholderMuted, /\bbg-neutral-100\b/);
      assert.match(light.mediaPlaceholderMuted, /\bborder-neutral-200\b/);
      assert.match(light.mediaPlaceholderMuted, /\btext-neutral-600\b/);
      assert.match(light.mediaPlaceholderMuted, /\btracking-normal\b/);

      for (const key of FEATURE_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(light[key], `light.${key}`);
      }
    });

    void it('returns pure black and neutral grayscale classes across all 13 keys for dark theme', () => {
      const dark = getFeatureThemeClasses('dark');

      assert.deepStrictEqual(Object.keys(dark).sort(), [...FEATURE_THEME_CLASS_KEYS].sort());

      assert.match(dark.wrapper, /\bbg-black\b/);
      assert.match(dark.wrapper, /\btext-white\b/);
      assert.match(dark.wrapper, /\bborder-neutral-800\b/);
      assert.match(dark.wrapper, /\btracking-normal\b/);

      assert.match(dark.eyebrow, /\btext-neutral-400\b/);
      assert.match(dark.eyebrow, /\btracking-normal\b/);

      assert.match(dark.badge, /\bbg-neutral-900\b/);
      assert.match(dark.badge, /\btext-neutral-200\b/);
      assert.match(dark.badge, /\bborder-neutral-800\b/);
      assert.match(dark.badge, /\btracking-normal\b/);

      assert.match(dark.heading, /\btext-white\b/);
      assert.match(dark.heading, /\btracking-normal\b/);

      assert.match(dark.text, /\btext-white\b/);
      assert.match(dark.text, /\btracking-normal\b/);

      assert.match(dark.mutedText, /\btext-neutral-400\b/);
      assert.match(dark.mutedText, /\btracking-normal\b/);

      assert.match(dark.border, /\bborder-neutral-800\b/);

      assert.match(dark.card, /\bbg-neutral-950\b/);
      assert.match(dark.card, /\bborder-neutral-800\b/);
      assert.match(dark.card, /\btext-white\b/);
      assert.match(dark.card, /\btracking-normal\b/);

      assert.match(dark.flatItem, /\bbg-transparent\b/);
      assert.match(dark.flatItem, /\bborder-neutral-800\b/);
      assert.match(dark.flatItem, /\btext-white\b/);
      assert.match(dark.flatItem, /\btracking-normal\b/);

      assert.match(dark.iconContainer, /\bbg-neutral-900\b/);
      assert.match(dark.iconContainer, /\bborder-neutral-800\b/);
      assert.match(dark.iconContainer, /\btext-white\b/);

      assert.match(dark.icon, /\btext-white\b/);

      assert.match(dark.mediaFrame, /\bbg-neutral-950\b/);
      assert.match(dark.mediaFrame, /\bborder-neutral-800\b/);
      assert.match(dark.mediaFrame, /\btext-white\b/);
      assert.match(dark.mediaFrame, /\btracking-normal\b/);

      assert.match(dark.mediaPlaceholderMuted, /\bbg-neutral-900\b/);
      assert.match(dark.mediaPlaceholderMuted, /\bborder-neutral-800\b/);
      assert.match(dark.mediaPlaceholderMuted, /\btext-neutral-400\b/);
      assert.match(dark.mediaPlaceholderMuted, /\btracking-normal\b/);

      for (const key of FEATURE_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(dark[key], `dark.${key}`);
      }
    });

    void it('falls back safely to dark theme classes for unexpected runtime theme values', () => {
      const fallback = getFeatureThemeClasses('sepia' as unknown as 'light' | 'dark');
      assert.deepStrictEqual(fallback, getFeatureThemeClasses('dark'));
    });
  });

  void describe('getFeatureButtonClasses', () => {
    void it('returns distinct pure monochrome button classes across all 8 theme x variant pairs', () => {
      const themes: readonly ('light' | 'dark')[] = ['light', 'dark'];
      const variants: readonly CTAButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost'];
      const outputs: string[] = [];

      for (const theme of themes) {
        for (const variant of variants) {
          const classes = getFeatureButtonClasses(variant, theme);
          assert.match(classes, /\btracking-normal\b/);
          assertNoForbiddenClasses(classes, `${theme}.${variant}`);
          outputs.push(classes);
        }
      }

      assert.strictEqual(new Set(outputs).size, 8);
    });

    void it('falls back safely to primary variant for unexpected runtime button variants', () => {
      assert.strictEqual(
        getFeatureButtonClasses('neon' as unknown as CTAButtonVariant, 'light'),
        getFeatureButtonClasses('primary', 'light')
      );
      assert.strictEqual(
        getFeatureButtonClasses('neon' as unknown as CTAButtonVariant, 'dark'),
        getFeatureButtonClasses('primary', 'dark')
      );
    });
  });

  void describe('getFeatureGridClass', () => {
    void it('returns responsive grid classes for 2, 3, and 4 columns and falls back safely on invalid counts', () => {
      const cases: readonly { columns: number; expected: string }[] = [
        { columns: 2, expected: 'grid-cols-1 md:grid-cols-2' },
        { columns: 3, expected: 'grid-cols-1 md:grid-cols-3' },
        { columns: 4, expected: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
        { columns: 1, expected: 'grid-cols-1 md:grid-cols-3' },
        { columns: 5, expected: 'grid-cols-1 md:grid-cols-3' },
        { columns: 0, expected: 'grid-cols-1 md:grid-cols-3' },
        { columns: Number.NaN, expected: 'grid-cols-1 md:grid-cols-3' },
      ];

      for (const { columns, expected } of cases) {
        const result = getFeatureGridClass(columns);
        assert.strictEqual(result, expected);
        assertNoForbiddenClasses(result, `grid(${String(columns)})`);
      }
    });
  });

  void describe('FEATURE_ICON_NAMES and getFeatureIcon', () => {
    void it('maps all 9 curated FeatureIconName keys to their exact Lucide icon components', () => {
      const expectedMap: Record<FeatureIconName, LucideIcon> = {
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

      assert.deepStrictEqual([...FEATURE_ICON_NAMES], Object.keys(expectedMap));
      assert.strictEqual(FEATURE_ICON_NAMES.length, 9);

      for (const iconName of FEATURE_ICON_NAMES) {
        assert.strictEqual(getFeatureIcon(iconName), expectedMap[iconName]);
      }
    });

    void it('supports trimmed case-insensitive lookup and falls back to CheckCircle on invalid inputs', () => {
      assert.strictEqual(getFeatureIcon('  SHIELD  '), Shield);
      assert.strictEqual(getFeatureIcon('Bar-Chart'), BarChart);
      assert.strictEqual(getFeatureIcon(' check-circle '), CheckCircle);

      assert.strictEqual(getFeatureIcon('rocket'), CheckCircle);
      assert.strictEqual(getFeatureIcon(''), CheckCircle);
      assert.strictEqual(getFeatureIcon('   '), CheckCircle);
      assert.strictEqual(getFeatureIcon(null), CheckCircle);
      assert.strictEqual(getFeatureIcon(undefined), CheckCircle);
      assert.strictEqual(getFeatureIcon(42 as unknown as string), CheckCircle);
    });
  });

  void describe('DEFAULT_FEATURE1_DATA and DEFAULT_FEATURE2_DATA', () => {
    void it('provides authentic, non-lorem defaults for DEFAULT_FEATURE1_DATA', () => {
      assert.strictEqual(DEFAULT_FEATURE1_DATA.theme, 'light');
      assert.deepStrictEqual(DEFAULT_FEATURE1_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_FEATURE1_DATA.columns, 3);
      assert.strictEqual(DEFAULT_FEATURE1_DATA.cardMode, 'card');
      assert.ok((DEFAULT_FEATURE1_DATA.eyebrow ?? '').trim().length > 0);
      assert.ok(DEFAULT_FEATURE1_DATA.heading.trim().length > 0);
      assert.ok((DEFAULT_FEATURE1_DATA.description ?? '').trim().length > 0);
      assert.strictEqual(DEFAULT_FEATURE1_DATA.items.length, 6);

      const allText = [
        DEFAULT_FEATURE1_DATA.eyebrow ?? '',
        DEFAULT_FEATURE1_DATA.heading,
        DEFAULT_FEATURE1_DATA.description ?? '',
        ...DEFAULT_FEATURE1_DATA.items.flatMap((item) => [item.title, item.description]),
      ].join(' ');
      assert.doesNotMatch(allText, /lorem\s+ipsum/i);

      for (const item of DEFAULT_FEATURE1_DATA.items) {
        assert.ok(item.title.trim().length > 0);
        assert.ok(item.description.trim().length > 0);
        assert.ok(item.icon && FEATURE_ICON_NAMES.includes(item.icon));
      }
    });

    void it('provides authentic, non-lorem defaults for DEFAULT_FEATURE2_DATA with complete CTA and no default imageUrl', () => {
      assert.strictEqual(DEFAULT_FEATURE2_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_FEATURE2_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_FEATURE2_DATA.mediaPosition, 'right');
      assert.ok((DEFAULT_FEATURE2_DATA.badge ?? '').trim().length > 0);
      assert.ok(DEFAULT_FEATURE2_DATA.heading.trim().length > 0);
      assert.ok((DEFAULT_FEATURE2_DATA.description ?? '').trim().length > 0);
      assert.strictEqual(DEFAULT_FEATURE2_DATA.imageUrl, undefined);
      assert.strictEqual(DEFAULT_FEATURE2_DATA.imageAlt, undefined);
      assert.strictEqual(DEFAULT_FEATURE2_DATA.items.length, 3);
      assert.deepStrictEqual(DEFAULT_FEATURE2_DATA.ctaButton, {
        text: 'Learn More',
        href: '/services',
        target: '_self',
        variant: 'primary',
      });

      const allText = [
        DEFAULT_FEATURE2_DATA.badge ?? '',
        DEFAULT_FEATURE2_DATA.heading,
        DEFAULT_FEATURE2_DATA.description ?? '',
        ...DEFAULT_FEATURE2_DATA.items.flatMap((item) => [item.title, item.description]),
      ].join(' ');
      assert.doesNotMatch(allText, /lorem\s+ipsum/i);

      for (const item of DEFAULT_FEATURE2_DATA.items) {
        assert.ok(item.title.trim().length > 0);
        assert.ok(item.description.trim().length > 0);
        assert.ok(item.icon && FEATURE_ICON_NAMES.includes(item.icon));
      }
    });
  });

  void describe('resolveFeatureItems', () => {
    void it('trims title and description, normalizes valid icons, and omits blank or invalid icon keys', () => {
      const resolved = resolveFeatureItems([
        {
          icon: '  SHIELD  ' as unknown as FeatureIconName,
          title: '  Governance  ',
          description: '  Clear accountability at every milestone.  ',
        },
        {
          icon: '   ' as unknown as FeatureIconName,
          title: '  Reporting  ',
          description: '  Concise weekly progress updates.  ',
        },
        {
          icon: 'unknown-icon' as unknown as FeatureIconName,
          title: '  Review  ',
          description: '  Multi-stage verification before release.  ',
        },
        {
          title: '  Delivery  ',
          description: '  Consistent outcomes on schedule.  ',
        },
      ]);

      assert.deepStrictEqual(resolved, [
        {
          icon: 'shield',
          title: 'Governance',
          description: 'Clear accountability at every milestone.',
        },
        {
          title: 'Reporting',
          description: 'Concise weekly progress updates.',
        },
        {
          title: 'Review',
          description: 'Multi-stage verification before release.',
        },
        {
          title: 'Delivery',
          description: 'Consistent outcomes on schedule.',
        },
      ]);

      const [first, second, third, fourth] = resolved;
      assert.ok(first && second && third && fourth);
      assert.strictEqual('icon' in first, true);
      assert.strictEqual('icon' in second, false);
      assert.strictEqual('icon' in third, false);
      assert.strictEqual('icon' in fourth, false);
    });

    void it('filters malformed entries and handles non-array inputs safely', () => {
      assert.deepStrictEqual(resolveFeatureItems(undefined), []);
      assert.deepStrictEqual(resolveFeatureItems(null), []);
      assert.deepStrictEqual(resolveFeatureItems([]), []);
      assert.deepStrictEqual(
        resolveFeatureItems('not-an-array' as unknown as Partial<FeatureItem>[]),
        []
      );

      const resolved = resolveFeatureItems([
        null,
        undefined,
        {},
        { title: '   ', description: 'Valid description' },
        { title: 'Valid title', description: '   ' },
        { title: 'Only title' },
        { description: 'Only description' },
        { title: 123 as unknown as string, description: 'Valid' },
        { title: 'Valid', description: 456 as unknown as string },
        'not-an-object' as unknown as Partial<FeatureItem>,
        {
          icon: 99 as unknown as FeatureIconName,
          title: '  Valid Item  ',
          description: '  Valid Description  ',
        },
      ]);

      assert.deepStrictEqual(resolved, [{ title: 'Valid Item', description: 'Valid Description' }]);
      const [onlyItem] = resolved;
      assert.ok(onlyItem);
      assert.strictEqual('icon' in onlyItem, false);
    });
  });

  void describe('sanitizeFeatureImageUrl', () => {
    void it('trims and preserves valid HTTP(S), protocol-relative, and relative image paths', () => {
      const validInputs: readonly [string, string][] = [
        [
          '  https://cdn.example.com/images/overview.webp  ',
          'https://cdn.example.com/images/overview.webp',
        ],
        ['http://assets.example.org/hero.png', 'http://assets.example.org/hero.png'],
        ['  //cdn.example.com/media/showcase.jpg  ', '//cdn.example.com/media/showcase.jpg'],
        ['  /images/practice-overview.jpg  ', '/images/practice-overview.jpg'],
        ['./assets/diagram.svg', './assets/diagram.svg'],
        ['../media/office.webp', '../media/office.webp'],
        ['images/feature-panel.png', 'images/feature-panel.png'],
      ];

      for (const [input, expected] of validInputs) {
        assert.strictEqual(sanitizeFeatureImageUrl(input), expected);
      }
    });

    void it('rejects unsafe schemes, unsupported schemes, control characters, malformed URLs, and blanks', () => {
      const invalidInputs: unknown[] = [
        undefined,
        null,
        '',
        '   ',
        123,
        'javascript:alert(1)',
        '  JAVASCRIPT:void(0)  ',
        'java\tscript:alert(1)',
        'java script:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'data:image/svg+xml,<svg/>',
        'vbscript:msgbox("xss")',
        'ftp://files.example.com/image.png',
        'file:///etc/passwd',
        'https://',
        'http://',
        '//',
        '///evil.com/image.png',
        'https:example.com/image.png',
        'https://example.com/\nimage.png',
        'https://example.com/\u0000image.png',
        'https://example.com/\x7fimage.png',
      ];

      for (const input of invalidInputs) {
        assert.strictEqual(
          sanitizeFeatureImageUrl(input as string | null | undefined),
          undefined,
          `Expected undefined for input: ${String(input)}`
        );
      }
    });
  });

  void describe('resolveFeature1Props', () => {
    void it('resolves empty props to defaults with themeClasses and gridClass', () => {
      const resolved = resolveFeature1Props({});

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getFeatureThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.eyebrow, DEFAULT_FEATURE1_DATA.eyebrow);
      assert.strictEqual(resolved.heading, DEFAULT_FEATURE1_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_FEATURE1_DATA.description);
      assert.strictEqual(resolved.columns, 3);
      assert.strictEqual(resolved.gridClass, 'grid-cols-1 md:grid-cols-3');
      assert.strictEqual(resolved.cardMode, 'card');
      assert.deepStrictEqual(resolved.items, DEFAULT_FEATURE1_DATA.items);
    });

    void it('preserves explicit overrides including 0px padding and empty items array', () => {
      const input: Partial<Feature1Props> = {
        theme: 'dark',
        layout: { padding: '0px' },
        eyebrow: '  Services  ',
        heading: '  Core Capabilities  ',
        description: '  Tailored support across every stage.  ',
        columns: 4,
        cardMode: 'flat',
        items: [],
      };
      const resolved = resolveFeature1Props(input);

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getFeatureThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.eyebrow, 'Services');
      assert.strictEqual(resolved.heading, 'Core Capabilities');
      assert.strictEqual(resolved.description, 'Tailored support across every stage.');
      assert.strictEqual(resolved.columns, 4);
      assert.strictEqual(resolved.gridClass, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
      assert.strictEqual(resolved.cardMode, 'flat');
      assert.deepStrictEqual(resolved.items, []);
    });

    void it('falls back invalid runtime enums and omits blank optional fields', () => {
      const resolved = resolveFeature1Props({
        theme: 'sepia' as unknown as 'light' | 'dark',
        columns: 7 as unknown as 2 | 3 | 4,
        cardMode: 'glass' as unknown as 'card' | 'flat',
        eyebrow: '   ',
        heading: '   ',
        description: '',
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getFeatureThemeClasses('light'));
      assert.strictEqual(resolved.columns, 3);
      assert.strictEqual(resolved.gridClass, 'grid-cols-1 md:grid-cols-3');
      assert.strictEqual(resolved.cardMode, 'card');
      assert.strictEqual(resolved.heading, DEFAULT_FEATURE1_DATA.heading);
      assert.strictEqual('eyebrow' in resolved, false);
      assert.strictEqual('description' in resolved, false);
    });
  });

  void describe('resolveFeature2Props', () => {
    void it('resolves empty props to defaults with themeClasses and default CTA button', () => {
      const resolved = resolveFeature2Props({});

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getFeatureThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.badge, DEFAULT_FEATURE2_DATA.badge);
      assert.strictEqual(resolved.heading, DEFAULT_FEATURE2_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_FEATURE2_DATA.description);
      assert.strictEqual(resolved.mediaPosition, 'right');
      assert.deepStrictEqual(resolved.items, DEFAULT_FEATURE2_DATA.items);
      assert.strictEqual('imageUrl' in resolved, false);
      assert.strictEqual('imageAlt' in resolved, false);
      assert.deepStrictEqual(resolved.ctaButton, {
        text: 'Learn More',
        href: '/services',
        target: '_self',
        isExternal: false,
        variant: 'primary',
      });
      assert.strictEqual(resolved.ctaButtonClasses, getFeatureButtonClasses('primary', 'dark'));
    });

    void it('preserves explicit overrides, valid imageUrl, external CTA rel, and empty items', () => {
      const input: Partial<Feature2Props> = {
        theme: 'light',
        layout: { padding: '0px' },
        badge: '  Case Insights  ',
        heading: '  Direct Partner Visibility  ',
        description: '  Centralize matter timelines and milestones.  ',
        mediaPosition: 'left',
        imageUrl: '  https://cdn.example.com/feature-panel.jpg  ',
        imageAlt: '  Dashboard milestone overview  ',
        items: [],
        ctaButton: {
          text: '  View Documentation  ',
          href: 'https://docs.example.com/guide',
          variant: 'outline',
        },
      };
      const resolved = resolveFeature2Props(input);

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getFeatureThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.badge, 'Case Insights');
      assert.strictEqual(resolved.heading, 'Direct Partner Visibility');
      assert.strictEqual(resolved.description, 'Centralize matter timelines and milestones.');
      assert.strictEqual(resolved.mediaPosition, 'left');
      assert.strictEqual(resolved.imageUrl, 'https://cdn.example.com/feature-panel.jpg');
      assert.strictEqual(resolved.imageAlt, 'Dashboard milestone overview');
      assert.deepStrictEqual(resolved.items, []);
      assert.deepStrictEqual(resolved.ctaButton, {
        text: 'View Documentation',
        href: 'https://docs.example.com/guide',
        target: '_blank',
        isExternal: true,
        rel: 'noopener noreferrer',
        variant: 'outline',
      });
      assert.strictEqual(resolved.ctaButtonClasses, getFeatureButtonClasses('outline', 'light'));
    });

    void it('falls back invalid runtime enums, sanitizes unsafe URLs, and omits blank optional fields or CTA', () => {
      const resolved = resolveFeature2Props({
        theme: 'slate' as unknown as 'light' | 'dark',
        mediaPosition: 'center' as unknown as 'left' | 'right',
        badge: '   ',
        heading: '   ',
        description: '   ',
        imageUrl: 'javascript:alert(1)',
        imageAlt: '   ',
        ctaButton: {
          text: '   ',
          href: '/contact',
          variant: 'primary',
        },
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.strictEqual(resolved.mediaPosition, 'right');
      assert.strictEqual(resolved.heading, DEFAULT_FEATURE2_DATA.heading);
      assert.strictEqual('badge' in resolved, false);
      assert.strictEqual('description' in resolved, false);
      assert.strictEqual('imageUrl' in resolved, false);
      assert.strictEqual('imageAlt' in resolved, false);
      assert.strictEqual('ctaButton' in resolved, false);
      assert.strictEqual('ctaButtonClasses' in resolved, false);
    });

    void it('sanitizes unsafe CTA href to # and falls back invalid runtime CTA variant', () => {
      const resolved = resolveFeature2Props({
        theme: 'light',
        ctaButton: {
          text: '  Explore  ',
          href: '  JAVASCRIPT:alert(1)  ',
          variant: 'pill' as unknown as CTAButtonVariant,
        },
      });

      assert.deepStrictEqual(resolved.ctaButton, {
        text: 'Explore',
        href: '#',
        target: '_self',
        isExternal: false,
        variant: 'primary',
      });
      assert.strictEqual(resolved.ctaButtonClasses, getFeatureButtonClasses('primary', 'light'));
    });
  });
});
