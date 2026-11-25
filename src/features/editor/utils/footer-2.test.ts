import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FOOTER_2_DATA,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Pinterest,
  resolveFooter2Props,
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

void describe('footer-2 helpers', () => {
  void describe('DEFAULT_FOOTER_2_DATA', () => {
    void it('supplies generic non-niche defaults with newsletter, 3 link columns, social links, bottom links, and back-to-top', () => {
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_FOOTER_2_DATA.layout, { padding: '64px' });
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.logoText, 'LOGO');
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.brandSubtitle, '');
      assert.strictEqual(
        DEFAULT_FOOTER_2_DATA.description,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      );

      assert.strictEqual(DEFAULT_FOOTER_2_DATA.showNewsletter, true);
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.newsletterHeading, 'Subscribe to our newsletter');
      assert.strictEqual(
        DEFAULT_FOOTER_2_DATA.newsletterDescription,
        'Stay up to date with the latest updates, insights, and announcements.'
      );
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.newsletterPlaceholder, 'Enter your email');
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.newsletterButtonText, 'Subscribe');

      assert.strictEqual(DEFAULT_FOOTER_2_DATA.logoUrl, undefined);
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.contactTitle, undefined);
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.address, undefined);
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.phone, undefined);
      assert.strictEqual(DEFAULT_FOOTER_2_DATA.email, undefined);

      assert.strictEqual(DEFAULT_FOOTER_2_DATA.linkColumns?.length, 3);
      const [productCol, resourcesCol, companyCol] = DEFAULT_FOOTER_2_DATA.linkColumns;
      assert.ok(productCol);
      assert.strictEqual(productCol.title, 'Product');
      assert.deepStrictEqual(
        productCol.links.map((link) => link.label),
        ['Overview', 'Features', 'Pricing', 'Releases']
      );

      assert.ok(resourcesCol);
      assert.strictEqual(resourcesCol.title, 'Resources');
      assert.deepStrictEqual(
        resourcesCol.links.map((link) => link.label),
        ['Documentation', 'Guides', 'Blog', 'Help Center']
      );

      assert.ok(companyCol);
      assert.strictEqual(companyCol.title, 'Company');
      assert.deepStrictEqual(
        companyCol.links.map((link) => link.label),
        ['About', 'Careers', 'Press', 'Contact']
      );

      assert.strictEqual(DEFAULT_FOOTER_2_DATA.socialLinks?.length, 5);
      assert.deepStrictEqual(
        DEFAULT_FOOTER_2_DATA.socialLinks.map((item) => item.platform),
        ['facebook', 'twitter', 'instagram', 'linkedin', 'github']
      );

      assert.strictEqual(
        DEFAULT_FOOTER_2_DATA.copyrightNotice,
        '© 2026 Company Name. All rights reserved.'
      );

      assert.strictEqual(DEFAULT_FOOTER_2_DATA.bottomLinks?.length, 4);
      assert.deepStrictEqual(
        DEFAULT_FOOTER_2_DATA.bottomLinks.map((link) => link.label),
        ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support']
      );

      assert.strictEqual(DEFAULT_FOOTER_2_DATA.showBackToTop, true);
    });
  });

  void describe('resolveFooter2Props', () => {
    void it('resolves DEFAULT_FOOTER_2_DATA with pure black dark theme and all fields', () => {
      const resolved = resolveFooter2Props(DEFAULT_FOOTER_2_DATA);

      assert.strictEqual(resolved.theme, 'dark');
      assert.match(resolved.themeClasses.wrapper, /bg-black/);
      assert.match(resolved.themeClasses.wrapper, /text-white/);
      assert.match(resolved.themeClasses.wrapper, /border-neutral-800/);
      assert.match(resolved.themeClasses.wrapper, /tracking-normal/);
      assert.match(resolved.themeClasses.heading, /text-white/);
      assert.match(resolved.themeClasses.heading, /tracking-normal/);

      for (const key of THEME_CLASS_KEYS) {
        for (const pattern of FORBIDDEN_THEME_PATTERNS) {
          assert.doesNotMatch(resolved.themeClasses[key], pattern);
        }
      }

      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.logoText, 'LOGO');
      assert.strictEqual(resolved.logoUrl, undefined);
      assert.strictEqual(resolved.brandSubtitle, undefined);
      assert.strictEqual(resolved.description, DEFAULT_FOOTER_2_DATA.description);

      assert.strictEqual(resolved.showNewsletter, true);
      assert.strictEqual(resolved.newsletterHeading, 'Subscribe to our newsletter');
      assert.strictEqual(
        resolved.newsletterDescription,
        'Stay up to date with the latest updates, insights, and announcements.'
      );
      assert.strictEqual(resolved.newsletterPlaceholder, 'Enter your email');
      assert.strictEqual(resolved.newsletterButtonText, 'Subscribe');

      assert.strictEqual(resolved.contactTitle, undefined);
      assert.deepStrictEqual(resolved.addressLines, []);
      assert.strictEqual(resolved.phone, undefined);
      assert.strictEqual(resolved.phoneHref, null);
      assert.strictEqual(resolved.email, undefined);
      assert.strictEqual(resolved.emailHref, null);

      assert.strictEqual(resolved.linkColumns.length, 3);
      const [col1, col2, col3] = resolved.linkColumns;
      assert.ok(col1);
      assert.strictEqual(col1.title, 'Product');
      assert.strictEqual(col1.links.length, 4);
      assert.ok(col2);
      assert.strictEqual(col2.title, 'Resources');
      assert.strictEqual(col2.links.length, 4);
      assert.ok(col3);
      assert.strictEqual(col3.title, 'Company');
      assert.strictEqual(col3.links.length, 4);

      assert.strictEqual(resolved.socialLinks.length, 5);
      assert.deepStrictEqual(
        resolved.socialLinks.map((item) => item.icon),
        [Facebook, Twitter, Instagram, Linkedin, Github]
      );

      assert.strictEqual(resolved.copyrightNotice, '© 2026 Company Name. All rights reserved.');
      assert.strictEqual(resolved.bottomLinks.length, 4);
      assert.deepStrictEqual(
        resolved.bottomLinks.map((link) => link.label),
        ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support']
      );
      assert.strictEqual(resolved.showBackToTop, true);
    });

    void it('resolves pure white light theme classes with zero shadows and tracking-normal', () => {
      const resolved = resolveFooter2Props({
        ...DEFAULT_FOOTER_2_DATA,
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

    void it('handles newsletter toggle, custom trimmed copy, and blank/whitespace fallbacks', () => {
      const defaultResolved = resolveFooter2Props({});
      assert.strictEqual(defaultResolved.showNewsletter, true);
      assert.strictEqual(defaultResolved.newsletterHeading, 'Subscribe to our newsletter');
      assert.strictEqual(
        defaultResolved.newsletterDescription,
        'Stay up to date with the latest updates, insights, and announcements.'
      );
      assert.strictEqual(defaultResolved.newsletterPlaceholder, 'Enter your email');
      assert.strictEqual(defaultResolved.newsletterButtonText, 'Subscribe');

      const disabled = resolveFooter2Props({ showNewsletter: false });
      assert.strictEqual(disabled.showNewsletter, false);

      const customized = resolveFooter2Props({
        showNewsletter: true,
        newsletterHeading: '  Weekly Dispatch  ',
        newsletterDescription: '  Fresh product notes delivered Fridays.  ',
        newsletterPlaceholder: '  you@example.com  ',
        newsletterButtonText: '  Join Now  ',
      });
      assert.strictEqual(customized.showNewsletter, true);
      assert.strictEqual(customized.newsletterHeading, 'Weekly Dispatch');
      assert.strictEqual(
        customized.newsletterDescription,
        'Fresh product notes delivered Fridays.'
      );
      assert.strictEqual(customized.newsletterPlaceholder, 'you@example.com');
      assert.strictEqual(customized.newsletterButtonText, 'Join Now');

      const blankNewsletterFields = resolveFooter2Props({
        newsletterHeading: '   ',
        newsletterDescription: '\t  ',
        newsletterPlaceholder: '   ',
        newsletterButtonText: '',
      });
      assert.strictEqual(blankNewsletterFields.newsletterHeading, undefined);
      assert.strictEqual('newsletterHeading' in blankNewsletterFields, false);
      assert.strictEqual(blankNewsletterFields.newsletterDescription, undefined);
      assert.strictEqual('newsletterDescription' in blankNewsletterFields, false);
      assert.strictEqual(blankNewsletterFields.newsletterPlaceholder, 'Enter your email');
      assert.strictEqual(blankNewsletterFields.newsletterButtonText, 'Subscribe');
    });

    void it('resolves showBackToTop default true, explicit false, and explicit true', () => {
      assert.strictEqual(resolveFooter2Props({}).showBackToTop, true);
      assert.strictEqual(resolveFooter2Props({ showBackToTop: false }).showBackToTop, false);
      assert.strictEqual(resolveFooter2Props({ showBackToTop: true }).showBackToTop, true);
    });

    void it('normalizes blank optional fields, multiline addresses, phone/email URIs, and preserves empty arrays', () => {
      const blankResolved = resolveFooter2Props({
        logoText: '   ',
        logoUrl: '',
        brandSubtitle: '   ',
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

      assert.strictEqual(blankResolved.theme, 'dark');
      assert.deepStrictEqual(blankResolved.layout, { padding: '64px' });
      assert.strictEqual(blankResolved.logoText, 'LOGO');
      assert.strictEqual(blankResolved.logoUrl, undefined);
      assert.strictEqual(blankResolved.brandSubtitle, undefined);
      assert.strictEqual(blankResolved.description, undefined);
      assert.strictEqual(blankResolved.contactTitle, undefined);
      assert.deepStrictEqual(blankResolved.addressLines, []);
      assert.strictEqual(blankResolved.phone, undefined);
      assert.strictEqual(blankResolved.phoneHref, null);
      assert.strictEqual(blankResolved.email, undefined);
      assert.strictEqual(blankResolved.emailHref, null);
      assert.strictEqual(blankResolved.copyrightNotice, undefined);
      assert.deepStrictEqual(blankResolved.socialLinks, []);
      assert.deepStrictEqual(blankResolved.linkColumns, []);
      assert.deepStrictEqual(blankResolved.bottomLinks, []);

      const trimmedAndContact = resolveFooter2Props({
        logoText: '  Acme Co  ',
        logoUrl: '  https://example.com/logo.svg  ',
        brandSubtitle: '  Design Systems  ',
        description: '  Simple modular components.  ',
        contactTitle: '  Get in Touch  ',
        address: '  100 Main Street \r\n\r\n  Suite 400 \n  Metro City  ',
        phone: ' +1 (555) 123-4567 ',
        email: '  hello@example.com  ',
        copyrightNotice: '  © 2026 Acme Co  ',
      });

      assert.strictEqual(trimmedAndContact.logoText, 'Acme Co');
      assert.strictEqual(trimmedAndContact.logoUrl, 'https://example.com/logo.svg');
      assert.strictEqual(trimmedAndContact.brandSubtitle, 'Design Systems');
      assert.strictEqual(trimmedAndContact.description, 'Simple modular components.');
      assert.strictEqual(trimmedAndContact.contactTitle, 'Get in Touch');
      assert.deepStrictEqual(trimmedAndContact.addressLines, [
        '100 Main Street',
        'Suite 400',
        'Metro City',
      ]);
      assert.strictEqual(trimmedAndContact.phone, '+1 (555) 123-4567');
      assert.strictEqual(trimmedAndContact.phoneHref, 'tel:+15551234567');
      assert.strictEqual(trimmedAndContact.email, 'hello@example.com');
      assert.strictEqual(trimmedAndContact.emailHref, 'mailto:hello@example.com');
      assert.strictEqual(trimmedAndContact.copyrightNotice, '© 2026 Acme Co');

      const invalidContact = resolveFooter2Props({
        phone: 'Front Desk',
        email: 'not-an-email',
      });
      assert.strictEqual(invalidContact.phone, 'Front Desk');
      assert.strictEqual(invalidContact.phoneHref, null);
      assert.strictEqual(invalidContact.email, 'not-an-email');
      assert.strictEqual(invalidContact.emailHref, null);
    });

    void it('filters blank links, columns, and social items while keeping untitled columns and external link attributes', () => {
      const resolved = resolveFooter2Props({
        logoText: 'BRAND',
        socialLinks: [
          { platform: 'pinterest', href: '   ', label: 'Pinterest' },
          { platform: 'pinterest', href: ' https://www.pinterest.com/example ' },
          {
            platform: 'mastodon' as unknown as SocialPlatform,
            href: 'https://mastodon.social/@example',
            label: '  ',
          },
        ],
        linkColumns: [
          { title: '   ', links: [{ label: '   ', href: '   ' }] },
          {
            title: '   ',
            links: [
              { label: '  ', href: '  ' },
              { label: '  Changelog  ', href: ' /changelog ' },
            ],
          },
          {
            title: '  Platform  ',
            links: [
              { label: '  Status  ', href: 'https://status.example.com' },
              { label: '  Roadmap  ', href: '/roadmap', isExternal: true },
            ],
          },
        ],
        bottomLinks: [
          { label: '  ', href: '  ' },
          { label: '  Home  ', href: ' / ' },
          { label: '  Docs Portal  ', href: 'https://docs.example.com' },
        ],
      });

      assert.strictEqual(resolved.socialLinks.length, 2);
      const [pinterestItem, mastodonItem] = resolved.socialLinks;
      assert.ok(pinterestItem);
      assert.strictEqual(pinterestItem.icon, Pinterest);
      assert.strictEqual(pinterestItem.href, 'https://www.pinterest.com/example');
      assert.strictEqual(pinterestItem.label, 'pinterest');
      assert.ok(mastodonItem);
      assert.strictEqual(mastodonItem.icon, Globe);
      assert.strictEqual(mastodonItem.label, 'mastodon');

      assert.strictEqual(resolved.linkColumns.length, 2);
      const [untitledCol, titledCol] = resolved.linkColumns;
      assert.ok(untitledCol);
      assert.strictEqual(untitledCol.title, '');
      assert.strictEqual(untitledCol.links.length, 1);
      const [changelogLink] = untitledCol.links;
      assert.ok(changelogLink);
      assert.strictEqual(changelogLink.label, 'Changelog');
      assert.strictEqual(changelogLink.href, '/changelog');
      assert.strictEqual(changelogLink.isExternal, false);
      assert.strictEqual('target' in changelogLink, false);
      assert.strictEqual('rel' in changelogLink, false);

      assert.ok(titledCol);
      assert.strictEqual(titledCol.title, 'Platform');
      assert.strictEqual(titledCol.links.length, 2);
      const [statusLink, roadmapLink] = titledCol.links;
      assert.ok(statusLink);
      assert.strictEqual(statusLink.isExternal, true);
      assert.strictEqual(statusLink.target, '_blank');
      assert.strictEqual(statusLink.rel, 'noopener noreferrer');
      assert.ok(roadmapLink);
      assert.strictEqual(roadmapLink.isExternal, true);
      assert.strictEqual(roadmapLink.target, '_blank');
      assert.strictEqual(roadmapLink.rel, 'noopener noreferrer');

      assert.strictEqual(resolved.bottomLinks.length, 2);
      const [homeLink, docsLink] = resolved.bottomLinks;
      assert.ok(homeLink);
      assert.strictEqual(homeLink.label, 'Home');
      assert.strictEqual(homeLink.href, '/');
      assert.strictEqual(homeLink.isExternal, false);
      assert.ok(docsLink);
      assert.strictEqual(docsLink.label, 'Docs Portal');
      assert.strictEqual(docsLink.isExternal, true);
      assert.strictEqual(docsLink.target, '_blank');
      assert.strictEqual(docsLink.rel, 'noopener noreferrer');
    });
  });
});
