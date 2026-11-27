import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_STATS1_DATA,
  DEFAULT_STATS2_DATA,
  getStatsCardGridClass,
  getStatsStripGridClass,
  getStatsThemeClasses,
  resolveStatItems,
  resolveStats1Props,
  resolveStats2Props,
} from './stats-utils.ts';
import type { StatItem, Stats1Props, Stats2Props } from '../types.ts';

const STATS_THEME_CLASS_KEYS = [
  'wrapper',
  'text',
  'mutedText',
  'border',
  'divider',
  'card',
  'value',
  'label',
] as const;

const RESOLVED_STATS_KEYS = ['items', 'layout', 'theme', 'themeClasses'] as const;

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
    void it('returns pure white and neutral grayscale classes across all 8 pure-metric keys for light theme', () => {
      const light = getStatsThemeClasses('light');

      assert.deepStrictEqual(Object.keys(light).sort(), [...STATS_THEME_CLASS_KEYS].sort());

      assert.match(light.wrapper, /\bbg-white\b/);
      assert.match(light.wrapper, /\btext-black\b/);
      assert.match(light.wrapper, /\bborder-neutral-200\b/);
      assert.match(light.wrapper, /\btracking-normal\b/);

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

      for (const key of STATS_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(light[key], `light.${key}`);
      }
    });

    void it('returns pure black and neutral grayscale classes across all 8 pure-metric keys for dark theme', () => {
      const dark = getStatsThemeClasses('dark');

      assert.deepStrictEqual(Object.keys(dark).sort(), [...STATS_THEME_CLASS_KEYS].sort());

      assert.match(dark.wrapper, /\bbg-black\b/);
      assert.match(dark.wrapper, /\btext-white\b/);
      assert.match(dark.wrapper, /\bborder-neutral-800\b/);
      assert.match(dark.wrapper, /\btracking-normal\b/);

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

      for (const key of STATS_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(dark[key], `dark.${key}`);
      }
    });

    void it('falls back safely to dark theme classes for unexpected runtime theme values', () => {
      const fallback = getStatsThemeClasses('sepia' as unknown as 'light' | 'dark');
      assert.deepStrictEqual(fallback, getStatsThemeClasses('dark'));
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

    void it('returns responsive 1/2/3/4-column grid progression for card layout across 0, 1, 2, 3, 4, and 6 items', () => {
      const cases = [
        { count: 0, expected: 'grid-cols-1' },
        { count: 1, expected: 'grid-cols-1' },
        { count: 2, expected: 'grid-cols-1 sm:grid-cols-2' },
        { count: 3, expected: 'grid-cols-1 md:grid-cols-3' },
        { count: 4, expected: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
        { count: 6, expected: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
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
    void it('provides pure-metric, non-niche defaults for DEFAULT_STATS1_DATA', () => {
      assert.deepStrictEqual(Object.keys(DEFAULT_STATS1_DATA).sort(), ['items', 'layout', 'theme']);
      assert.strictEqual(DEFAULT_STATS1_DATA.theme, 'light');
      assert.deepStrictEqual(DEFAULT_STATS1_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_STATS1_DATA.items.length, 4);

      const allText1 = DEFAULT_STATS1_DATA.items
        .flatMap((item) => [item.value, item.label, item.description ?? ''])
        .join(' ');
      assert.doesNotMatch(allText1, /lorem\s+ipsum/i);

      for (const item of DEFAULT_STATS1_DATA.items) {
        assert.ok(item.value.trim().length > 0);
        assert.ok(item.label.trim().length > 0);
        assert.ok((item.description ?? '').trim().length > 0);
      }
    });

    void it('provides pure-metric, non-niche defaults for DEFAULT_STATS2_DATA', () => {
      assert.deepStrictEqual(Object.keys(DEFAULT_STATS2_DATA).sort(), ['items', 'layout', 'theme']);
      assert.strictEqual(DEFAULT_STATS2_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_STATS2_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_STATS2_DATA.items.length, 4);

      const allText2 = DEFAULT_STATS2_DATA.items
        .flatMap((item) => [item.value, item.label, item.description ?? ''])
        .join(' ');
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

  void describe('resolveStats1Props', () => {
    void it('resolves empty props to pure-metric defaults with light themeClasses', () => {
      const resolved = resolveStats1Props({});

      assert.deepStrictEqual(Object.keys(resolved).sort(), [...RESOLVED_STATS_KEYS]);
      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.deepStrictEqual(resolved.items, DEFAULT_STATS1_DATA.items);
    });

    void it('preserves explicit theme, 0px layout, filtered items, and empty items array', () => {
      const input: Partial<Stats1Props> = {
        theme: 'dark',
        layout: { padding: '0px' },
        items: [
          { value: '  98%  ', label: '  Satisfaction  ', description: '  Verified annually.  ' },
          { value: '   ', label: 'Skipped' },
          { value: '  15  ', label: '  Regions  ' },
        ],
      };
      const resolved = resolveStats1Props(input);

      assert.deepStrictEqual(Object.keys(resolved).sort(), [...RESOLVED_STATS_KEYS]);
      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.deepStrictEqual(resolved.items, [
        { value: '98%', label: 'Satisfaction', description: 'Verified annually.' },
        { value: '15', label: 'Regions' },
      ]);

      const emptyItems = resolveStats1Props({ items: [] });
      assert.deepStrictEqual(emptyItems.items, []);
    });

    void it('falls back invalid theme to light and excludes stray legacy header/copy/CTA keys', () => {
      const legacyInput = {
        theme: 'charcoal',
        eyebrow: 'Legacy Eyebrow',
        heading: 'Legacy Heading',
        description: 'Legacy Description',
        badge: 'Legacy Badge',
        actionCta: { text: 'Legacy CTA', href: '/contact' },
      } as unknown as Partial<Stats1Props>;

      const resolved = resolveStats1Props(legacyInput);

      assert.deepStrictEqual(Object.keys(resolved).sort(), [...RESOLVED_STATS_KEYS]);
      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('light'));
      assert.strictEqual('eyebrow' in resolved, false);
      assert.strictEqual('heading' in resolved, false);
      assert.strictEqual('description' in resolved, false);
      assert.strictEqual('badge' in resolved, false);
      assert.strictEqual('actionCta' in resolved, false);
    });
  });

  void describe('resolveStats2Props', () => {
    void it('resolves empty props to pure-metric defaults with dark themeClasses', () => {
      const resolved = resolveStats2Props({});

      assert.deepStrictEqual(Object.keys(resolved).sort(), [...RESOLVED_STATS_KEYS]);
      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.deepStrictEqual(resolved.items, DEFAULT_STATS2_DATA.items);
    });

    void it('preserves explicit light theme, 0px layout, filtered items, and empty items array', () => {
      const input: Partial<Stats2Props> = {
        theme: 'light',
        layout: { padding: '0px' },
        items: [
          { value: '  42  ', label: '  Partners  ' },
          { value: '10', label: '   ' },
        ],
      };
      const resolved = resolveStats2Props(input);

      assert.deepStrictEqual(Object.keys(resolved).sort(), [...RESOLVED_STATS_KEYS]);
      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.deepStrictEqual(resolved.items, [{ value: '42', label: 'Partners' }]);

      const emptyItems = resolveStats2Props({ items: [] });
      assert.deepStrictEqual(emptyItems.items, []);
    });

    void it('falls back invalid theme to dark and excludes stray legacy header/copy/CTA keys', () => {
      const legacyInput = {
        theme: 'slate',
        eyebrow: 'Legacy Eyebrow',
        badge: 'Legacy Badge',
        heading: 'Legacy Heading',
        description: 'Legacy Description',
        actionCta: { text: 'Legacy CTA', href: '/contact' },
      } as unknown as Partial<Stats2Props>;

      const resolved = resolveStats2Props(legacyInput);

      assert.deepStrictEqual(Object.keys(resolved).sort(), [...RESOLVED_STATS_KEYS]);
      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getStatsThemeClasses('dark'));
      assert.strictEqual('eyebrow' in resolved, false);
      assert.strictEqual('badge' in resolved, false);
      assert.strictEqual('heading' in resolved, false);
      assert.strictEqual('description' in resolved, false);
      assert.strictEqual('actionCta' in resolved, false);
    });
  });
});
