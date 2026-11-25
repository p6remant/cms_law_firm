import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_FOOTER_MULTI_COLUMN_DATA,
  formatEmailHref,
  formatPhoneHref,
  getFirmMonogram,
  Globe,
  Linkedin,
  resolveFooterLink,
  resolveFooterMultiColumnProps,
} from './footer-utils.ts';
import type { SocialPlatform } from '../types.ts';

void describe('footer-multi-column helpers', () => {
  void describe('resolveFooterLink', () => {
    void it('resolves internal paths without target or rel attributes', () => {
      const resolved = resolveFooterLink({
        label: '  Corporate & M&A  ',
        href: ' /practices/corporate ',
      });

      assert.deepStrictEqual(resolved, {
        label: 'Corporate & M&A',
        href: '/practices/corporate',
        isExternal: false,
      });
      assert.strictEqual('target' in resolved, false);
      assert.strictEqual('rel' in resolved, false);
      assert.strictEqual('badge' in resolved, false);
    });

    void it('detects external URLs automatically even when isExternal is omitted', () => {
      const httpsLink = resolveFooterLink({
        label: 'Client Portal',
        href: 'https://portal.vanguardsterling.law',
      });

      assert.deepStrictEqual(httpsLink, {
        label: 'Client Portal',
        href: 'https://portal.vanguardsterling.law',
        isExternal: true,
        target: '_blank',
        rel: 'noopener noreferrer',
      });

      const protocolRelativeLink = resolveFooterLink({
        label: 'Media Kit',
        href: '//cdn.vanguardsterling.law/press',
      });
      assert.strictEqual(protocolRelativeLink.isExternal, true);
      assert.strictEqual(protocolRelativeLink.target, '_blank');
      assert.strictEqual(protocolRelativeLink.rel, 'noopener noreferrer');
    });

    void it('honors explicit isExternal true even on relative paths', () => {
      const resolved = resolveFooterLink({
        label: 'SEC Regulatory Briefings',
        href: '/briefings',
        isExternal: true,
      });

      assert.deepStrictEqual(resolved, {
        label: 'SEC Regulatory Briefings',
        href: '/briefings',
        isExternal: true,
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    });

    void it('preserves trimmed badges, omits empty badges, and defaults blank href to #', () => {
      const withBadge = resolveFooterLink({
        label: 'Technology & AI',
        href: '/industries/technology',
        badge: '  Active  ',
      });

      assert.strictEqual(withBadge.badge, 'Active');

      const blankHrefAndBadge = resolveFooterLink({
        label: 'Upcoming Practice',
        href: '   ',
        badge: '   ',
      });

      assert.deepStrictEqual(blankHrefAndBadge, {
        label: 'Upcoming Practice',
        href: '#',
        isExternal: false,
      });
      assert.strictEqual('badge' in blankHrefAndBadge, false);
    });
  });

  void describe('formatPhoneHref and formatEmailHref', () => {
    void it('formats international US and UK phone numbers into tel: URIs', () => {
      assert.strictEqual(formatPhoneHref('+1 (212) 555-0190'), 'tel:+12125550190');
      assert.strictEqual(formatPhoneHref('+44 20 7946 0910'), 'tel:+442079460910');
      assert.strictEqual(formatPhoneHref('  +1 415.555.0142  '), 'tel:+14155550142');
    });

    void it('handles local phone numbers without a leading plus and rejects invalid values', () => {
      assert.strictEqual(formatPhoneHref('(212) 555-0190'), 'tel:2125550190');
      assert.strictEqual(formatPhoneHref('212-555-0190'), 'tel:2125550190');
      assert.strictEqual(formatPhoneHref(''), null);
      assert.strictEqual(formatPhoneHref('   '), null);
      assert.strictEqual(formatPhoneHref(null), null);
      assert.strictEqual(formatPhoneHref(undefined), null);
      assert.strictEqual(formatPhoneHref('+'), null);
      assert.strictEqual(formatPhoneHref('Reception Desk'), null);
    });

    void it('formats valid trimmed email addresses into mailto: URIs and rejects invalid values', () => {
      assert.strictEqual(
        formatEmailHref('  newyork@vanguardsterling.law  '),
        'mailto:newyork@vanguardsterling.law'
      );
      assert.strictEqual(formatEmailHref(''), null);
      assert.strictEqual(formatEmailHref('   '), null);
      assert.strictEqual(formatEmailHref(null), null);
      assert.strictEqual(formatEmailHref(undefined), null);
      assert.strictEqual(formatEmailHref('not-an-email'), null);
    });
  });

  void describe('getFirmMonogram', () => {
    void it('extracts 2 uppercase initials while ignoring legal suffixes and connectors', () => {
      assert.strictEqual(getFirmMonogram('Vanguard & Sterling LLP'), 'VS');
      assert.strictEqual(getFirmMonogram('Cravath, Swaine & Moore LLP'), 'CS');
      assert.strictEqual(getFirmMonogram('The Law Offices of Vance & Associates PLLC'), 'LO');
      assert.strictEqual(getFirmMonogram('Sterling Legal PC'), 'SL');
    });

    void it('handles single-word firm names and falls back safely for empty input', () => {
      assert.strictEqual(getFirmMonogram('Vanguard'), 'VA');
      assert.strictEqual(getFirmMonogram('X'), 'X');
      assert.strictEqual(getFirmMonogram('LLP'), 'LL');
      assert.strictEqual(getFirmMonogram(''), 'LF');
      assert.strictEqual(getFirmMonogram('   '), 'LF');
      assert.strictEqual(getFirmMonogram(null), 'LF');
      assert.strictEqual(getFirmMonogram(undefined), 'LF');
    });
  });

  void describe('resolveFooterMultiColumnProps', () => {
    void it('resolves DEFAULT_FOOTER_MULTI_COLUMN_DATA completely', () => {
      const resolved = resolveFooterMultiColumnProps(DEFAULT_FOOTER_MULTI_COLUMN_DATA);

      assert.strictEqual(resolved.theme, 'dark');
      assert.match(resolved.themeClasses.wrapper, /bg-black/);
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.firmName, 'Vanguard & Sterling LLP');
      assert.strictEqual(resolved.monogram, 'VS');
      assert.strictEqual(resolved.tagline, DEFAULT_FOOTER_MULTI_COLUMN_DATA.tagline);
      assert.strictEqual(resolved.description, DEFAULT_FOOTER_MULTI_COLUMN_DATA.description);

      assert.strictEqual(resolved.offices.length, 3);
      const [nyOffice, londonOffice] = resolved.offices;
      assert.ok(nyOffice);
      assert.strictEqual(nyOffice.city, 'New York');
      assert.strictEqual(nyOffice.phoneHref, 'tel:+12125550190');
      assert.strictEqual(nyOffice.emailHref, 'mailto:newyork@vanguardsterling.law');
      assert.ok(londonOffice);
      assert.strictEqual(londonOffice.city, 'London');
      assert.strictEqual(londonOffice.phoneHref, 'tel:+442079460910');

      assert.strictEqual(resolved.columns.length, 4);
      const industriesColumn = resolved.columns[1];
      const resourcesColumn = resolved.columns[3];
      assert.ok(industriesColumn);
      const techLink = industriesColumn.links[0];
      assert.ok(techLink);
      assert.strictEqual(techLink.badge, 'Active');

      assert.ok(resourcesColumn);
      const secBriefingLink = resourcesColumn.links[1];
      assert.ok(secBriefingLink);
      assert.strictEqual(secBriefingLink.label, 'SEC Regulatory Briefings');
      assert.strictEqual(secBriefingLink.isExternal, true);
      assert.strictEqual(secBriefingLink.target, '_blank');
      assert.strictEqual(secBriefingLink.rel, 'noopener noreferrer');

      assert.strictEqual(resolved.socialLinks.length, 4);
      const firstSocial = resolved.socialLinks[0];
      assert.ok(firstSocial);
      assert.strictEqual(firstSocial.icon, Linkedin);
      assert.strictEqual(firstSocial.label, 'LinkedIn');

      assert.strictEqual(
        resolved.copyrightNotice,
        DEFAULT_FOOTER_MULTI_COLUMN_DATA.copyrightNotice
      );
      assert.strictEqual(
        resolved.legalDisclaimer,
        DEFAULT_FOOTER_MULTI_COLUMN_DATA.legalDisclaimer
      );
      assert.strictEqual(
        resolved.regulatoryNotice,
        DEFAULT_FOOTER_MULTI_COLUMN_DATA.regulatoryNotice
      );
    });

    void it('switches to pure white light theme when theme is light', () => {
      const resolved = resolveFooterMultiColumnProps({
        ...DEFAULT_FOOTER_MULTI_COLUMN_DATA,
        theme: 'light',
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.match(resolved.themeClasses.wrapper, /bg-white/);
      assert.match(resolved.themeClasses.heading, /text-black/);
    });

    void it('normalizes blank optional text fields to undefined and preserves explicit empty arrays', () => {
      const resolved = resolveFooterMultiColumnProps({
        firmName: '   ',
        tagline: '  ',
        logoUrl: '',
        description: '   ',
        copyrightNotice: ' ',
        legalDisclaimer: '',
        regulatoryNotice: '  ',
        offices: [],
        columns: [],
        socialLinks: [],
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.firmName, DEFAULT_FOOTER_MULTI_COLUMN_DATA.firmName);
      assert.strictEqual(resolved.monogram, 'VS');
      assert.strictEqual(resolved.tagline, undefined);
      assert.strictEqual(resolved.logoUrl, undefined);
      assert.strictEqual(resolved.description, undefined);
      assert.strictEqual(resolved.copyrightNotice, undefined);
      assert.strictEqual(resolved.legalDisclaimer, undefined);
      assert.strictEqual(resolved.regulatoryNotice, undefined);
      assert.deepStrictEqual(resolved.offices, []);
      assert.deepStrictEqual(resolved.columns, []);
      assert.deepStrictEqual(resolved.socialLinks, []);
    });

    void it('filters blank items gracefully and uses Globe fallback for unrecognized social platforms', () => {
      const resolved = resolveFooterMultiColumnProps({
        firmName: '  Sterling Partners  ',
        offices: [
          { city: '   ', address: ' ', phone: '', email: '  ' },
          { city: '  Boston  ', address: ' 1 Federal Street ', phone: 'n/a', email: 'invalid' },
        ],
        columns: [
          { title: '   ', links: [{ label: '  ', href: '  ' }] },
          {
            title: '  Governance  ',
            links: [
              { label: '  ', href: '  ' },
              { label: '  Board Advisory  ', href: ' /practices/governance ' },
            ],
          },
        ],
        socialLinks: [
          { platform: 'twitter', href: '   ', label: 'X' },
          { platform: 'linkedin', href: ' https://linkedin.com/company/sterling ' },
          {
            platform: 'threads' as unknown as SocialPlatform,
            href: 'https://threads.net/@sterling',
            label: '  ',
          },
        ],
      });

      assert.strictEqual(resolved.offices.length, 1);
      const [bostonOffice] = resolved.offices;
      assert.ok(bostonOffice);
      assert.strictEqual(bostonOffice.city, 'Boston');
      assert.strictEqual(bostonOffice.address, '1 Federal Street');
      assert.strictEqual(bostonOffice.phoneHref, null);
      assert.strictEqual(bostonOffice.emailHref, null);

      assert.strictEqual(resolved.columns.length, 1);
      const [govColumn] = resolved.columns;
      assert.ok(govColumn);
      assert.strictEqual(govColumn.title, 'Governance');
      assert.strictEqual(govColumn.links.length, 1);
      const [govLink] = govColumn.links;
      assert.ok(govLink);
      assert.strictEqual(govLink.label, 'Board Advisory');
      assert.strictEqual(govLink.href, '/practices/governance');

      assert.strictEqual(resolved.socialLinks.length, 2);
      const [linkedinSocial, threadsSocial] = resolved.socialLinks;
      assert.ok(linkedinSocial);
      assert.strictEqual(linkedinSocial.icon, Linkedin);
      assert.strictEqual(linkedinSocial.label, 'linkedin');
      assert.strictEqual(linkedinSocial.href, 'https://linkedin.com/company/sterling');
      assert.ok(threadsSocial);
      assert.strictEqual(threadsSocial.icon, Globe);
      assert.strictEqual(threadsSocial.label, 'threads');
    });
  });
});
