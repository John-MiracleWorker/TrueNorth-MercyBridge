import { describe, it, expect } from 'vitest';
import { generatePaymentInstructions, getBillerPortal } from './billerPortals';

describe('billerPortals', () => {
  describe('getBillerPortal', () => {
    it('returns known portal for exact match', () => {
      const portal = getBillerPortal('consumers-energy');
      expect(portal.name).toBe('Consumers Energy');
      expect(portal.domain).toBe('consumersenergy.com');
      expect(portal.paymentUrl).toBe('https://www.consumersenergy.com/pay-my-bill');
      expect(portal.instructions).toBe('Use the account number provided. You can pay as a guest without logging in.');
      expect(portal.fields?.accountNumberLabel).toBe('Account Number');
      expect(portal.fields?.accountNumberRequired).toBe(true);
    });

    it('returns known portal ignoring case and punctuation', () => {
      const portal = getBillerPortal('Consumers Energy!');
      expect(portal.name).toBe('Consumers Energy');
    });

    it('returns default portal for unknown biller', () => {
      const portal = getBillerPortal('Unknown Biller 123');
      expect(portal.name).toBe('Unknown Biller 123');
      expect(portal.instructions).toBe('Contact the requester for direct payment instructions.');
      expect(portal.paymentUrl).toBe('');
      expect(portal.domain).toBe('');
      expect(portal.fields).toBeUndefined();
    });
  });

  describe('generatePaymentInstructions', () => {
    it('generates instructions for known biller with account number', () => {
      const instructions = generatePaymentInstructions({
        biller_name: 'consumers-energy',
        account_number: '123456789',
        amount_remaining: 100.50
      });

      expect(instructions).toContain('## How to Pay Consumers Energy');
      expect(instructions).toContain('Use the account number provided. You can pay as a guest without logging in.');
      expect(instructions).toContain('**Payment URL:** https://www.consumersenergy.com/pay-my-bill');
      expect(instructions).toContain('**Account Number:** 123456789');
      expect(instructions).toContain('**Amount to Pay:** $100.50');
      expect(instructions).toContain('TrueNorth does not handle money');
    });

    it('generates instructions for known biller without account number', () => {
      const instructions = generatePaymentInstructions({
        biller_name: 'consumers-energy',
        amount_remaining: 50.00
      });

      expect(instructions).toContain('## How to Pay Consumers Energy');
      expect(instructions).toContain('Use the account number provided. You can pay as a guest without logging in.');
      expect(instructions).toContain('**Payment URL:** https://www.consumersenergy.com/pay-my-bill');
      expect(instructions).toContain('**Amount to Pay:** $50.00');
      // Should not include account number if not provided
      expect(instructions).not.toContain('**Account Number:**');
    });

    it('generates instructions for unknown biller', () => {
      const instructions = generatePaymentInstructions({
        biller_name: 'Local Plumber',
        amount_remaining: 250.00
      });

      expect(instructions).toContain('## How to Pay Local Plumber');
      expect(instructions).toContain('Contact the requester for direct payment instructions.');
      expect(instructions).not.toContain('**Payment URL:**');
      expect(instructions).toContain('**Amount to Pay:** $250.00');
    });

    it('formats amount correctly with two decimal places', () => {
      const instructions = generatePaymentInstructions({
        biller_name: 'dte-energy',
        amount_remaining: 100
      });

      expect(instructions).toContain('**Amount to Pay:** $100.00');
    });

    it('handles billers without fields or accountNumberRequired=false gracefully', () => {
      const instructions = generatePaymentInstructions({
        biller_name: 'default', // default portal doesn't have fields
        account_number: '987654321', // provided but should not be shown if fields are absent/false
        amount_remaining: 75.25
      });

      expect(instructions).toContain('## How to Pay Biller Payment Portal');
      expect(instructions).toContain('**Amount to Pay:** $75.25');
      // Because `fields` is undefined on the default portal, `accountNumberRequired` is falsy,
      // so it shouldn't show the account number even if it's provided.
      expect(instructions).not.toContain('987654321');
    });
  });
});
