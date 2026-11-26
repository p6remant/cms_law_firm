import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FAQ1_DATA,
  DEFAULT_FAQ2_DATA,
  getFAQButtonClasses,
  getFAQThemeClasses,
  resolveFAQ1Props,
  resolveFAQ2Props,
  resolveFAQContactCTA,
  resolveFAQItems,
} from './faq-utils.ts';
import type { CTAButtonVariant, FAQItem } from '../types.ts';

const FAQ_THEME_CLASS_KEYS = [
  'wrapper',
  'heading',
  'text',
  'mutedText',
  'border',
  'itemBorder',
  'badge',
  'chevron',
  'contactCard',
  'contactButton',
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

void describe('faq-utils', () => {
  void describe('getFAQThemeClasses', () => {
    void it('returns pure white and neutral grayscale classes across all 10 keys for light theme', () => {
      const light = getFAQThemeClasses('light');

      assert.match(light.wrapper, /\bbg-white\b/);
      assert.match(light.wrapper, /\btext-black\b/);
      assert.match(light.wrapper, /\bborder-neutral-200\b/);
      assert.match(light.wrapper, /\btracking-normal\b/);

      assert.match(light.heading, /\btext-black\b/);
      assert.match(light.heading, /\btracking-normal\b/);

      assert.match(light.text, /\btext-black\b/);
      assert.match(light.text, /\btracking-normal\b/);

      assert.match(light.mutedText, /\btext-neutral-600\b/);
      assert.match(light.mutedText, /\btracking-normal\b/);

      assert.match(light.border, /\bborder-neutral-200\b/);
      assert.match(light.itemBorder, /\bborder-neutral-200\b/);

      assert.match(light.badge, /\bbg-neutral-100\b/);
      assert.match(light.badge, /\btext-neutral-800\b/);
      assert.match(light.badge, /\bborder-neutral-200\b/);
      assert.match(light.badge, /\btracking-normal\b/);

      assert.match(light.chevron, /\btext-neutral-600\b/);

      assert.match(light.contactCard, /\bbg-neutral-50\b/);
      assert.match(light.contactCard, /\bborder-neutral-200\b/);
      assert.match(light.contactCard, /\btext-black\b/);
      assert.match(light.contactCard, /\btracking-normal\b/);

      assert.strictEqual(light.contactButton, getFAQButtonClasses('primary', 'light'));
      assert.match(light.contactButton, /\bbg-black\b/);
      assert.match(light.contactButton, /\btext-white\b/);
      assert.match(light.contactButton, /\btracking-normal\b/);

      for (const key of FAQ_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(light[key], `light.${key}`);
      }
    });

    void it('returns pure black and neutral grayscale classes across all 10 keys for dark theme', () => {
      const dark = getFAQThemeClasses('dark');

      assert.match(dark.wrapper, /\bbg-black\b/);
      assert.match(dark.wrapper, /\btext-white\b/);
      assert.match(dark.wrapper, /\bborder-neutral-800\b/);
      assert.match(dark.wrapper, /\btracking-normal\b/);

      assert.match(dark.heading, /\btext-white\b/);
      assert.match(dark.heading, /\btracking-normal\b/);

      assert.match(dark.text, /\btext-white\b/);
      assert.match(dark.text, /\btracking-normal\b/);

      assert.match(dark.mutedText, /\btext-neutral-400\b/);
      assert.match(dark.mutedText, /\btracking-normal\b/);

      assert.match(dark.border, /\bborder-neutral-800\b/);
      assert.match(dark.itemBorder, /\bborder-neutral-800\b/);

      assert.match(dark.badge, /\bbg-neutral-900\b/);
      assert.match(dark.badge, /\btext-neutral-200\b/);
      assert.match(dark.badge, /\bborder-neutral-800\b/);
      assert.match(dark.badge, /\btracking-normal\b/);

      assert.match(dark.chevron, /\btext-neutral-400\b/);

      assert.match(dark.contactCard, /\bbg-neutral-950\b/);
      assert.match(dark.contactCard, /\bborder-neutral-800\b/);
      assert.match(dark.contactCard, /\btext-white\b/);
      assert.match(dark.contactCard, /\btracking-normal\b/);

      assert.strictEqual(dark.contactButton, getFAQButtonClasses('primary', 'dark'));
      assert.match(dark.contactButton, /\bbg-white\b/);
      assert.match(dark.contactButton, /\btext-black\b/);
      assert.match(dark.contactButton, /\btracking-normal\b/);

      for (const key of FAQ_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(dark[key], `dark.${key}`);
      }
    });

    void it('falls back safely to dark theme classes for invalid runtime theme values', () => {
      const fallback = getFAQThemeClasses('sepia' as unknown as 'light' | 'dark');
      assert.deepStrictEqual(fallback, getFAQThemeClasses('dark'));
    });
  });

  void describe('getFAQButtonClasses', () => {
    void it('returns 8 distinct button class strings with tracking-normal and zero forbidden styles', () => {
      const variants: CTAButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost'];
      const themes = ['light', 'dark'] as const;
      const outputs: string[] = [];

      for (const theme of themes) {
        for (const variant of variants) {
          const classes = getFAQButtonClasses(variant, theme);
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
        getFAQButtonClasses(invalidVariant, 'light'),
        getFAQButtonClasses('primary', 'light')
      );
      assert.strictEqual(
        getFAQButtonClasses(invalidVariant, 'dark'),
        getFAQButtonClasses('primary', 'dark')
      );
    });
  });

  void describe('DEFAULT_FAQ1_DATA and DEFAULT_FAQ2_DATA', () => {
    void it('provides clean, editorial, non-niche defaults for DEFAULT_FAQ1_DATA', () => {
      assert.strictEqual(DEFAULT_FAQ1_DATA.theme, 'light');
      assert.deepStrictEqual(DEFAULT_FAQ1_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_FAQ1_DATA.eyebrow, 'FAQ');
      assert.strictEqual(DEFAULT_FAQ1_DATA.heading, 'Frequently asked questions');
      assert.ok((DEFAULT_FAQ1_DATA.description ?? '').trim().length > 0);
      assert.ok(DEFAULT_FAQ1_DATA.items.length >= 4 && DEFAULT_FAQ1_DATA.items.length <= 5);
      assert.strictEqual(DEFAULT_FAQ1_DATA.defaultOpenIndex, 0);
      assert.strictEqual(DEFAULT_FAQ1_DATA.allowMultipleOpen, false);

      const allText1 = [
        DEFAULT_FAQ1_DATA.eyebrow ?? '',
        DEFAULT_FAQ1_DATA.heading,
        DEFAULT_FAQ1_DATA.description ?? '',
        ...DEFAULT_FAQ1_DATA.items.flatMap((item) => [item.question, item.answer]),
      ].join(' ');
      assert.doesNotMatch(allText1, /lorem\s+ipsum/i);

      for (const item of DEFAULT_FAQ1_DATA.items) {
        assert.ok(item.question.trim().length > 0);
        assert.ok(item.answer.trim().length > 0);
      }
    });

    void it('provides clean, editorial, non-niche defaults and complete contactCta for DEFAULT_FAQ2_DATA', () => {
      assert.strictEqual(DEFAULT_FAQ2_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_FAQ2_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_FAQ2_DATA.badge, 'FAQ');
      assert.ok(DEFAULT_FAQ2_DATA.heading.trim().length > 0);
      assert.ok((DEFAULT_FAQ2_DATA.description ?? '').trim().length > 0);
      assert.ok(DEFAULT_FAQ2_DATA.items.length >= 4 && DEFAULT_FAQ2_DATA.items.length <= 5);
      assert.strictEqual(DEFAULT_FAQ2_DATA.defaultOpenIndex, 0);
      assert.strictEqual(DEFAULT_FAQ2_DATA.allowMultipleOpen, false);

      assert.ok(DEFAULT_FAQ2_DATA.contactCta);
      assert.strictEqual(DEFAULT_FAQ2_DATA.contactCta.title, 'Still have questions?');
      assert.ok((DEFAULT_FAQ2_DATA.contactCta.description ?? '').trim().length > 0);
      assert.strictEqual(DEFAULT_FAQ2_DATA.contactCta.buttonText, 'Contact Us');
      assert.strictEqual(DEFAULT_FAQ2_DATA.contactCta.buttonHref, '/contact');
      assert.strictEqual(DEFAULT_FAQ2_DATA.contactCta.buttonTarget, '_self');
      assert.strictEqual(DEFAULT_FAQ2_DATA.contactCta.buttonVariant, 'primary');

      const allText2 = [
        DEFAULT_FAQ2_DATA.badge ?? '',
        DEFAULT_FAQ2_DATA.heading,
        DEFAULT_FAQ2_DATA.description ?? '',
        DEFAULT_FAQ2_DATA.contactCta.title ?? '',
        DEFAULT_FAQ2_DATA.contactCta.description ?? '',
        DEFAULT_FAQ2_DATA.contactCta.buttonText,
        ...DEFAULT_FAQ2_DATA.items.flatMap((item) => [item.question, item.answer]),
      ].join(' ');
      assert.doesNotMatch(allText2, /lorem\s+ipsum/i);

      for (const item of DEFAULT_FAQ2_DATA.items) {
        assert.ok(item.question.trim().length > 0);
        assert.ok(item.answer.trim().length > 0);
      }
    });
  });

  void describe('resolveFAQItems', () => {
    void it('trims whitespace on valid items and removes items with blank question or answer', () => {
      const resolved = resolveFAQItems([
        { question: '  How do timelines work?  ', answer: '  Milestones are shared upfront.  ' },
        { question: '   ', answer: 'Orphan answer' },
        { question: 'Unanswered question', answer: '   ' },
        { question: '', answer: '' },
        { question: '  Can scope change? ', answer: ' Yes, with prior review. ' },
      ]);

      assert.deepStrictEqual(resolved, [
        { question: 'How do timelines work?', answer: 'Milestones are shared upfront.' },
        { question: 'Can scope change?', answer: 'Yes, with prior review.' },
      ]);
    });

    void it('handles undefined, null, empty arrays, and malformed/partial item objects safely', () => {
      assert.deepStrictEqual(resolveFAQItems(undefined), []);
      assert.deepStrictEqual(resolveFAQItems(null), []);
      assert.deepStrictEqual(resolveFAQItems([]), []);
      assert.deepStrictEqual(
        resolveFAQItems([
          null,
          undefined,
          {},
          { question: 'Only question' },
          { answer: 'Only answer' },
          {
            question: 123 as unknown as string,
            answer: 'Valid answer',
          },
          { question: '  Valid Q  ', answer: '  Valid A  ' },
          'not-an-object' as unknown as Partial<FAQItem>,
        ]),
        [{ question: 'Valid Q', answer: 'Valid A' }]
      );
    });
  });

  void describe('resolveFAQContactCTA', () => {
    void it('returns undefined when contactCta is undefined or when title, description, and buttonText are blank', () => {
      assert.strictEqual(resolveFAQContactCTA(undefined), undefined);
      assert.strictEqual(
        resolveFAQContactCTA({
          title: '   ',
          description: '  ',
          buttonText: '   ',
          buttonHref: '/contact',
        }),
        undefined
      );
      assert.strictEqual(resolveFAQContactCTA({}), undefined);
    });

    void it('trims fields and omits whitespace-only title and description', () => {
      const resolved = resolveFAQContactCTA(
        {
          title: '  Need direct help?  ',
          description: '   ',
          buttonText: '  Message Team  ',
          buttonHref: '  /contact  ',
          buttonVariant: 'secondary',
        },
        'light'
      );

      assert.deepStrictEqual(resolved, {
        title: 'Need direct help?',
        buttonText: 'Message Team',
        buttonHref: '/contact',
        buttonTarget: '_self',
        isExternal: false,
        buttonVariant: 'secondary',
        buttonClasses: getFAQButtonClasses('secondary', 'light'),
      });
      assert.strictEqual('description' in resolved, false);
      assert.strictEqual('rel' in resolved, false);

      const onlyButton = resolveFAQContactCTA(
        {
          title: '  ',
          description: '',
          buttonText: '  Reach Out  ',
          buttonHref: '/reach-out',
        },
        'dark'
      );
      assert.deepStrictEqual(onlyButton, {
        buttonText: 'Reach Out',
        buttonHref: '/reach-out',
        buttonTarget: '_self',
        isExternal: false,
        buttonVariant: 'primary',
        buttonClasses: getFAQButtonClasses('primary', 'dark'),
      });
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
        const resolved = resolveFAQContactCTA({
          title: 'Questions?',
          buttonText: 'Contact',
          buttonHref: unsafeHref,
        });

        assert.ok(resolved);
        assert.strictEqual(resolved.buttonHref, '#');
        assert.strictEqual(resolved.buttonTarget, '_self');
        assert.strictEqual(resolved.isExternal, false);
        assert.strictEqual('rel' in resolved, false);
      }
    });

    void it('auto-detects external URLs and attaches rel noopener noreferrer when target is omitted', () => {
      for (const externalHref of [
        'https://example.com/support',
        'http://example.com/help',
        '//support.example.com/chat',
      ]) {
        const resolved = resolveFAQContactCTA({
          buttonText: 'Open Portal',
          buttonHref: externalHref,
        });

        assert.ok(resolved);
        assert.strictEqual(resolved.buttonHref, externalHref);
        assert.strictEqual(resolved.buttonTarget, '_blank');
        assert.strictEqual(resolved.isExternal, true);
        assert.strictEqual(resolved.rel, 'noopener noreferrer');
      }
    });

    void it('honors explicit _blank on internal paths and explicit _self on external URLs', () => {
      const internalBlank = resolveFAQContactCTA({
        buttonText: 'Help Guide',
        buttonHref: '/help/guide',
        buttonTarget: '_blank',
      });
      assert.ok(internalBlank);
      assert.strictEqual(internalBlank.buttonTarget, '_blank');
      assert.strictEqual(internalBlank.isExternal, true);
      assert.strictEqual(internalBlank.rel, 'noopener noreferrer');

      const externalSelf = resolveFAQContactCTA({
        buttonText: 'Partner Desk',
        buttonHref: 'https://example.org/contact',
        buttonTarget: '_self',
      });
      assert.ok(externalSelf);
      assert.strictEqual(externalSelf.buttonTarget, '_self');
      assert.strictEqual(externalSelf.isExternal, false);
      assert.strictEqual('rel' in externalSelf, false);
    });

    void it('keeps /paths, #anchors, mailto:, and tel: as _self with isExternal false and no rel', () => {
      for (const localHref of [
        '/contact',
        '#contact-form',
        'mailto:info@example.com',
        'tel:+15550199',
      ]) {
        const resolved = resolveFAQContactCTA({
          buttonText: 'Reach Team',
          buttonHref: localHref,
        });

        assert.ok(resolved);
        assert.strictEqual(resolved.buttonHref, localHref);
        assert.strictEqual(resolved.buttonTarget, '_self');
        assert.strictEqual(resolved.isExternal, false);
        assert.strictEqual('rel' in resolved, false);
      }
    });

    void it('resolves buttonVariant and buttonClasses per theme and falls back invalid variant to primary', () => {
      const validOutlineLight = resolveFAQContactCTA(
        {
          buttonText: 'Contact',
          buttonHref: '/contact',
          buttonVariant: 'outline',
        },
        'light'
      );
      assert.ok(validOutlineLight);
      assert.strictEqual(validOutlineLight.buttonVariant, 'outline');
      assert.strictEqual(validOutlineLight.buttonClasses, getFAQButtonClasses('outline', 'light'));

      const invalidVariantDark = resolveFAQContactCTA(
        {
          buttonText: 'Contact',
          buttonHref: '/contact',
          buttonVariant: 'floating' as unknown as CTAButtonVariant,
        },
        'dark'
      );
      assert.ok(invalidVariantDark);
      assert.strictEqual(invalidVariantDark.buttonVariant, 'primary');
      assert.strictEqual(invalidVariantDark.buttonClasses, getFAQButtonClasses('primary', 'dark'));
    });
  });

  void describe('resolveFAQ1Props', () => {
    void it('resolves empty props to complete defaults', () => {
      const resolved = resolveFAQ1Props({});

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getFAQThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.eyebrow, DEFAULT_FAQ1_DATA.eyebrow);
      assert.strictEqual(resolved.heading, DEFAULT_FAQ1_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_FAQ1_DATA.description);
      assert.deepStrictEqual(resolved.items, DEFAULT_FAQ1_DATA.items);
      assert.strictEqual(resolved.defaultOpenIndex, 0);
      assert.strictEqual(resolved.allowMultipleOpen, false);
    });

    void it('preserves custom theme, layout including 0px, trimmed text, filtered items, and allowMultipleOpen', () => {
      const resolved = resolveFAQ1Props({
        theme: 'dark',
        layout: { padding: '0px' },
        eyebrow: '  Support  ',
        heading: '  Common client questions  ',
        description: '  Clear answers before we begin.  ',
        items: [
          { question: '  Question 1  ', answer: '  Answer 1  ' },
          { question: '   ', answer: 'Skipped' },
          { question: '  Question 2  ', answer: '  Answer 2  ' },
        ],
        defaultOpenIndex: 1,
        allowMultipleOpen: true,
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getFAQThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.eyebrow, 'Support');
      assert.strictEqual(resolved.heading, 'Common client questions');
      assert.strictEqual(resolved.description, 'Clear answers before we begin.');
      assert.deepStrictEqual(resolved.items, [
        { question: 'Question 1', answer: 'Answer 1' },
        { question: 'Question 2', answer: 'Answer 2' },
      ]);
      assert.strictEqual(resolved.defaultOpenIndex, 1);
      assert.strictEqual(resolved.allowMultipleOpen, true);
    });

    void it('handles defaultOpenIndex edge cases, empty items, blank optional fields, and invalid runtime theme', () => {
      const negativeIndex = resolveFAQ1Props({ defaultOpenIndex: -1 });
      assert.strictEqual(negativeIndex.defaultOpenIndex, undefined);

      const outOfBounds = resolveFAQ1Props({
        items: [{ question: 'Q1', answer: 'A1' }],
        defaultOpenIndex: 1,
      });
      assert.strictEqual(outOfBounds.defaultOpenIndex, undefined);

      const shrunkAfterFiltering = resolveFAQ1Props({
        items: [
          { question: 'Q1', answer: 'A1' },
          { question: '   ', answer: 'Invalid' },
        ],
        defaultOpenIndex: 1,
      });
      assert.strictEqual(shrunkAfterFiltering.items.length, 1);
      assert.strictEqual(shrunkAfterFiltering.defaultOpenIndex, undefined);

      const floatIndex = resolveFAQ1Props({ defaultOpenIndex: 1.5 });
      assert.strictEqual(floatIndex.defaultOpenIndex, undefined);

      const nanIndex = resolveFAQ1Props({ defaultOpenIndex: Number.NaN });
      assert.strictEqual(nanIndex.defaultOpenIndex, undefined);

      const emptyItems = resolveFAQ1Props({ items: [] });
      assert.deepStrictEqual(emptyItems.items, []);
      assert.strictEqual(emptyItems.defaultOpenIndex, undefined);

      const blankFieldsAndInvalidTheme = resolveFAQ1Props({
        theme: 'charcoal' as unknown as 'dark' | 'light',
        eyebrow: '   ',
        heading: '   ',
        description: '  ',
      });
      assert.strictEqual(blankFieldsAndInvalidTheme.theme, 'light');
      assert.strictEqual(blankFieldsAndInvalidTheme.eyebrow, undefined);
      assert.strictEqual(blankFieldsAndInvalidTheme.heading, DEFAULT_FAQ1_DATA.heading);
      assert.strictEqual(blankFieldsAndInvalidTheme.description, undefined);
    });
  });

  void describe('resolveFAQ2Props', () => {
    void it('resolves empty props to complete defaults including dark theme and contactCta', () => {
      const resolved = resolveFAQ2Props({});

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getFAQThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.badge, DEFAULT_FAQ2_DATA.badge);
      assert.strictEqual(resolved.heading, DEFAULT_FAQ2_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_FAQ2_DATA.description);
      assert.deepStrictEqual(resolved.items, DEFAULT_FAQ2_DATA.items);
      assert.strictEqual(resolved.defaultOpenIndex, 0);
      assert.strictEqual(resolved.allowMultipleOpen, false);
      assert.deepStrictEqual(resolved.contactCta, {
        title: 'Still have questions?',
        description: DEFAULT_FAQ2_DATA.contactCta?.description,
        buttonText: 'Contact Us',
        buttonHref: '/contact',
        buttonTarget: '_self',
        isExternal: false,
        buttonVariant: 'primary',
        buttonClasses: getFAQButtonClasses('primary', 'dark'),
      });
    });

    void it('preserves explicit light theme, layout including 0px, badge, filtered items, contactCta, and allowMultipleOpen', () => {
      const resolved = resolveFAQ2Props({
        theme: 'light',
        layout: { padding: '0px' },
        badge: '  Help Center  ',
        heading: '  Client handbook  ',
        description: '  Everything you need to know.  ',
        items: [
          { question: '  Q1  ', answer: '  A1  ' },
          { question: '  Q2  ', answer: '' },
          { question: '  Q3  ', answer: '  A3  ' },
        ],
        contactCta: {
          title: '  Talk to an advisor  ',
          description: '  Available Monday through Friday.  ',
          buttonText: '  Schedule Call  ',
          buttonHref: 'https://cal.example.com/intro',
          buttonVariant: 'outline',
        },
        defaultOpenIndex: 1,
        allowMultipleOpen: true,
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getFAQThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.badge, 'Help Center');
      assert.strictEqual(resolved.heading, 'Client handbook');
      assert.strictEqual(resolved.description, 'Everything you need to know.');
      assert.deepStrictEqual(resolved.items, [
        { question: 'Q1', answer: 'A1' },
        { question: 'Q3', answer: 'A3' },
      ]);
      assert.strictEqual(resolved.defaultOpenIndex, 1);
      assert.strictEqual(resolved.allowMultipleOpen, true);
      assert.deepStrictEqual(resolved.contactCta, {
        title: 'Talk to an advisor',
        description: 'Available Monday through Friday.',
        buttonText: 'Schedule Call',
        buttonHref: 'https://cal.example.com/intro',
        buttonTarget: '_blank',
        isExternal: true,
        rel: 'noopener noreferrer',
        buttonVariant: 'outline',
        buttonClasses: getFAQButtonClasses('outline', 'light'),
      });
    });

    void it('handles defaultOpenIndex edge cases, empty items, blank optional fields, invalid runtime theme, and blank contactCta', () => {
      const resolved = resolveFAQ2Props({
        theme: 'slate' as unknown as 'dark' | 'light',
        badge: '   ',
        heading: '   ',
        description: '',
        items: [],
        contactCta: {
          title: '   ',
          description: '  ',
          buttonText: '  ',
          buttonHref: '/contact',
        },
        defaultOpenIndex: 0,
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.strictEqual(resolved.badge, undefined);
      assert.strictEqual(resolved.heading, DEFAULT_FAQ2_DATA.heading);
      assert.strictEqual(resolved.description, undefined);
      assert.deepStrictEqual(resolved.items, []);
      assert.strictEqual(resolved.defaultOpenIndex, undefined);
      assert.strictEqual(resolved.contactCta, undefined);

      assert.strictEqual(resolveFAQ2Props({ defaultOpenIndex: -1 }).defaultOpenIndex, undefined);
      assert.strictEqual(resolveFAQ2Props({ defaultOpenIndex: 99 }).defaultOpenIndex, undefined);
      assert.strictEqual(resolveFAQ2Props({ defaultOpenIndex: 2.2 }).defaultOpenIndex, undefined);
      assert.strictEqual(
        resolveFAQ2Props({ defaultOpenIndex: Number.NaN }).defaultOpenIndex,
        undefined
      );
    });
  });
});
