import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSelectOptions,
  resolveFieldWidthClass,
  simulateFormSubmit,
  validateEmail,
  validateFormField,
  validatePhone,
} from '../utils/form-utils.ts';

void describe('form-utils', () => {
  void describe('parseSelectOptions', () => {
    void it('handles empty, undefined, and null inputs', () => {
      assert.deepStrictEqual(parseSelectOptions(), []);
      assert.deepStrictEqual(parseSelectOptions(null), []);
      assert.deepStrictEqual(parseSelectOptions(''), []);
      assert.deepStrictEqual(parseSelectOptions('   '), []);
    });

    void it('parses newline-separated strings into label-value pairs', () => {
      const input = `Corporate Law
Litigation
Tax Advisory`;
      assert.deepStrictEqual(parseSelectOptions(input), [
        { label: 'Corporate Law', value: 'Corporate Law' },
        { label: 'Litigation', value: 'Litigation' },
        { label: 'Tax Advisory', value: 'Tax Advisory' },
      ]);
    });

    void it('parses "Label | value" pipe syntax correctly', () => {
      const input = `Corporate Law | corporate
Litigation | lit
Tax & Wealth | tax_wealth`;
      assert.deepStrictEqual(parseSelectOptions(input), [
        { label: 'Corporate Law', value: 'corporate' },
        { label: 'Litigation', value: 'lit' },
        { label: 'Tax & Wealth', value: 'tax_wealth' },
      ]);
    });

    void it('ignores empty or blank lines and trims extraneous whitespace', () => {
      const input = `
        Option 1 | val1  

        Option 2
      `;
      assert.deepStrictEqual(parseSelectOptions(input), [
        { label: 'Option 1', value: 'val1' },
        { label: 'Option 2', value: 'Option 2' },
      ]);
    });

    void it('parses comma-separated single-line string fallback', () => {
      const input = 'Option A, Option B | b_val, Option C';
      assert.deepStrictEqual(parseSelectOptions(input), [
        { label: 'Option A', value: 'Option A' },
        { label: 'Option B', value: 'b_val' },
        { label: 'Option C', value: 'Option C' },
      ]);
    });

    void it('passes through array of SelectOption objects directly', () => {
      const options = [
        { label: 'One', value: '1' },
        { label: 'Two', value: '2' },
      ];
      assert.deepStrictEqual(parseSelectOptions(options), options);
    });
  });

  void describe('resolveFieldWidthClass', () => {
    void it('maps "half" to col-span-1', () => {
      assert.strictEqual(resolveFieldWidthClass('half'), 'col-span-1');
    });

    void it('maps "full" to col-span-1 md:col-span-2', () => {
      assert.strictEqual(resolveFieldWidthClass('full'), 'col-span-1 md:col-span-2');
    });

    void it('maps "auto" to w-auto', () => {
      assert.strictEqual(resolveFieldWidthClass('auto'), 'w-auto');
    });

    void it('defaults undefined or unknown values to col-span-1 md:col-span-2', () => {
      assert.strictEqual(resolveFieldWidthClass(), 'col-span-1 md:col-span-2');
      assert.strictEqual(resolveFieldWidthClass('custom'), 'col-span-1 md:col-span-2');
    });
  });

  void describe('validateEmail', () => {
    void it('accepts standard valid email addresses', () => {
      assert.strictEqual(validateEmail('attorney@firm.com'), true);
      assert.strictEqual(validateEmail('john.doe@sub.example.co.uk'), true);
      assert.strictEqual(validateEmail('client+test@domain.org'), true);
    });

    void it('rejects malformed emails missing @ or domain parts', () => {
      assert.strictEqual(validateEmail('plainaddress'), false);
      assert.strictEqual(validateEmail('missingdomain@'), false);
      assert.strictEqual(validateEmail('@missinguser.com'), false);
      assert.strictEqual(validateEmail('spaces in@email.com'), false);
      assert.strictEqual(validateEmail('missingtld@domain'), false);
    });
  });

  void describe('validatePhone', () => {
    void it('accepts valid US and international format phone numbers', () => {
      assert.strictEqual(validatePhone('+1 (555) 123-4567'), true);
      assert.strictEqual(validatePhone('555-123-4567'), true);
      assert.strictEqual(validatePhone('1234567'), true);
      assert.strictEqual(validatePhone('+44 20 7946 0958'), true);
    });

    void it('rejects invalid characters, alpha text, or fewer than 7 digits', () => {
      assert.strictEqual(validatePhone('12345'), false);
      assert.strictEqual(validatePhone('phone-number'), false);
      assert.strictEqual(validatePhone('555-CALL-NOW'), false);
      assert.strictEqual(validatePhone(''), false);
    });
  });

  void describe('validateFormField', () => {
    void it('validates required fields properly', () => {
      assert.deepStrictEqual(validateFormField('text', '', true), {
        valid: false,
        error: 'This field is required.',
      });
      assert.deepStrictEqual(validateFormField('text', '   ', true), {
        valid: false,
        error: 'This field is required.',
      });
      assert.deepStrictEqual(validateFormField('text', null, true), {
        valid: false,
        error: 'This field is required.',
      });
      assert.deepStrictEqual(validateFormField('text', 'John Doe', true), {
        valid: true,
      });
    });

    void it('allows empty value when field is not required', () => {
      assert.deepStrictEqual(validateFormField('text', '', false), {
        valid: true,
      });
      assert.deepStrictEqual(validateFormField('email', '', false), {
        valid: true,
      });
      assert.deepStrictEqual(validateFormField('tel', '', false), {
        valid: true,
      });
    });

    void it('validates email format when value is provided', () => {
      assert.deepStrictEqual(validateFormField('email', 'invalid-email', false), {
        valid: false,
        error: 'Please enter a valid email address.',
      });
      assert.deepStrictEqual(validateFormField('email', 'legal@firm.com', true), {
        valid: true,
      });
    });

    void it('validates telephone format when value is provided', () => {
      assert.deepStrictEqual(validateFormField('tel', '123', false), {
        valid: false,
        error: 'Please enter a valid phone number.',
      });
      assert.deepStrictEqual(validateFormField('tel', '+1 (800) 555-0199', true), {
        valid: true,
      });
    });
  });

  void describe('simulateFormSubmit', () => {
    void it('resolves with success true and feedback message', async () => {
      const response = await simulateFormSubmit('/api/inquiry', { name: 'Alice' }, 10);
      assert.strictEqual(response.success, true);
      assert.ok(typeof response.message === 'string' && response.message.length > 0);
    });
  });
});
