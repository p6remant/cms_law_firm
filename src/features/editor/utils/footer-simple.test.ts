import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FOOTER_SIMPLE_DATA,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Pinterest,
  resolveFooterSimpleProps,
  Twitter,
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

void describe('footer-simple helpers', () => {
  void describe('DEFAULT_FOOTER_SIMPLE_DATA', () => {
    void it('supplies the 4-column reference layout content and bottom bar links', () => {
      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_FOOTER_SIMPLE_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.brandName, 'COGNIA');
      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.brandSubtitle, 'ATTORNEYS AT LAW');
      assert.strictEqual(
        DEFAULT_FOOTER_SIMPLE_DATA.description,
        'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into.'
      );

      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.socialLinks?.length, 5);
      assert.deepStrictEqual(
        DEFAULT_FOOTER_SIMPLE_DATA.socialLinks.map((item) => item.platform),
        ['facebook', 'linkedin', 'pinterest', 'twitter', 'instagram']
      );

      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.contactTitle, 'Contact Info');
      assert.strictEqual(
        DEFAULT_FOOTER_SIMPLE_DATA.address,
        'Level 4, Heritage Plaza\nBabarmahal, Ramshah Path\nKathmandu 44600, Nepal'
      );
      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.phone, '+977 1-4256789');
      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.email, 'contact@cognialaw.com.np');

      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.linkColumns?.length, 2);
      const [practiceCol, secondaryCol] = DEFAULT_FOOTER_SIMPLE_DATA.linkColumns;
      assert.ok(practiceCol);
      assert.strictEqual(practiceCol.title, 'Practice Areas');
      assert.deepStrictEqual(
        practiceCol.links.map((link) => link.label),
        [
          'Family Violence',
          'Car Accident Insurance',
          'Public Company Fraud',
          'Privacy Matter',
          'Failure of Apple Acquisition',
        ]
      );

      assert.ok(secondaryCol);
      assert.strictEqual(secondaryCol.title, '');
      assert.deepStrictEqual(
        secondaryCol.links.map((link) => link.label),
        [
          'Giving Million Air Its Wings',
          "Making Sure It's Closed",
          'Nightmare on Wall Street',
          'Matrix Tax Invation',
        ]
      );

      assert.strictEqual(
        DEFAULT_FOOTER_SIMPLE_DATA.copyrightNotice,
        'Copyright 2026 Cognia, All Right Reserved'
      );

      assert.strictEqual(DEFAULT_FOOTER_SIMPLE_DATA.bottomLinks?.length, 5);
      assert.deepStrictEqual(
        DEFAULT_FOOTER_SIMPLE_DATA.bottomLinks.map((link) => link.label),
        ['Home', 'Cases', 'About', 'Legal', 'Privacy & Policy']
      );
    });
  });

  void describe('resolveFooterSimpleProps', () => {
    void it('resolves DEFAULT_FOOTER_SIMPLE_DATA with pure black dark theme and all fields', () => {
      const resolved = resolveFooterSimpleProps(DEFAULT_FOOTER_SIMPLE_DATA);

      assert.strictEqual(resolved.theme, 'dark');
      assert.match(resolved.themeClasses.wrapper, /bg-black/);
      assert.match(resolved.themeClasses.wrapper, /text-white/);
      assert.match(resolved.themeClasses.wrapper, /border-neutral-800/);
      assert.match(resolved.themeClasses.wrapper, /tracking-normal/);

      for (const key of THEME_CLASS_KEYS) {
        for (const pattern of FORBIDDEN_THEME_PATTERNS) {
          assert.doesNotMatch(resolved.themeClasses[key], pattern);
        }
      }

      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.brandName, 'COGNIA');
      assert.strictEqual(resolved.brandSubtitle, 'ATTORNEYS AT LAW');
      assert.strictEqual(resolved.description, DEFAULT_FOOTER_SIMPLE_DATA.description);
      assert.strictEqual(resolved.contactTitle, 'Contact Info');

      assert.deepStrictEqual(resolved.addressLines, [
        'Level 4, Heritage Plaza',
        'Babarmahal, Ramshah Path',
        'Kathmandu 44600, Nepal',
      ]);
      assert.strictEqual(resolved.phone, '+977 1-4256789');
      assert.strictEqual(resolved.phoneHref, 'tel:+97714256789');
      assert.strictEqual(resolved.email, 'contact@cognialaw.com.np');
      assert.strictEqual(resolved.emailHref, 'mailto:contact@cognialaw.com.np');

      assert.strictEqual(resolved.socialLinks.length, 5);
      assert.deepStrictEqual(
        resolved.socialLinks.map((item) => item.icon),
        [Facebook, Linkedin, Pinterest, Twitter, Instagram]
      );

      assert.strictEqual(resolved.linkColumns.length, 2);
      const [col1, col2] = resolved.linkColumns;
      assert.ok(col1);
      assert.strictEqual(col1.title, 'Practice Areas');
      assert.strictEqual(col1.links.length, 5);
      assert.ok(col2);
      assert.strictEqual(col2.title, '');
      assert.strictEqual(col2.links.length, 4);

      assert.strictEqual(resolved.copyrightNotice, 'Copyright 2026 Cognia, All Right Reserved');
      assert.strictEqual(resolved.bottomLinks.length, 5);
      assert.deepStrictEqual(
        resolved.bottomLinks.map((link) => link.label),
        ['Home', 'Cases', 'About', 'Legal', 'Privacy & Policy']
      );
    });

    void it('resolves pure white light theme classes when theme is light', () => {
      const resolved = resolveFooterSimpleProps({
        ...DEFAULT_FOOTER_SIMPLE_DATA,
        theme: 'light',
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.match(resolved.themeClasses.wrapper, /bg-white/);
      assert.match(resolved.themeClasses.wrapper, /text-black/);
      assert.match(resolved.themeClasses.wrapper, /border-neutral-200/);
      assert.match(resolved.themeClasses.wrapper, /tracking-normal/);
      assert.match(resolved.themeClasses.heading, /text-black/);
      assert.match(resolved.themeClasses.heading, /tracking-normal/);

      for (const key of THEME_CLASS_KEYS) {
        for (const pattern of FORBIDDEN_THEME_PATTERNS) {
          assert.doesNotMatch(resolved.themeClasses[key], pattern);
        }
      }
    });

    void it('normalizes blank optional fields, empty multiline addresses, invalid URIs, and preserves explicit empty arrays', () => {
      const resolved = resolveFooterSimpleProps({
        brandName: '   ',
        brandSubtitle: '   ',
        logoUrl: '',
        description: '  ',
        contactTitle: ' ',
        address: '  \n\r\n   \n ',
        phone: '   ',
        email: '',
        copyrightNotice: '  ',
        socialLinks: [],
        linkColumns: [],
        bottomLinks: [],
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.brandName, DEFAULT_FOOTER_SIMPLE_DATA.brandName);
      assert.strictEqual(resolved.brandSubtitle, undefined);
      assert.strictEqual(resolved.logoUrl, undefined);
      assert.strictEqual(resolved.description, undefined);
      assert.strictEqual(resolved.contactTitle, undefined);
      assert.deepStrictEqual(resolved.addressLines, []);
      assert.strictEqual(resolved.phone, undefined);
      assert.strictEqual(resolved.phoneHref, null);
      assert.strictEqual(resolved.email, undefined);
      assert.strictEqual(resolved.emailHref, null);
      assert.strictEqual(resolved.copyrightNotice, undefined);
      assert.deepStrictEqual(resolved.socialLinks, []);
      assert.deepStrictEqual(resolved.linkColumns, []);
      assert.deepStrictEqual(resolved.bottomLinks, []);

      const invalidContact = resolveFooterSimpleProps({
        brandName: '  Cognia Legal  ',
        address: '  Line One \r\n\r\n  Line Two  ',
        phone: 'Reception Desk',
        email: 'invalid-email',
      });

      assert.strictEqual(invalidContact.brandName, 'Cognia Legal');
      assert.deepStrictEqual(invalidContact.addressLines, ['Line One', 'Line Two']);
      assert.strictEqual(invalidContact.phone, 'Reception Desk');
      assert.strictEqual(invalidContact.phoneHref, null);
      assert.strictEqual(invalidContact.email, 'invalid-email');
      assert.strictEqual(invalidContact.emailHref, null);
    });

    void it('filters blank links, columns, and social items while keeping untitled columns with valid links', () => {
      const resolved = resolveFooterSimpleProps({
        brandName: 'COGNIA',
        socialLinks: [
          { platform: 'pinterest', href: '   ', label: 'Pinterest' },
          { platform: 'pinterest', href: ' https://www.pinterest.com/cognia ' },
          {
            platform: 'mastodon' as unknown as SocialPlatform,
            href: 'https://mastodon.social/@cognia',
            label: '  ',
          },
        ],
        linkColumns: [
          { title: '   ', links: [{ label: '   ', href: '   ' }] },
          {
            title: '   ',
            links: [
              { label: '  ', href: '  ' },
              { label: '  Case Results  ', href: ' /cases ' },
            ],
          },
          {
            title: '  Practice Areas  ',
            links: [{ label: '  Corporate  ', href: 'https://example.com/corporate' }],
          },
        ],
        bottomLinks: [
          { label: '  ', href: '  ' },
          { label: '  Home  ', href: ' / ' },
          { label: '  Client Portal  ', href: 'https://portal.cognialaw.com.np' },
        ],
      });

      assert.strictEqual(resolved.socialLinks.length, 2);
      const [pinterestItem, mastodonItem] = resolved.socialLinks;
      assert.ok(pinterestItem);
      assert.strictEqual(pinterestItem.icon, Pinterest);
      assert.strictEqual(pinterestItem.href, 'https://www.pinterest.com/cognia');
      assert.strictEqual(pinterestItem.label, 'pinterest');
      assert.ok(mastodonItem);
      assert.strictEqual(mastodonItem.icon, Globe);
      assert.strictEqual(mastodonItem.label, 'mastodon');

      assert.strictEqual(resolved.linkColumns.length, 2);
      const [untitledCol, titledCol] = resolved.linkColumns;
      assert.ok(untitledCol);
      assert.strictEqual(untitledCol.title, '');
      assert.strictEqual(untitledCol.links.length, 1);
      const [caseLink] = untitledCol.links;
      assert.ok(caseLink);
      assert.strictEqual(caseLink.label, 'Case Results');
      assert.strictEqual(caseLink.href, '/cases');
      assert.strictEqual(caseLink.isExternal, false);

      assert.ok(titledCol);
      assert.strictEqual(titledCol.title, 'Practice Areas');
      const [corpLink] = titledCol.links;
      assert.ok(corpLink);
      assert.strictEqual(corpLink.isExternal, true);
      assert.strictEqual(corpLink.target, '_blank');
      assert.strictEqual(corpLink.rel, 'noopener noreferrer');

      assert.strictEqual(resolved.bottomLinks.length, 2);
      const [homeLink, portalLink] = resolved.bottomLinks;
      assert.ok(homeLink);
      assert.strictEqual(homeLink.label, 'Home');
      assert.strictEqual(homeLink.href, '/');
      assert.strictEqual(homeLink.isExternal, false);
      assert.ok(portalLink);
      assert.strictEqual(portalLink.label, 'Client Portal');
      assert.strictEqual(portalLink.isExternal, true);
      assert.strictEqual(portalLink.target, '_blank');
      assert.strictEqual(portalLink.rel, 'noopener noreferrer');
    });
  });
});
