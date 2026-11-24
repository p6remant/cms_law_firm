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
  Twitter,
  Youtube,
} from './footer-utils.ts';
import type { SocialPlatform } from '../types.ts';

void describe('footer-utils', () => {
  void describe('getFooterThemeClasses', () => {
    void it('returns warm stone classes for light theme', () => {
      const light = getFooterThemeClasses('light');
      assert.match(light.wrapper, /bg-stone-50/);
      assert.match(light.wrapper, /border-stone-200/);
      assert.match(light.wrapper, /text-stone-900/);
      assert.match(light.heading, /text-stone-950/);
      assert.match(light.heading, /font-serif/);
      assert.match(light.mutedText, /text-stone-600/);
      assert.match(light.border, /border-stone-200/);
      assert.match(light.badge, /bg-stone-100/);
      assert.match(light.disclaimer, /text-stone-600/);
    });

    void it('returns obsidian/zinc classes for dark theme', () => {
      const dark = getFooterThemeClasses('dark');
      assert.match(dark.wrapper, /bg-zinc-950/);
      assert.match(dark.wrapper, /border-zinc-800/);
      assert.match(dark.wrapper, /text-zinc-100/);
      assert.match(dark.heading, /text-white/);
      assert.match(dark.heading, /font-serif/);
      assert.match(dark.mutedText, /text-zinc-400/);
      assert.match(dark.border, /border-zinc-800/);
      assert.match(dark.badge, /bg-zinc-900/);
      assert.match(dark.disclaimer, /text-zinc-400/);
    });

    void it('contains all required keys with non-empty string values', () => {
      const requiredKeys = [
        'wrapper',
        'heading',
        'text',
        'mutedText',
        'link',
        'border',
        'badge',
        'disclaimer',
      ] as const;

      for (const theme of ['light', 'dark'] as const) {
        const classes = getFooterThemeClasses(theme);
        for (const key of requiredKeys) {
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
      ];
      const expectedIcons = [Linkedin, Twitter, Facebook, Youtube, Instagram, Github];

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
