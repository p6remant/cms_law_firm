import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CTA1_DATA,
  DEFAULT_CTA2_DATA,
  getCTAButtonClasses,
  getCTAThemeClasses,
  resolveCTA1Props,
  resolveCTA2Props,
  resolveCTAButton,
} from './cta-utils.ts';
import type { CTAActionType, CTAButtonVariant } from '../types.ts';

const CTA_THEME_CLASS_KEYS = [
  'wrapper',
  'surface',
  'eyebrow',
  'heading',
  'text',
  'mutedText',
  'badge',
  'border',
  'input',
  'disclaimer',
  'featureIcon',
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

void describe('cta-utils', () => {
  void describe('getCTAThemeClasses', () => {
    void it('returns pure white and neutral grayscale classes for light theme', () => {
      const light = getCTAThemeClasses('light');

      assert.match(light.wrapper, /\bbg-white\b/);
      assert.match(light.wrapper, /\btext-black\b/);
      assert.match(light.wrapper, /\bborder-neutral-200\b/);
      assert.match(light.wrapper, /\btracking-normal\b/);

      assert.match(light.surface, /\bbg-neutral-50\b/);
      assert.match(light.surface, /\bborder-neutral-200\b/);
      assert.match(light.surface, /\btext-black\b/);
      assert.match(light.surface, /\btracking-normal\b/);

      assert.match(light.eyebrow, /\btext-neutral-600\b/);
      assert.match(light.eyebrow, /\btracking-normal\b/);

      assert.match(light.heading, /\btext-black\b/);
      assert.match(light.heading, /\btracking-normal\b/);

      assert.match(light.text, /\btext-black\b/);
      assert.match(light.text, /\btracking-normal\b/);

      assert.match(light.mutedText, /\btext-neutral-600\b/);
      assert.match(light.mutedText, /\btracking-normal\b/);

      assert.match(light.badge, /\bbg-neutral-100\b/);
      assert.match(light.badge, /\btext-neutral-800\b/);
      assert.match(light.badge, /\bborder-neutral-200\b/);
      assert.match(light.badge, /\btracking-normal\b/);

      assert.match(light.border, /\bborder-neutral-200\b/);

      assert.match(light.input, /\bbg-white\b/);
      assert.match(light.input, /\btext-black\b/);
      assert.match(light.input, /\bborder-neutral-300\b/);
      assert.match(light.input, /\bfocus:border-black\b/);
      assert.match(light.input, /\btracking-normal\b/);

      assert.match(light.disclaimer, /\btext-neutral-600\b/);
      assert.match(light.disclaimer, /\btracking-normal\b/);

      assert.match(light.featureIcon, /\btext-black\b/);

      for (const key of CTA_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(light[key], `light.${key}`);
      }
    });

    void it('returns pure black and neutral grayscale classes for dark theme', () => {
      const dark = getCTAThemeClasses('dark');

      assert.match(dark.wrapper, /\bbg-black\b/);
      assert.match(dark.wrapper, /\btext-white\b/);
      assert.match(dark.wrapper, /\bborder-neutral-800\b/);
      assert.match(dark.wrapper, /\btracking-normal\b/);

      assert.match(dark.surface, /\bbg-neutral-950\b/);
      assert.match(dark.surface, /\bborder-neutral-800\b/);
      assert.match(dark.surface, /\btext-white\b/);
      assert.match(dark.surface, /\btracking-normal\b/);

      assert.match(dark.eyebrow, /\btext-neutral-400\b/);
      assert.match(dark.eyebrow, /\btracking-normal\b/);

      assert.match(dark.heading, /\btext-white\b/);
      assert.match(dark.heading, /\btracking-normal\b/);

      assert.match(dark.text, /\btext-white\b/);
      assert.match(dark.text, /\btracking-normal\b/);

      assert.match(dark.mutedText, /\btext-neutral-400\b/);
      assert.match(dark.mutedText, /\btracking-normal\b/);

      assert.match(dark.badge, /\bbg-neutral-900\b/);
      assert.match(dark.badge, /\btext-neutral-200\b/);
      assert.match(dark.badge, /\bborder-neutral-800\b/);
      assert.match(dark.badge, /\btracking-normal\b/);

      assert.match(dark.border, /\bborder-neutral-800\b/);

      assert.match(dark.input, /\bbg-black\b/);
      assert.match(dark.input, /\btext-white\b/);
      assert.match(dark.input, /\bborder-neutral-700\b/);
      assert.match(dark.input, /\bfocus:border-white\b/);
      assert.match(dark.input, /\btracking-normal\b/);

      assert.match(dark.disclaimer, /\btext-neutral-400\b/);
      assert.match(dark.disclaimer, /\btracking-normal\b/);

      assert.match(dark.featureIcon, /\btext-white\b/);

      for (const key of CTA_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(dark[key], `dark.${key}`);
      }
    });

    void it('falls back safely to dark theme for unexpected runtime theme values', () => {
      const fallback = getCTAThemeClasses('sepia' as unknown as 'light' | 'dark');
      assert.deepStrictEqual(fallback, getCTAThemeClasses('dark'));
    });
  });

  void describe('getCTAButtonClasses', () => {
    void it('produces 8 distinct high-contrast pure black/white variant strings with tracking-normal and zero forbidden styles', () => {
      const variants: CTAButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost'];
      const themes = ['light', 'dark'] as const;
      const outputs: string[] = [];

      for (const theme of themes) {
        for (const variant of variants) {
          const classes = getCTAButtonClasses(variant, theme);
          outputs.push(classes);
          assertNoForbiddenClasses(classes, `${theme}.${variant}`);
          assert.match(classes, /\btracking-normal\b/);
          assert.match(classes, /\bborder\b/);
          assert.match(classes, /\btransition-colors\b/);
          assert.match(classes, /\bfocus-visible:outline-2\b/);
          assert.match(classes, /\bfocus-visible:outline-offset-2\b/);
          if (theme === 'light') {
            assert.match(classes, /\bfocus-visible:outline-black\b/);
          } else {
            assert.match(classes, /\bfocus-visible:outline-white\b/);
          }
        }
      }

      assert.strictEqual(new Set(outputs).size, 8);

      assert.match(getCTAButtonClasses('primary', 'light'), /\bbg-black\b/);
      assert.match(getCTAButtonClasses('primary', 'light'), /\btext-white\b/);
      assert.match(getCTAButtonClasses('primary', 'dark'), /\bbg-white\b/);
      assert.match(getCTAButtonClasses('primary', 'dark'), /\btext-black\b/);

      assert.match(getCTAButtonClasses('secondary', 'light'), /\bbg-neutral-100\b/);
      assert.match(getCTAButtonClasses('secondary', 'dark'), /\bbg-neutral-900\b/);

      assert.match(getCTAButtonClasses('outline', 'light'), /\bbg-transparent\b/);
      assert.match(getCTAButtonClasses('outline', 'dark'), /\bbg-transparent\b/);

      assert.match(getCTAButtonClasses('ghost', 'light'), /\bborder-transparent\b/);
      assert.match(getCTAButtonClasses('ghost', 'dark'), /\bborder-transparent\b/);
    });

    void it('falls back safely to primary variant for invalid runtime variants', () => {
      const invalidVariant = 'neon' as unknown as CTAButtonVariant;
      assert.strictEqual(
        getCTAButtonClasses(invalidVariant, 'light'),
        getCTAButtonClasses('primary', 'light')
      );
      assert.strictEqual(
        getCTAButtonClasses(invalidVariant, 'dark'),
        getCTAButtonClasses('primary', 'dark')
      );
    });
  });

  void describe('resolveCTAButton', () => {
    void it('resolves undefined button using fallbackText and fallbackVariant with safe defaults', () => {
      const resolved = resolveCTAButton(undefined, '  Get Started  ', 'outline');

      assert.deepStrictEqual(resolved, {
        text: 'Get Started',
        href: '#',
        target: '_self',
        isExternal: false,
        variant: 'outline',
      });
      assert.strictEqual('rel' in resolved, false);
    });

    void it('trims text and href while preserving valid variant and target', () => {
      const resolved = resolveCTAButton({
        text: '  Contact Us  ',
        href: '  /contact  ',
        target: '_self',
        variant: 'secondary',
      });

      assert.deepStrictEqual(resolved, {
        text: 'Contact Us',
        href: '/contact',
        target: '_self',
        isExternal: false,
        variant: 'secondary',
      });
      assert.strictEqual('rel' in resolved, false);
    });

    void it('auto-detects external URLs when target is omitted and attaches rel noopener noreferrer', () => {
      for (const externalHref of [
        'https://example.com/portal',
        'http://example.com/guide',
        '//cdn.example.com/asset',
      ]) {
        const resolved = resolveCTAButton({
          text: 'Open Link',
          href: externalHref,
        });

        assert.deepStrictEqual(resolved, {
          text: 'Open Link',
          href: externalHref,
          target: '_blank',
          isExternal: true,
          rel: 'noopener noreferrer',
          variant: 'primary',
        });
      }
    });

    void it('honors explicit target _blank on internal paths', () => {
      const resolved = resolveCTAButton({
        text: 'Client Guide',
        href: '/guides/overview',
        target: '_blank',
        variant: 'ghost',
      });

      assert.deepStrictEqual(resolved, {
        text: 'Client Guide',
        href: '/guides/overview',
        target: '_blank',
        isExternal: true,
        rel: 'noopener noreferrer',
        variant: 'ghost',
      });
    });

    void it('honors explicit target _self on external URLs and omits rel', () => {
      const resolved = resolveCTAButton({
        text: 'Partner Site',
        href: 'https://example.org',
        target: '_self',
      });

      assert.deepStrictEqual(resolved, {
        text: 'Partner Site',
        href: 'https://example.org',
        target: '_self',
        isExternal: false,
        variant: 'primary',
      });
      assert.strictEqual('rel' in resolved, false);
    });

    void it('keeps internal paths, anchors, mailto:, and tel: as _self with isExternal false', () => {
      for (const localHref of [
        '/about',
        '#newsletter',
        'mailto:hello@example.com',
        'tel:+15550100',
      ]) {
        const resolved = resolveCTAButton({
          text: 'Action',
          href: localHref,
        });

        assert.strictEqual(resolved.href, localHref);
        assert.strictEqual(resolved.target, '_self');
        assert.strictEqual(resolved.isExternal, false);
        assert.strictEqual('rel' in resolved, false);
      }
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
        const resolved = resolveCTAButton({
          text: 'Safe Button',
          href: unsafeHref,
        });

        assert.strictEqual(resolved.href, '#');
        assert.strictEqual(resolved.target, '_self');
        assert.strictEqual(resolved.isExternal, false);
        assert.strictEqual('rel' in resolved, false);
      }
    });

    void it('falls back whitespace-only text to fallbackText or empty string when no fallback exists', () => {
      const withFallback = resolveCTAButton(
        { text: '   ', href: '/contact' },
        '  Fallback Label  '
      );
      assert.strictEqual(withFallback.text, 'Fallback Label');

      const withoutFallback = resolveCTAButton({ text: '   ', href: '/contact' });
      assert.strictEqual(withoutFallback.text, '');
    });

    void it('falls back invalid variant to valid fallbackVariant and then primary', () => {
      const usesFallback = resolveCTAButton(
        { text: 'Action', variant: 'pill' as unknown as CTAButtonVariant },
        undefined,
        'outline'
      );
      assert.strictEqual(usesFallback.variant, 'outline');

      const defaultsPrimary = resolveCTAButton(
        { text: 'Action', variant: 'pill' as unknown as CTAButtonVariant },
        undefined,
        'invalid' as unknown as CTAButtonVariant
      );
      assert.strictEqual(defaultsPrimary.variant, 'primary');
    });
  });

  void describe('DEFAULT_CTA1_DATA and resolveCTA1Props', () => {
    void it('provides generic non-niche defaults in DEFAULT_CTA1_DATA', () => {
      assert.strictEqual(DEFAULT_CTA1_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_CTA1_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_CTA1_DATA.actionType, 'newsletter');
      assert.strictEqual(DEFAULT_CTA1_DATA.eyebrow, 'Newsletter');
      assert.ok(DEFAULT_CTA1_DATA.heading.length > 0);
      assert.ok((DEFAULT_CTA1_DATA.description ?? '').length > 0);
      assert.strictEqual(DEFAULT_CTA1_DATA.newsletterPlaceholder, 'Enter your email address');
      assert.strictEqual(DEFAULT_CTA1_DATA.newsletterButtonText, 'Subscribe');
      assert.strictEqual(DEFAULT_CTA1_DATA.newsletterButtonVariant, 'primary');
      assert.ok((DEFAULT_CTA1_DATA.disclaimer ?? '').length > 0);
      assert.strictEqual(DEFAULT_CTA1_DATA.primaryButton?.text, 'Get Started');
      assert.strictEqual(DEFAULT_CTA1_DATA.secondaryButton?.text, 'Learn More');
    });

    void it('resolves empty props to complete defaults with dark theme and button classes', () => {
      const resolved = resolveCTA1Props({});

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getCTAThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.actionType, 'newsletter');
      assert.strictEqual(resolved.eyebrow, DEFAULT_CTA1_DATA.eyebrow);
      assert.strictEqual(resolved.heading, DEFAULT_CTA1_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_CTA1_DATA.description);
      assert.strictEqual(resolved.newsletterPlaceholder, DEFAULT_CTA1_DATA.newsletterPlaceholder);
      assert.strictEqual(resolved.newsletterButtonText, DEFAULT_CTA1_DATA.newsletterButtonText);
      assert.strictEqual(resolved.newsletterButtonVariant, 'primary');
      assert.strictEqual(resolved.newsletterButtonClasses, getCTAButtonClasses('primary', 'dark'));
      assert.strictEqual(resolved.disclaimer, DEFAULT_CTA1_DATA.disclaimer);
      assert.deepStrictEqual(resolved.primaryButton, {
        text: 'Get Started',
        href: '/contact',
        target: '_self',
        isExternal: false,
        variant: 'primary',
      });
      assert.strictEqual(resolved.primaryButtonClasses, getCTAButtonClasses('primary', 'dark'));
      assert.deepStrictEqual(resolved.secondaryButton, {
        text: 'Learn More',
        href: '/about',
        target: '_self',
        isExternal: false,
        variant: 'outline',
      });
      assert.strictEqual(resolved.secondaryButtonClasses, getCTAButtonClasses('outline', 'dark'));
    });

    void it('resolves button mode with light theme and custom buttons', () => {
      const resolved = resolveCTA1Props({
        theme: 'light',
        layout: { padding: '32px' },
        actionType: 'button',
        eyebrow: '  Updates  ',
        heading: '  Begin your project today  ',
        description: '  Clear plans for growing teams.  ',
        primaryButton: {
          text: '  Start Free  ',
          href: 'https://portal.example.com/start',
          variant: 'secondary',
        },
        secondaryButton: {
          text: '  Documentation  ',
          href: '/docs',
          variant: 'ghost',
        },
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getCTAThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '32px' });
      assert.strictEqual(resolved.actionType, 'button');
      assert.strictEqual(resolved.eyebrow, 'Updates');
      assert.strictEqual(resolved.heading, 'Begin your project today');
      assert.strictEqual(resolved.description, 'Clear plans for growing teams.');
      assert.deepStrictEqual(resolved.primaryButton, {
        text: 'Start Free',
        href: 'https://portal.example.com/start',
        target: '_blank',
        isExternal: true,
        rel: 'noopener noreferrer',
        variant: 'secondary',
      });
      assert.strictEqual(resolved.primaryButtonClasses, getCTAButtonClasses('secondary', 'light'));
      assert.deepStrictEqual(resolved.secondaryButton, {
        text: 'Documentation',
        href: '/docs',
        target: '_self',
        isExternal: false,
        variant: 'ghost',
      });
      assert.strictEqual(resolved.secondaryButtonClasses, getCTAButtonClasses('ghost', 'light'));
    });

    void it('sanitizes blank fields, omits empty buttons, and falls back invalid runtime enums', () => {
      const resolved = resolveCTA1Props({
        theme: 'midnight' as unknown as 'dark' | 'light',
        actionType: 'modal' as unknown as CTAActionType,
        eyebrow: '   ',
        heading: '   ',
        description: '',
        newsletterPlaceholder: '  ',
        newsletterButtonText: ' ',
        newsletterButtonVariant: 'rounded' as unknown as CTAButtonVariant,
        disclaimer: '   ',
        primaryButton: { text: '   ', href: '/contact' },
        secondaryButton: { text: '', href: '/about' },
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.strictEqual(resolved.actionType, 'newsletter');
      assert.strictEqual(resolved.eyebrow, undefined);
      assert.strictEqual(resolved.heading, DEFAULT_CTA1_DATA.heading);
      assert.strictEqual(resolved.description, undefined);
      assert.strictEqual(resolved.newsletterPlaceholder, DEFAULT_CTA1_DATA.newsletterPlaceholder);
      assert.strictEqual(resolved.newsletterButtonText, DEFAULT_CTA1_DATA.newsletterButtonText);
      assert.strictEqual(resolved.newsletterButtonVariant, 'primary');
      assert.strictEqual(resolved.newsletterButtonClasses, getCTAButtonClasses('primary', 'dark'));
      assert.strictEqual(resolved.disclaimer, undefined);
      assert.strictEqual(resolved.primaryButton, undefined);
      assert.strictEqual(resolved.primaryButtonClasses, undefined);
      assert.strictEqual(resolved.secondaryButton, undefined);
      assert.strictEqual(resolved.secondaryButtonClasses, undefined);
    });
  });

  void describe('DEFAULT_CTA2_DATA and resolveCTA2Props', () => {
    void it('provides generic non-niche defaults with 3 features and dual buttons', () => {
      assert.strictEqual(DEFAULT_CTA2_DATA.theme, 'light');
      assert.deepStrictEqual(DEFAULT_CTA2_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_CTA2_DATA.badge, 'Get Started');
      assert.ok(DEFAULT_CTA2_DATA.heading.length > 0);
      assert.ok((DEFAULT_CTA2_DATA.description ?? '').length > 0);
      assert.strictEqual(DEFAULT_CTA2_DATA.features?.length, 3);
      assert.strictEqual(DEFAULT_CTA2_DATA.primaryButton?.text, 'Schedule a Call');
      assert.strictEqual(DEFAULT_CTA2_DATA.secondaryButton?.text, 'Explore Services');
    });

    void it('resolves empty props with light theme classes, default features, and dual button classes', () => {
      const resolved = resolveCTA2Props({});

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getCTAThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.badge, DEFAULT_CTA2_DATA.badge);
      assert.strictEqual(resolved.heading, DEFAULT_CTA2_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_CTA2_DATA.description);
      assert.deepStrictEqual(resolved.features, DEFAULT_CTA2_DATA.features);
      assert.deepStrictEqual(resolved.primaryButton, {
        text: 'Schedule a Call',
        href: '/contact',
        target: '_self',
        isExternal: false,
        variant: 'primary',
      });
      assert.strictEqual(resolved.primaryButtonClasses, getCTAButtonClasses('primary', 'light'));
      assert.deepStrictEqual(resolved.secondaryButton, {
        text: 'Explore Services',
        href: '/services',
        target: '_self',
        isExternal: false,
        variant: 'outline',
      });
      assert.strictEqual(resolved.secondaryButtonClasses, getCTAButtonClasses('outline', 'light'));
    });

    void it('trims features, drops blank feature items, preserves empty arrays, and handles blank optional fields', () => {
      const resolved = resolveCTA2Props({
        theme: 'dark',
        layout: { padding: '48px' },
        badge: '   ',
        heading: '  Partner with our team  ',
        description: '  ',
        features: ['  Fast onboarding  ', '   ', '  Dedicated support  '],
        primaryButton: {
          text: '  Book Now  ',
          href: 'https://cal.example.com',
          variant: 'primary',
        },
        secondaryButton: { text: '   ', href: '/services' },
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getCTAThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '48px' });
      assert.strictEqual(resolved.badge, undefined);
      assert.strictEqual(resolved.heading, 'Partner with our team');
      assert.strictEqual(resolved.description, undefined);
      assert.deepStrictEqual(resolved.features, ['Fast onboarding', 'Dedicated support']);
      assert.deepStrictEqual(resolved.primaryButton, {
        text: 'Book Now',
        href: 'https://cal.example.com',
        target: '_blank',
        isExternal: true,
        rel: 'noopener noreferrer',
        variant: 'primary',
      });
      assert.strictEqual(resolved.primaryButtonClasses, getCTAButtonClasses('primary', 'dark'));
      assert.strictEqual(resolved.secondaryButton, undefined);
      assert.strictEqual(resolved.secondaryButtonClasses, undefined);

      const emptyFeaturesAndInvalidTheme = resolveCTA2Props({
        theme: 'monochrome' as unknown as 'dark' | 'light',
        heading: '   ',
        features: [],
      });

      assert.strictEqual(emptyFeaturesAndInvalidTheme.theme, 'light');
      assert.strictEqual(emptyFeaturesAndInvalidTheme.heading, DEFAULT_CTA2_DATA.heading);
      assert.deepStrictEqual(emptyFeaturesAndInvalidTheme.features, []);
    });
  });
});
