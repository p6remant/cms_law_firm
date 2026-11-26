import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_STATS1_DATA,
  DEFAULT_STATS2_DATA,
  getStatsButtonClasses,
  getStatsCardGridClass,
  getStatsStripGridClass,
  getStatsThemeClasses,
  resolveStatItems,
  resolveStats1Props,
  resolveStats2Props,
  resolveStatsActionCTA,
} from './stats-utils.ts';
import type { CTAButtonVariant, StatItem } from '../types.ts';

const STATS_THEME_CLASS_KEYS = [
  'wrapper',
  'eyebrow',
  'badge',
  'heading',
  'text',
  'mutedText',
  'border',
  'divider',
  'card',
  'value',
  'label',
  'actionButton',
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

void describe('stats-utils', () => {
  void describe('getStatsThemeClasses', () => {
    void it('returns pure white and neutral grayscale classes across all 12 keys for light theme', () => {
      const light = getStatsThemeClasses('light');

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

      assert.match(light.divider, /\bborder-neutral-200\b/);
      assert.match(light.divider, /\bdivide-neutral-200\b/);

      assert.match(light.card, /\bbg-neutral-50\b/);
      assert.match(light.card, /\bborder-neutral-200\b/);
      assert.match(light.card, /\btext-black\b/);
      assert.match(light.card, /\btracking-normal\b/);

      assert.match(light.value, /\btext-black\b/);
      assert.match(light.value, /\btracking-normal\b/);

      assert.match(light.label, /\btext-black\b/);
      assert.match(light.label, /\btracking-normal\b/);

      assert.strictEqual(light.actionButton, getStatsButtonClasses('primary', 'light'));
      assert.match(light.actionButton, /\bbg-black\b/);
      assert.match(light.actionButton, /\btext-white\b/);
      assert.match(light.actionButton, /\btracking-normal\b/);

      for (const key of STATS_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(light[key], `light.${key}`);
      }
    });

    void it('returns pure black and neutral grayscale classes across all 12 keys for dark theme', () => {
      const dark = getStatsThemeClasses('dark');

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

      assert.match(dark.divider, /\bborder-neutral-800\b/);
      assert.match(dark.divider, /\bdivide-neutral-800\b/);

      assert.match(dark.card, /\bbg-neutral-950\b/);
      assert.match(dark.card, /\bborder-neutral-800\b/);
      assert.match(dark.card, /\btext-white\b/);
      assert.match(dark.card, /\btracking-normal\b/);

      assert.match(dark.value, /\btext-white\b/);
      assert.match(dark.value, /\btracking-normal\b/);

      assert.match(dark.label, /\btext-white\b/);
      assert.match(dark.label, /\btracking-normal\b/);

      assert.strictEqual(dark.actionButton, getStatsButtonClasses('primary', 'dark'));
      assert.match(dark.actionButton, /\bbg-white\b/);
      assert.match(dark.actionButton, /\btext-black\b/);
      assert.match(dark.actionButton, /\btracking-normal\b/);

      for (const key of STATS_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(dark[key], `dark.${key}`);
      }
    });

    void it('falls back safely to dark theme classes for unexpected runtime theme values', () => {
      const fallback = getStatsThemeClasses('sepia' as unknown as 'light' | 'dark');
      assert.deepStrictEqual(fallback, getStatsThemeClasses('dark'));
    });
  });

  void describe('getStatsButtonClasses', () => {
    void it('returns 8 distinct button class strings with tracking-normal and zero forbidden styles', () => {
      const variants: CTAButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost'];
      const themes = ['light', 'dark'] as const;
      const outputs: string[] = [];

      for (const theme of themes) {
        for (const variant of variants) {
          const classes = getStatsButtonClasses(variant, theme);
          outputs.push(classes);
          assertNoForbiddenClasses(classes, `${theme}.${variant}`);
          assert.match(classes, /\btracking-normal\b/);
        }
      }

      assert.strictEqual(new Set(outputs).size, 8);
    });

    void it('falls back safely to primary variant for invalid runtime variants', () => {
      const invalidVariant = 'pill' as unknown as CTAButtonVariant;
      assert.strictEqual(
        getStatsButtonClasses(invalidVariant, 'light'),
        getStatsButtonClasses('primary', 'light')
      );
      assert.strictEqual(
        getStatsButtonClasses(invalidVariant, 'dark'),
        getStatsButtonClasses('primary', 'dark')
      );
    });
  });

  void describe('getStatsStripGridClass and getStatsCardGridClass', () => {
    void it('returns responsive grid columns for strip layout across 0, 1, 2, 3, 4, and 6 items', () => {
      const cases = [
        { count: 0, expected: 'grid-cols-1' },
        { count: 1, expected: 'grid-cols-1' },
        { count: 2, expected: 'grid-cols-1 sm:grid-cols-2' },
        { count: 3, expected: 'grid-cols-1 md:grid-cols-3' },
        { count: 4, expected: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
        { count: 6, expected: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
      ];

      for (const { count, expected } of cases) {
        const result = getStatsStripGridClass(count);
        assert.strictEqual(result, expected);
        assertNoForbiddenClasses(result, `stripGrid(${String(count)})`);
      }

      assert.strictEqual(getStatsStripGridClass(-1), 'grid-cols-1');
      assert.strictEqual(getStatsStripGridClass(Number.NaN), 'grid-cols-1');
    });

    void it('returns responsive grid columns for card layout across 0, 1, 2, 3, 4, and 6 items', () => {
      const cases = [
        { count: 0, expected: 'grid-cols-1' },
        { count: 1, expected: 'grid-cols-1' },
        { count: 2, expected: 'grid-cols-1 sm:grid-cols-2' },
        { count: 3, expected: 'grid-cols-1 sm:grid-cols-2' },
        { count: 4, expected: 'grid-cols-1 sm:grid-cols-2' },
        { count: 6, expected: 'grid-cols-1 sm:grid-cols-2' },
      ];

      for (const { count, expected } of cases) {
        const result = getStatsCardGridClass(count);
        assert.strictEqual(result, expected);
        assertNoForbiddenClasses(result, `cardGrid(${String(count)})`);
      }

      assert.strictEqual(getStatsCardGridClass(-2), 'grid-cols-1');
      assert.strictEqual(getStatsCardGridClass(Number.NaN), 'grid-cols-1');
    });
  });

  void describe('DEFAULT_STATS1_DATA and DEFAULT_STATS2_DATA', () => {
    void it('provides clean, editorial, non-niche defaults for DEFAULT_STATS1_DATA', () => {
      assert.strictEqual(DEFAULT_STATS1_DATA.theme, 'light');
      assert.deepStrictEqual(DEFAULT_STATS1_DATA.layout, { padding: '64px' });
      assert.ok((DEFAULT_STATS1_DATA.eyebrow ?? '').trim().length > 0);
      assert.ok((DEFAULT_STATS1_DATA.heading ?? '').trim().length > 0);
      assert.ok((DEFAULT_STATS1_DATA.description ?? '').trim().length > 0);
      assert.strictEqual(DEFAULT_STATS1_DATA.items.length, 4);

      const allText1 = [
        DEFAULT_STATS1_DATA.eyebrow ?? '',
        DEFAULT_STATS1_DATA.heading ?? '',
        DEFAULT_STATS1_DATA.description ?? '',
        ...DEFAULT_STATS1_DATA.items.flatMap((item) => [
          item.value,
          item.label,
          item.description ?? '',
        ]),
      ].join(' ');
      assert.doesNotMatch(allText1, /lorem\s+ipsum/i);

      for (const item of DEFAULT_STATS1_DATA.items) {
        assert.ok(item.value.trim().length > 0);
        assert.ok(item.label.trim().length > 0);
        assert.ok((item.description ?? '').trim().length > 0);
      }
    });

    void it('provides clean, editorial, non-niche defaults and complete actionCta for DEFAULT_STATS2_DATA', () => {
      assert.strictEqual(DEFAULT_STATS2_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_STATS2_DATA.layout, { padding: '64px' });
      assert.ok((DEFAULT_STATS2_DATA.badge ?? '').trim().length > 0);
      assert.ok(DEFAULT_STATS2_DATA.heading.trim().length > 0);
      assert.ok((DEFAULT_STATS2_DATA.description ?? '').trim().length > 0);
      assert.strictEqual(DEFAULT_STATS2_DATA.items.length, 4);

      assert.ok(DEFAULT_STATS2_DATA.actionCta);
      assert.ok(DEFAULT_STATS2_DATA.actionCta.text.trim().length > 0);
      assert.strictEqual(DEFAULT_STATS2_DATA.actionCta.href, '/contact');
      assert.strictEqual(DEFAULT_STATS2_DATA.actionCta.target, '_self');
      assert.strictEqual(DEFAULT_STATS2_DATA.actionCta.variant, 'primary');

      const allText2 = [
        DEFAULT_STATS2_DATA.badge ?? '',
        DEFAULT_STATS2_DATA.heading,
        DEFAULT_STATS2_DATA.description ?? '',
        DEFAULT_STATS2_DATA.actionCta.text,
        ...DEFAULT_STATS2_DATA.items.flatMap((item) => [
          item.value,
          item.label,
          item.description ?? '',
        ]),
      ].join(' ');
      assert.doesNotMatch(allText2, /lorem\s+ipsum/i);

      for (const item of DEFAULT_STATS2_DATA.items) {
        assert.ok(item.value.trim().length > 0);
        assert.ok(item.label.trim().length > 0);
        assert.ok((item.description ?? '').trim().length > 0);
      }
    });
  });

  void describe('resolveStatItems', () => {
    void it('trims value, label, and description while omitting blank or missing description keys', () => {
      const resolved = resolveStatItems([
        { value: '  99.4%  ', label: '  Retention  ', description: '  Long-term partnerships.  ' },
        { value: '  48 hrs  ', label: '  Turnaround  ', description: '   ' },
        { value: '  30+  ', label: '  Years  ' },
      ]);

      assert.deepStrictEqual(resolved, [
        { value: '99.4%', label: 'Retention', description: 'Long-term partnerships.' },
        { value: '48 hrs', label: 'Turnaround' },
        { value: '30+', label: 'Years' },
      ]);

      const [first, second, third] = resolved;
      assert.ok(first);
      assert.ok(second);
      assert.ok(third);
      assert.strictEqual('description' in first, true);
      assert.strictEqual('description' in second, false);
      assert.strictEqual('description' in third, false);
    });

    void it('skips items with blank or missing value or label, malformed objects, and non-array inputs', () => {
      assert.deepStrictEqual(resolveStatItems(undefined), []);
      assert.deepStrictEqual(resolveStatItems(null), []);
      assert.deepStrictEqual(resolveStatItems([]), []);
      assert.deepStrictEqual(
        resolveStatItems('not-an-array' as unknown as Partial<StatItem>[]),
        []
      );

      const resolved = resolveStatItems([
        null,
        undefined,
        {},
        { value: '   ', label: 'Missing Value' },
        { value: '100%', label: '   ' },
        { value: '100%' },
        { label: 'Only Label' },
        {
          value: 99 as unknown as string,
          label: 'Numeric Value',
        },
        {
          value: '500+',
          label: 42 as unknown as string,
        },
        {
          value: '  24/7  ',
          label: '  Support  ',
          description: 123 as unknown as string,
        },
        'not-an-object' as unknown as Partial<StatItem>,
      ]);

      assert.deepStrictEqual(resolved, [{ value: '24/7', label: 'Support' }]);
      const [onlyItem] = resolved;
      assert.ok(onlyItem);
      assert.strictEqual('description' in onlyItem, false);
    });
  });

  void describe('resolveStatsActionCTA', () => {
    void it('returns undefined for undefined, empty object, whitespace-only text, or non-object input', () => {
      assert.strictEqual(resolveStatsActionCTA(undefined), undefined);
      assert.strictEqual(resolveStatsActionCTA({}), undefined);
      assert.strictEqual(
        resolveStatsActionCTA({ text: '   ', href: '/contact', variant: 'primary' }),
        undefined
      );
      assert.strictEqual(
        resolveStatsActionCTA('invalid' as unknown as Record<string, never>),
        undefined
      );
    });

    void it('sanitizes unsafe URI schemes and blank href values to #', () => {
      for (const unsafeHref of [
        'javascript:alert(1)',
        '  JAVASCRIPT:void(0)  ',
        'java\tscript:alert(1)',
        'data:text/html,test',
        'vbscript:msgbox',
        '   ',
        '',
      ]) {
        const resolved = resolveStatsActionCTA({
          text: 'View Details',
          href: unsafeHref,
        });

        assert.ok(resolved);
        assert.strictEqual(resolved.href, '#');
        assert.strictEqual(resolved.target, '_self');
        assert.strictEqual(resolved.isExternal, false);
        assert.strictEqual('rel' in resolved, false);
      }
    });

    void it('auto-detects external URLs and attaches rel noopener noreferrer when target is omitted', () => {
      for (const externalHref of [
        'https://example.com/metrics',
        'http://example.com/report',
        '//cdn.example.com/brief.pdf',
      ]) {
        const resolved = resolveStatsActionCTA({
          text: '  Open Report  ',
          href: `  ${externalHref}  `,
        });

        assert.ok(resolved);
        assert.strictEqual(resolved.text, 'Open Report');
        assert.strictEqual(resolved.href, externalHref);
        assert.strictEqual(resolved.target, '_blank');
        assert.strictEqual(resolved.isExternal, true);
        assert.strictEqual(resolved.rel, 'noopener noreferrer');
      }
    });

    void it('honors explicit _blank on internal paths and explicit _self on external URLs', () => {
      const internalBlank = resolveStatsActionCTA({
        text: 'Annual Report',
        href: '/reports/annual',
        target: '_blank',
      });
      assert.ok(internalBlank);
      assert.strictEqual(internalBlank.target, '_blank');
      assert.strictEqual(internalBlank.isExternal, true);
      assert.strictEqual(internalBlank.rel, 'noopener noreferrer');

      const externalSelf = resolveStatsActionCTA({
        text: 'External Portal',
        href: 'https://example.org/portal',
        target: '_self',
      });
      assert.ok(externalSelf);
      assert.strictEqual(externalSelf.target, '_self');
      assert.strictEqual(externalSelf.isExternal, false);
      assert.strictEqual('rel' in externalSelf, false);
    });

    void it('keeps /paths, #anchors, mailto:, and tel: as _self with isExternal false and no rel', () => {
      for (const localHref of [
        '/contact',
        '#metrics-overview',
        'mailto:team@example.com',
        'tel:+15550199',
      ]) {
        const resolved = resolveStatsActionCTA({
          text: 'Get in Touch',
          href: localHref,
        });

        assert.ok(resolved);
        assert.strictEqual(resolved.href, localHref);
        assert.strictEqual(resolved.target, '_self');
        assert.strictEqual(resolved.isExternal, false);
        assert.strictEqual('rel' in resolved, false);
      }
    });

    void it('resolves variant and theme-specific classes and falls back invalid variant to primary', () => {
      const outlineLight = resolveStatsActionCTA(
        {
          text: 'Explore Practice',
          href: '/practice',
          variant: 'outline',
        },
        'light'
      );
      assert.ok(outlineLight);
      assert.strictEqual(outlineLight.variant, 'outline');
      assert.strictEqual(outlineLight.classes, getStatsButtonClasses('outline', 'light'));

      const invalidVariantDark = resolveStatsActionCTA(
        {
          text: 'Explore Practice',
          href: '/practice',
          variant: 'floating' as unknown as CTAButtonVariant,
        },
        'dark'
      );
      assert.ok(invalidVariantDark);
      assert.strictEqual(invalidVariantDark.variant, 'primary');
      assert.strictEqual(invalidVariantDark.classes, getStatsButtonClasses('primary', 'dark'));
    });
  });

  void describe('resolveStats1Props', () => {
    void it('resolves empty props to complete defaults with light themeClasses', () => {
      const resolved = resolveStats1Props({});

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.eyebrow, DEFAULT_STATS1_DATA.eyebrow);
      assert.strictEqual(resolved.heading, DEFAULT_STATS1_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_STATS1_DATA.description);
      assert.deepStrictEqual(resolved.items, DEFAULT_STATS1_DATA.items);
    });

    void it('preserves explicit theme, 0px layout, trimmed optional strings, custom items, and empty items array', () => {
      const resolved = resolveStats1Props({
        theme: 'dark',
        layout: { padding: '0px' },
        eyebrow: '  Outcomes  ',
        heading: '  Consistent results  ',
        description: '  Clear metrics across engagements.  ',
        items: [
          { value: '  98%  ', label: '  Satisfaction  ', description: '  Verified annually.  ' },
          { value: '   ', label: 'Skipped' },
          { value: '  15  ', label: '  Regions  ' },
        ],
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.eyebrow, 'Outcomes');
      assert.strictEqual(resolved.heading, 'Consistent results');
      assert.strictEqual(resolved.description, 'Clear metrics across engagements.');
      assert.deepStrictEqual(resolved.items, [
        { value: '98%', label: 'Satisfaction', description: 'Verified annually.' },
        { value: '15', label: 'Regions' },
      ]);

      const emptyItems = resolveStats1Props({ items: [] });
      assert.deepStrictEqual(emptyItems.items, []);
    });

    void it('omits whitespace-only optional fields (eyebrow, heading, description) and falls back invalid theme to light', () => {
      const resolved = resolveStats1Props({
        theme: 'charcoal' as unknown as 'dark' | 'light',
        eyebrow: '   ',
        heading: '   ',
        description: '',
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('light'));
      assert.strictEqual(resolved.eyebrow, undefined);
      assert.strictEqual(resolved.heading, undefined);
      assert.strictEqual(resolved.description, undefined);
      assert.strictEqual('eyebrow' in resolved, false);
      assert.strictEqual('heading' in resolved, false);
      assert.strictEqual('description' in resolved, false);
    });
  });

  void describe('resolveStats2Props', () => {
    void it('resolves empty props to complete defaults with dark themeClasses and actionCta', () => {
      const resolved = resolveStats2Props({});

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.badge, DEFAULT_STATS2_DATA.badge);
      assert.strictEqual(resolved.heading, DEFAULT_STATS2_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_STATS2_DATA.description);
      assert.deepStrictEqual(resolved.items, DEFAULT_STATS2_DATA.items);
      assert.deepStrictEqual(resolved.actionCta, {
        text: DEFAULT_STATS2_DATA.actionCta?.text,
        href: '/contact',
        target: '_self',
        isExternal: false,
        variant: 'primary',
        classes: getStatsButtonClasses('primary', 'dark'),
      });
    });

    void it('preserves explicit light theme, 0px layout, badge, trimmed strings, custom items, and custom actionCta', () => {
      const resolved = resolveStats2Props({
        theme: 'light',
        layout: { padding: '0px' },
        badge: '  Impact  ',
        heading: '  Built for durable partnerships  ',
        description: '  Measured across every milestone.  ',
        actionCta: {
          text: '  View Report  ',
          href: 'https://reports.example.com/2026',
          variant: 'secondary',
        },
        items: [
          { value: '  42  ', label: '  Partners  ' },
          { value: '10', label: '   ' },
        ],
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.badge, 'Impact');
      assert.strictEqual(resolved.heading, 'Built for durable partnerships');
      assert.strictEqual(resolved.description, 'Measured across every milestone.');
      assert.deepStrictEqual(resolved.items, [{ value: '42', label: 'Partners' }]);
      assert.deepStrictEqual(resolved.actionCta, {
        text: 'View Report',
        href: 'https://reports.example.com/2026',
        target: '_blank',
        isExternal: true,
        rel: 'noopener noreferrer',
        variant: 'secondary',
        classes: getStatsButtonClasses('secondary', 'light'),
      });
    });

    void it('omits blank optional fields, falls back blank heading to default, preserves empty items, and falls back invalid theme to dark', () => {
      const resolved = resolveStats2Props({
        theme: 'slate' as unknown as 'dark' | 'light',
        badge: '   ',
        heading: '   ',
        description: '  ',
        actionCta: {
          text: '   ',
          href: '/contact',
        },
        items: [],
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('dark'));
      assert.strictEqual(resolved.badge, undefined);
      assert.strictEqual(resolved.heading, DEFAULT_STATS2_DATA.heading);
      assert.strictEqual(resolved.description, undefined);
      assert.strictEqual(resolved.actionCta, undefined);
      assert.strictEqual('badge' in resolved, false);
      assert.strictEqual('description' in resolved, false);
      assert.strictEqual('actionCta' in resolved, false);
      assert.deepStrictEqual(resolved.items, []);
    });
  });
});
