import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FOOTER_MULTI_COLUMN_DATA,
  DEFAULT_FOOTER_SPLIT_DATA,
  Facebook,
  getFooterThemeClasses,
  getSocialIcon,
  Github,
  Globe,
  Instagram,
  isExternalLink,
  Linkedin,
  Pinterest,
  Twitter,
  Youtube,
} from './footer-utils.ts';
import type { SocialPlatform } from '../types.ts';

const THEME_CLASS_KEYS = [
  'wrapper',
  'heading',
  'text',
  'mutedText',
  'link',
  'border',
  'badge',
  'disclaimer',
] as const;

const FORBIDDEN_THEME_PATTERNS = [
  /shadow/,
  /stone/,
  /zinc/,
  /tracking-tight/,
  /tracking-wide/,
  /tracking-wider/,
  /tracking-widest/,
];

void describe('footer-utils', () => {
  void describe('getFooterThemeClasses', () => {
    void it('returns pure white classes for light theme', () => {
      const light = getFooterThemeClasses('light');
      assert.match(light.wrapper, /bg-white/);
      assert.match(light.wrapper, /text-black/);
      assert.match(light.wrapper, /border-neutral-200/);
      assert.match(light.wrapper, /tracking-normal/);
      assert.match(light.heading, /text-black/);
      assert.match(light.heading, /tracking-normal/);
      assert.match(light.text, /text-black/);
      assert.match(light.text, /tracking-normal/);
      assert.match(light.mutedText, /text-neutral-600/);
      assert.match(light.mutedText, /tracking-normal/);
      assert.match(light.link, /text-neutral-700/);
      assert.match(light.link, /hover:text-black/);
      assert.match(light.link, /tracking-normal/);
      assert.match(light.border, /border-neutral-200/);
      assert.match(light.badge, /bg-neutral-100/);
      assert.match(light.badge, /text-neutral-700/);
      assert.match(light.badge, /border-neutral-200/);
      assert.match(light.badge, /tracking-normal/);
      assert.match(light.disclaimer, /text-neutral-600/);
      assert.match(light.disclaimer, /border-neutral-200/);
      assert.match(light.disclaimer, /tracking-normal/);

      for (const key of THEME_CLASS_KEYS) {
        for (const pattern of FORBIDDEN_THEME_PATTERNS) {
          assert.doesNotMatch(light[key], pattern);
        }
      }
    });

    void it('returns pure black classes for dark theme', () => {
      const dark = getFooterThemeClasses('dark');
      assert.match(dark.wrapper, /bg-black/);
      assert.match(dark.wrapper, /text-white/);
      assert.match(dark.wrapper, /border-neutral-800/);
      assert.match(dark.wrapper, /tracking-normal/);
      assert.match(dark.heading, /text-white/);
      assert.match(dark.heading, /tracking-normal/);
      assert.match(dark.text, /text-white/);
      assert.match(dark.text, /tracking-normal/);
      assert.match(dark.mutedText, /text-neutral-400/);
      assert.match(dark.mutedText, /tracking-normal/);
      assert.match(dark.link, /text-neutral-300/);
      assert.match(dark.link, /hover:text-white/);
      assert.match(dark.link, /tracking-normal/);
      assert.match(dark.border, /border-neutral-800/);
      assert.match(dark.badge, /bg-neutral-900/);
      assert.match(dark.badge, /text-neutral-300/);
      assert.match(dark.badge, /border-neutral-800/);
      assert.match(dark.badge, /tracking-normal/);
      assert.match(dark.disclaimer, /text-neutral-400/);
      assert.match(dark.disclaimer, /border-neutral-800/);
      assert.match(dark.disclaimer, /tracking-normal/);

      for (const key of THEME_CLASS_KEYS) {
        for (const pattern of FORBIDDEN_THEME_PATTERNS) {
          assert.doesNotMatch(dark[key], pattern);
        }
      }
    });

    void it('contains all required keys with non-empty string values', () => {
      for (const theme of ['light', 'dark'] as const) {
        const classes = getFooterThemeClasses(theme);
        for (const key of THEME_CLASS_KEYS) {
          assert.strictEqual(typeof classes[key], 'string');
          assert.ok(classes[key].length > 0, `Key ${key} should not be empty for theme ${theme}`);
        }
      }
    });
  });

  void describe('getSocialIcon', () => {
    void it('maps each supported social platform to its corresponding Lucide icon component', () => {
      const platforms: SocialPlatform[] = [
        'linkedin',
        'twitter',
        'facebook',
        'youtube',
        'instagram',
        'github',
        'pinterest',
      ];
      const expectedIcons = [Linkedin, Twitter, Facebook, Youtube, Instagram, Github, Pinterest];

      platforms.forEach((platform, index) => {
        const icon = getSocialIcon(platform);
        assert.strictEqual(icon, expectedIcons[index]);
        assert.ok(
          typeof icon === 'function' || typeof icon === 'object',
          `${platform} icon must be a valid component`
        );
      });
    });

    void it('handles case-insensitivity and whitespace for known platforms', () => {
      assert.strictEqual(getSocialIcon('  LinkedIn  '), Linkedin);
      assert.strictEqual(getSocialIcon('TWITTER'), Twitter);
      assert.strictEqual(getSocialIcon('GitHub '), Github);
      assert.strictEqual(getSocialIcon(' PINTEREST '), Pinterest);
    });

    void it('returns Globe fallback icon for unknown or invalid platform string', () => {
      assert.strictEqual(getSocialIcon('unknown-platform'), Globe);
      assert.strictEqual(getSocialIcon('threads'), Globe);
      assert.strictEqual(getSocialIcon(''), Globe);
      assert.strictEqual(getSocialIcon(undefined), Globe);
    });
  });

  void describe('isExternalLink', () => {
    void it('identifies absolute external URLs', () => {
      assert.strictEqual(isExternalLink('https://example.com'), true);
      assert.strictEqual(isExternalLink('http://sub.domain.org'), true);
      assert.strictEqual(isExternalLink('//cdn.site.com'), true);
      assert.strictEqual(isExternalLink('https://portal.vanguardsterling.law/login'), true);
    });

    void it('identifies internal and protocol links as non-external', () => {
      assert.strictEqual(isExternalLink('/practices/corporate'), false);
      assert.strictEqual(isExternalLink('/'), false);
      assert.strictEqual(isExternalLink('#overview'), false);
      assert.strictEqual(isExternalLink('mailto:counsel@firm.law'), false);
      assert.strictEqual(isExternalLink('tel:+12125550190'), false);
    });

    void it('handles empty, undefined, and whitespace strings safely', () => {
      assert.strictEqual(isExternalLink(''), false);
      assert.strictEqual(isExternalLink('   '), false);
      assert.strictEqual(isExternalLink(null), false);
      assert.strictEqual(isExternalLink(undefined), false);
    });
  });

  void describe('Default Data Fixtures', () => {
    void it('DEFAULT_FOOTER_MULTI_COLUMN_DATA has authentic legal content and structure', () => {
      assert.ok(
        DEFAULT_FOOTER_MULTI_COLUMN_DATA.firmName.length > 0,
        'firmName should not be empty'
      );
      assert.strictEqual(DEFAULT_FOOTER_MULTI_COLUMN_DATA.firmName, 'Vanguard & Sterling LLP');
      assert.ok(
        (DEFAULT_FOOTER_MULTI_COLUMN_DATA.offices?.length ?? 0) >= 3,
        'Should have at least 3 office locations'
      );
      assert.ok(
        (DEFAULT_FOOTER_MULTI_COLUMN_DATA.columns?.length ?? 0) >= 3,
        'Should have at least 3 columns'
      );
      assert.ok(
        DEFAULT_FOOTER_MULTI_COLUMN_DATA.legalDisclaimer?.includes('ATTORNEY ADVERTISING'),
        'Legal disclaimer must contain ATTORNEY ADVERTISING'
      );
      assert.ok(
        (DEFAULT_FOOTER_MULTI_COLUMN_DATA.socialLinks?.length ?? 0) >= 3,
        'Should provide social links'
      );
    });

    void it('DEFAULT_FOOTER_SPLIT_DATA has authentic editorial statement and direct coordinates', () => {
      assert.ok(
        DEFAULT_FOOTER_SPLIT_DATA.statementQuote.length > 0,
        'statementQuote should not be empty'
      );
      assert.strictEqual(DEFAULT_FOOTER_SPLIT_DATA.firmName, 'Vanguard & Sterling LLP');
      assert.ok(DEFAULT_FOOTER_SPLIT_DATA.primaryEmail, 'Should have primaryEmail');
      assert.ok(DEFAULT_FOOTER_SPLIT_DATA.primaryPhone, 'Should have primaryPhone');
      assert.ok(DEFAULT_FOOTER_SPLIT_DATA.primaryAddress, 'Should have primaryAddress');
      assert.strictEqual(
        DEFAULT_FOOTER_SPLIT_DATA.showBackToTop,
        true,
        'showBackToTop should default to true'
      );
      assert.ok(
        DEFAULT_FOOTER_SPLIT_DATA.legalDisclaimer?.includes('ATTORNEY ADVERTISING'),
        'Legal disclaimer must contain ATTORNEY ADVERTISING'
      );
    });
  });
});
