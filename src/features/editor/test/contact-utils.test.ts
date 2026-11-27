import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CONTACT1_DATA,
  DEFAULT_CONTACT2_DATA,
  formatContactEmailHref,
  formatContactPhoneHref,
  getContactThemeClasses,
  resolveContact1Props,
  resolveContact2Props,
  validateContactSubmission,
  type ContactSubmissionInput,
} from '../utils/contact-utils.ts';
import type { Contact1Props, Contact2Props } from '../types.ts';

const CONTACT_THEME_CLASS_KEYS = [
  'wrapper',
  'surface',
  'eyebrow',
  'badge',
  'heading',
  'text',
  'mutedText',
  'label',
  'border',
  'input',
  'submitButton',
  'iconContainer',
  'icon',
  'link',
  'statusSuccess',
  'statusError',
  'errorText',
] as const;

const TEXT_CONTAINING_KEYS = [
  'wrapper',
  'surface',
  'eyebrow',
  'badge',
  'heading',
  'text',
  'mutedText',
  'label',
  'input',
  'submitButton',
  'link',
  'statusSuccess',
  'statusError',
  'errorText',
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

void describe('contact-utils', () => {
  void describe('getContactThemeClasses', () => {
    void it('returns pure white and neutral grayscale classes across all 17 keys for light theme', () => {
      const light = getContactThemeClasses('light');

      assert.deepStrictEqual(Object.keys(light).sort(), [...CONTACT_THEME_CLASS_KEYS].sort());

      assert.match(light.wrapper, /\bbg-white\b/);
      assert.match(light.wrapper, /\btext-black\b/);
      assert.match(light.wrapper, /\bborder-neutral-200\b/);

      assert.match(light.surface, /\bbg-neutral-50\b/);
      assert.match(light.surface, /\bborder-neutral-200\b/);
      assert.match(light.surface, /\btext-black\b/);

      assert.match(light.eyebrow, /\btext-neutral-600\b/);
      assert.match(light.badge, /\bbg-neutral-100\b/);
      assert.match(light.badge, /\btext-neutral-800\b/);
      assert.match(light.badge, /\bborder-neutral-200\b/);

      assert.match(light.heading, /\btext-black\b/);
      assert.match(light.text, /\btext-black\b/);
      assert.match(light.mutedText, /\btext-neutral-600\b/);
      assert.match(light.label, /\btext-black\b/);
      assert.match(light.border, /\bborder-neutral-200\b/);

      assert.match(light.input, /\bbg-white\b/);
      assert.match(light.input, /\btext-black\b/);
      assert.match(light.input, /\bborder-neutral-300\b/);
      assert.match(light.input, /\bplaceholder:text-neutral-500\b/);
      assert.match(light.input, /focus:border-black/);
      assert.match(light.input, /focus:outline-none/);

      assert.match(light.submitButton, /\bbg-black\b/);
      assert.match(light.submitButton, /\btext-white\b/);
      assert.match(light.submitButton, /\bborder-black\b/);
      assert.match(light.submitButton, /hover:bg-neutral-800/);

      assert.match(light.iconContainer, /\bbg-neutral-100\b/);
      assert.match(light.iconContainer, /\bborder-neutral-200\b/);
      assert.match(light.iconContainer, /\btext-black\b/);
      assert.match(light.icon, /\btext-black\b/);

      assert.match(light.link, /\btext-black\b/);
      assert.match(light.link, /hover:underline/);

      assert.match(light.statusSuccess, /\bbg-neutral-50\b/);
      assert.match(light.statusSuccess, /\bborder-neutral-300\b/);
      assert.match(light.statusSuccess, /\btext-black\b/);

      assert.match(light.statusError, /\bbg-neutral-100\b/);
      assert.match(light.statusError, /\bborder-neutral-900\b/);
      assert.match(light.statusError, /\btext-black\b/);

      assert.match(light.errorText, /\btext-neutral-900\b/);

      for (const key of TEXT_CONTAINING_KEYS) {
        assert.match(light[key], /\btracking-normal\b/, `light.${key} must use tracking-normal`);
      }

      for (const key of CONTACT_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(light[key], `light.${key}`);
      }
    });

    void it('returns pure black and neutral grayscale classes across all 17 keys for dark theme', () => {
      const dark = getContactThemeClasses('dark');

      assert.deepStrictEqual(Object.keys(dark).sort(), [...CONTACT_THEME_CLASS_KEYS].sort());

      assert.match(dark.wrapper, /\bbg-black\b/);
      assert.match(dark.wrapper, /\btext-white\b/);
      assert.match(dark.wrapper, /\bborder-neutral-800\b/);

      assert.match(dark.surface, /\bbg-neutral-950\b/);
      assert.match(dark.surface, /\bborder-neutral-800\b/);
      assert.match(dark.surface, /\btext-white\b/);

      assert.match(dark.eyebrow, /\btext-neutral-400\b/);
      assert.match(dark.badge, /\bbg-neutral-900\b/);
      assert.match(dark.badge, /\btext-neutral-200\b/);
      assert.match(dark.badge, /\bborder-neutral-800\b/);

      assert.match(dark.heading, /\btext-white\b/);
      assert.match(dark.text, /\btext-white\b/);
      assert.match(dark.mutedText, /\btext-neutral-400\b/);
      assert.match(dark.label, /\btext-white\b/);
      assert.match(dark.border, /\bborder-neutral-800\b/);

      assert.match(dark.input, /\bbg-black\b/);
      assert.match(dark.input, /\btext-white\b/);
      assert.match(dark.input, /\bborder-neutral-700\b/);
      assert.match(dark.input, /\bplaceholder:text-neutral-500\b/);
      assert.match(dark.input, /focus:border-white/);
      assert.match(dark.input, /focus:outline-none/);

      assert.match(dark.submitButton, /\bbg-white\b/);
      assert.match(dark.submitButton, /\btext-black\b/);
      assert.match(dark.submitButton, /\bborder-white\b/);
      assert.match(dark.submitButton, /hover:bg-neutral-200/);

      assert.match(dark.iconContainer, /\bbg-neutral-900\b/);
      assert.match(dark.iconContainer, /\bborder-neutral-800\b/);
      assert.match(dark.iconContainer, /\btext-white\b/);
      assert.match(dark.icon, /\btext-white\b/);

      assert.match(dark.link, /\btext-white\b/);
      assert.match(dark.link, /hover:underline/);

      assert.match(dark.statusSuccess, /\bbg-neutral-950\b/);
      assert.match(dark.statusSuccess, /\bborder-neutral-700\b/);
      assert.match(dark.statusSuccess, /\btext-white\b/);

      assert.match(dark.statusError, /\bbg-neutral-900\b/);
      assert.match(dark.statusError, /\bborder-neutral-300\b/);
      assert.match(dark.statusError, /\btext-white\b/);

      assert.match(dark.errorText, /\btext-neutral-200\b/);

      for (const key of TEXT_CONTAINING_KEYS) {
        assert.match(dark[key], /\btracking-normal\b/, `dark.${key} must use tracking-normal`);
      }

      for (const key of CONTACT_THEME_CLASS_KEYS) {
        assertNoForbiddenClasses(dark[key], `dark.${key}`);
      }
    });

    void it('falls back safely to dark theme classes for unexpected runtime theme values', () => {
      const fallback = getContactThemeClasses('sepia' as unknown as 'light' | 'dark');
      assert.deepStrictEqual(fallback, getContactThemeClasses('dark'));
    });
  });

  void describe('DEFAULT_CONTACT1_DATA and DEFAULT_CONTACT2_DATA', () => {
    void it('provides clean, non-lorem defaults for DEFAULT_CONTACT1_DATA', () => {
      assert.strictEqual(DEFAULT_CONTACT1_DATA.theme, 'light');
      assert.deepStrictEqual(DEFAULT_CONTACT1_DATA.layout, { padding: '64px' });
      assert.ok((DEFAULT_CONTACT1_DATA.eyebrow ?? '').trim().length > 0);
      assert.ok(DEFAULT_CONTACT1_DATA.heading.trim().length > 0);
      assert.ok((DEFAULT_CONTACT1_DATA.description ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT1_DATA.nameLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT1_DATA.emailLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT1_DATA.messageLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT1_DATA.submitLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT1_DATA.successMessage ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT1_DATA.errorMessage ?? '').trim().length > 0);

      const allText = [
        DEFAULT_CONTACT1_DATA.eyebrow ?? '',
        DEFAULT_CONTACT1_DATA.heading,
        DEFAULT_CONTACT1_DATA.description ?? '',
        DEFAULT_CONTACT1_DATA.nameLabel ?? '',
        DEFAULT_CONTACT1_DATA.emailLabel ?? '',
        DEFAULT_CONTACT1_DATA.messageLabel ?? '',
        DEFAULT_CONTACT1_DATA.submitLabel ?? '',
        DEFAULT_CONTACT1_DATA.successMessage ?? '',
        DEFAULT_CONTACT1_DATA.errorMessage ?? '',
      ].join(' ');
      assert.doesNotMatch(allText, /lorem\s+ipsum/i);
    });

    void it('provides clean, non-lorem defaults for DEFAULT_CONTACT2_DATA with contact details', () => {
      assert.strictEqual(DEFAULT_CONTACT2_DATA.theme, 'dark');
      assert.deepStrictEqual(DEFAULT_CONTACT2_DATA.layout, { padding: '64px' });
      assert.ok((DEFAULT_CONTACT2_DATA.badge ?? '').trim().length > 0);
      assert.ok(DEFAULT_CONTACT2_DATA.heading.trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.description ?? '').trim().length > 0);
      assert.ok(formatContactEmailHref(DEFAULT_CONTACT2_DATA.email));
      assert.ok(formatContactPhoneHref(DEFAULT_CONTACT2_DATA.phone));
      assert.ok((DEFAULT_CONTACT2_DATA.address ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.hours ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.nameLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.emailLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.messageLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.submitLabel ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.successMessage ?? '').trim().length > 0);
      assert.ok((DEFAULT_CONTACT2_DATA.errorMessage ?? '').trim().length > 0);

      const allText = [
        DEFAULT_CONTACT2_DATA.badge ?? '',
        DEFAULT_CONTACT2_DATA.heading,
        DEFAULT_CONTACT2_DATA.description ?? '',
        DEFAULT_CONTACT2_DATA.email ?? '',
        DEFAULT_CONTACT2_DATA.phone ?? '',
        DEFAULT_CONTACT2_DATA.address ?? '',
        DEFAULT_CONTACT2_DATA.hours ?? '',
        DEFAULT_CONTACT2_DATA.successMessage ?? '',
        DEFAULT_CONTACT2_DATA.errorMessage ?? '',
      ].join(' ');
      assert.doesNotMatch(allText, /lorem\s+ipsum/i);
    });
  });

  void describe('formatContactEmailHref and formatContactPhoneHref', () => {
    void it('formats valid emails into mailto hrefs and rejects invalid/empty values', () => {
      assert.strictEqual(formatContactEmailHref('  team@example.com  '), 'mailto:team@example.com');
      assert.strictEqual(formatContactEmailHref(undefined), undefined);
      assert.strictEqual(formatContactEmailHref(null), undefined);
      assert.strictEqual(formatContactEmailHref('   '), undefined);
      assert.strictEqual(formatContactEmailHref('invalid-email'), undefined);
      assert.strictEqual(formatContactEmailHref('a@b'), undefined);
    });

    void it('extracts digits preserving optional leading plus for tel hrefs', () => {
      assert.strictEqual(formatContactPhoneHref('  +1 (555) 234-5678  '), 'tel:+15552345678');
      assert.strictEqual(formatContactPhoneHref('555-234-5678'), 'tel:5552345678');
      assert.strictEqual(formatContactPhoneHref(undefined), undefined);
      assert.strictEqual(formatContactPhoneHref(null), undefined);
      assert.strictEqual(formatContactPhoneHref('   '), undefined);
      assert.strictEqual(formatContactPhoneHref('+'), undefined);
      assert.strictEqual(formatContactPhoneHref('N/A'), undefined);
    });
  });

  void describe('resolveContact1Props', () => {
    void it('resolves empty props to defaults with light themeClasses', () => {
      const resolved = resolveContact1Props({});

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getContactThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.eyebrow, DEFAULT_CONTACT1_DATA.eyebrow);
      assert.strictEqual(resolved.heading, DEFAULT_CONTACT1_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_CONTACT1_DATA.description);
      assert.strictEqual(resolved.nameLabel, DEFAULT_CONTACT1_DATA.nameLabel);
      assert.strictEqual(resolved.emailLabel, DEFAULT_CONTACT1_DATA.emailLabel);
      assert.strictEqual(resolved.messageLabel, DEFAULT_CONTACT1_DATA.messageLabel);
      assert.strictEqual(resolved.submitLabel, DEFAULT_CONTACT1_DATA.submitLabel);
      assert.strictEqual(resolved.successMessage, DEFAULT_CONTACT1_DATA.successMessage);
      assert.strictEqual(resolved.errorMessage, DEFAULT_CONTACT1_DATA.errorMessage);
    });

    void it('trims explicit overrides and preserves 0px padding', () => {
      const input: Partial<Contact1Props> = {
        theme: 'dark',
        layout: { padding: '0px' },
        eyebrow: '  Support  ',
        heading: '  Send a Note  ',
        description: '  We respond within one business day.  ',
        nameLabel: '  Full Name  ',
        emailLabel: '  Work Email  ',
        messageLabel: '  Inquiry  ',
        submitLabel: '  Submit  ',
        successMessage: '  Received!  ',
        errorMessage: '  Fix errors below.  ',
      };

      const resolved = resolveContact1Props(input);

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getContactThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.eyebrow, 'Support');
      assert.strictEqual(resolved.heading, 'Send a Note');
      assert.strictEqual(resolved.description, 'We respond within one business day.');
      assert.strictEqual(resolved.nameLabel, 'Full Name');
      assert.strictEqual(resolved.emailLabel, 'Work Email');
      assert.strictEqual(resolved.messageLabel, 'Inquiry');
      assert.strictEqual(resolved.submitLabel, 'Submit');
      assert.strictEqual(resolved.successMessage, 'Received!');
      assert.strictEqual(resolved.errorMessage, 'Fix errors below.');
    });

    void it('falls back invalid runtime theme, omits blank optional fields, and restores blank required copy', () => {
      const resolved = resolveContact1Props({
        theme: 'sepia' as unknown as 'light' | 'dark',
        eyebrow: '   ',
        heading: '   ',
        description: '',
        nameLabel: ' ',
        emailLabel: '',
        messageLabel: '   ',
        submitLabel: '',
        successMessage: '   ',
        errorMessage: '',
      });

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getContactThemeClasses('light'));
      assert.strictEqual('eyebrow' in resolved, false);
      assert.strictEqual('description' in resolved, false);
      assert.strictEqual(resolved.heading, DEFAULT_CONTACT1_DATA.heading);
      assert.strictEqual(resolved.nameLabel, DEFAULT_CONTACT1_DATA.nameLabel);
      assert.strictEqual(resolved.emailLabel, DEFAULT_CONTACT1_DATA.emailLabel);
      assert.strictEqual(resolved.messageLabel, DEFAULT_CONTACT1_DATA.messageLabel);
      assert.strictEqual(resolved.submitLabel, DEFAULT_CONTACT1_DATA.submitLabel);
      assert.strictEqual(resolved.successMessage, DEFAULT_CONTACT1_DATA.successMessage);
      assert.strictEqual(resolved.errorMessage, DEFAULT_CONTACT1_DATA.errorMessage);
    });
  });

  void describe('resolveContact2Props', () => {
    void it('resolves empty props to defaults with dark themeClasses and valid contact hrefs', () => {
      const resolved = resolveContact2Props({});

      assert.strictEqual(resolved.theme, 'dark');
      assert.deepStrictEqual(resolved.themeClasses, getContactThemeClasses('dark'));
      assert.deepStrictEqual(resolved.layout, { padding: '64px' });
      assert.strictEqual(resolved.badge, DEFAULT_CONTACT2_DATA.badge);
      assert.strictEqual(resolved.heading, DEFAULT_CONTACT2_DATA.heading);
      assert.strictEqual(resolved.description, DEFAULT_CONTACT2_DATA.description);
      assert.strictEqual(resolved.email, DEFAULT_CONTACT2_DATA.email);
      assert.strictEqual(resolved.emailHref, `mailto:${DEFAULT_CONTACT2_DATA.email ?? ''}`);
      assert.strictEqual(resolved.phone, DEFAULT_CONTACT2_DATA.phone);
      assert.strictEqual(resolved.phoneHref, 'tel:+15552345678');
      assert.strictEqual(resolved.address, DEFAULT_CONTACT2_DATA.address);
      assert.strictEqual(resolved.hours, DEFAULT_CONTACT2_DATA.hours);
      assert.strictEqual(resolved.nameLabel, DEFAULT_CONTACT2_DATA.nameLabel);
      assert.strictEqual(resolved.emailLabel, DEFAULT_CONTACT2_DATA.emailLabel);
      assert.strictEqual(resolved.messageLabel, DEFAULT_CONTACT2_DATA.messageLabel);
      assert.strictEqual(resolved.submitLabel, DEFAULT_CONTACT2_DATA.submitLabel);
      assert.strictEqual(resolved.successMessage, DEFAULT_CONTACT2_DATA.successMessage);
      assert.strictEqual(resolved.errorMessage, DEFAULT_CONTACT2_DATA.errorMessage);
    });

    void it('trims explicit overrides, preserves 0px padding, and builds mailto/tel hrefs', () => {
      const input: Partial<Contact2Props> = {
        theme: 'light',
        layout: { padding: '0px' },
        badge: '  Direct Desk  ',
        heading: '  Talk with us  ',
        description: '  Available by email, phone, or in person.  ',
        email: '  desk@example.org  ',
        phone: '  +44 20 7946 0958  ',
        address: '  42 Fleet Street, London  ',
        hours: '  Mon–Fri 8:30–17:30  ',
        nameLabel: '  Your Name  ',
        emailLabel: '  Email Address  ',
        messageLabel: '  Details  ',
        submitLabel: '  Send Inquiry  ',
        successMessage: '  Message sent.  ',
        errorMessage: '  Check form inputs.  ',
      };

      const resolved = resolveContact2Props(input);

      assert.strictEqual(resolved.theme, 'light');
      assert.deepStrictEqual(resolved.themeClasses, getContactThemeClasses('light'));
      assert.deepStrictEqual(resolved.layout, { padding: '0px' });
      assert.strictEqual(resolved.badge, 'Direct Desk');
      assert.strictEqual(resolved.heading, 'Talk with us');
      assert.strictEqual(resolved.description, 'Available by email, phone, or in person.');
      assert.strictEqual(resolved.email, 'desk@example.org');
      assert.strictEqual(resolved.emailHref, 'mailto:desk@example.org');
      assert.strictEqual(resolved.phone, '+44 20 7946 0958');
      assert.strictEqual(resolved.phoneHref, 'tel:+442079460958');
      assert.strictEqual(resolved.address, '42 Fleet Street, London');
      assert.strictEqual(resolved.hours, 'Mon–Fri 8:30–17:30');
      assert.strictEqual(resolved.nameLabel, 'Your Name');
      assert.strictEqual(resolved.emailLabel, 'Email Address');
      assert.strictEqual(resolved.messageLabel, 'Details');
      assert.strictEqual(resolved.submitLabel, 'Send Inquiry');
      assert.strictEqual(resolved.successMessage, 'Message sent.');
      assert.strictEqual(resolved.errorMessage, 'Check form inputs.');
    });

    void it('omits blank optional fields, omits invalid hrefs, and restores blank required copy', () => {
      const resolved = resolveContact2Props({
        theme: 'slate' as unknown as 'light' | 'dark',
        badge: '   ',
        heading: '   ',
        description: '',
        email: '   ',
        phone: '',
        address: '   ',
        hours: '',
        nameLabel: '  ',
        emailLabel: '',
        messageLabel: '   ',
        submitLabel: '',
        successMessage: '   ',
        errorMessage: '',
      });

      assert.strictEqual(resolved.theme, 'dark');
      assert.strictEqual('badge' in resolved, false);
      assert.strictEqual('description' in resolved, false);
      assert.strictEqual('email' in resolved, false);
      assert.strictEqual('emailHref' in resolved, false);
      assert.strictEqual('phone' in resolved, false);
      assert.strictEqual('phoneHref' in resolved, false);
      assert.strictEqual('address' in resolved, false);
      assert.strictEqual('hours' in resolved, false);
      assert.strictEqual(resolved.heading, DEFAULT_CONTACT2_DATA.heading);
      assert.strictEqual(resolved.nameLabel, DEFAULT_CONTACT2_DATA.nameLabel);
      assert.strictEqual(resolved.emailLabel, DEFAULT_CONTACT2_DATA.emailLabel);
      assert.strictEqual(resolved.messageLabel, DEFAULT_CONTACT2_DATA.messageLabel);
      assert.strictEqual(resolved.submitLabel, DEFAULT_CONTACT2_DATA.submitLabel);
      assert.strictEqual(resolved.successMessage, DEFAULT_CONTACT2_DATA.successMessage);
      assert.strictEqual(resolved.errorMessage, DEFAULT_CONTACT2_DATA.errorMessage);
    });

    void it('omits emailHref and phoneHref when non-empty email or phone cannot form valid links', () => {
      const resolved = resolveContact2Props({
        email: '  not-an-email  ',
        phone: '  Ext. only  ',
      });

      assert.strictEqual(resolved.email, 'not-an-email');
      assert.strictEqual('emailHref' in resolved, false);
      assert.strictEqual(resolved.phone, 'Ext. only');
      assert.strictEqual('phoneHref' in resolved, false);
    });
  });

  void describe('validateContactSubmission', () => {
    void it('accepts and trims valid name, email, and message', () => {
      const result = validateContactSubmission({
        name: '  Alex Rivera  ',
        email: '  alex.rivera@example.com  ',
        message: '  I would like to schedule an introductory call next week.  ',
      });

      assert.deepStrictEqual(result, {
        valid: true,
        errors: {},
        sanitized: {
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          message: 'I would like to schedule an introductory call next week.',
        },
      });
    });

    void it('returns field-specific errors for missing or whitespace-only inputs', () => {
      const result = validateContactSubmission({
        name: '   ',
        email: '',
        message: '   ',
      });

      assert.strictEqual(result.valid, false);
      assert.ok(typeof result.errors.name === 'string' && result.errors.name.length > 0);
      assert.ok(typeof result.errors.email === 'string' && result.errors.email.length > 0);
      assert.ok(typeof result.errors.message === 'string' && result.errors.message.length > 0);
      assert.deepStrictEqual(result.sanitized, {
        name: '',
        email: '',
        message: '',
      });
    });

    void it('rejects invalid email formats with errors.email while keeping valid name and message', () => {
      const invalidEmails = ['plainaddress', 'missing@', '@domain.com', 'a@b'];

      for (const badEmail of invalidEmails) {
        const result = validateContactSubmission({
          name: 'Taylor Brooks',
          email: badEmail,
          message: 'Looking for support details.',
        });

        assert.strictEqual(result.valid, false, `Expected invalid for ${badEmail}`);
        assert.strictEqual(result.errors.name, undefined);
        assert.ok(
          typeof result.errors.email === 'string' && result.errors.email.length > 0,
          `Expected errors.email for ${badEmail}`
        );
        assert.strictEqual(result.errors.message, undefined);
        assert.strictEqual(result.sanitized.email, badEmail);
      }
    });

    void it('handles nullish, missing, or non-string runtime fields without throwing', () => {
      const inputs: unknown[] = [
        undefined,
        null,
        {},
        { name: null, email: undefined, message: 123 },
        { name: 42, email: true, message: { text: 'nested' } },
      ];

      for (const input of inputs) {
        const result = validateContactSubmission(input as ContactSubmissionInput);
        assert.strictEqual(result.valid, false);
        assert.ok(result.errors.name);
        assert.ok(result.errors.email);
        assert.ok(result.errors.message);
        assert.deepStrictEqual(result.sanitized, {
          name: '',
          email: '',
          message: '',
        });
      }
    });
  });
});
