// Mercy Bridge - Biller Portal Links
// Direct payment URLs for common billers

export interface BillerPortal {
  name: string;
  domain: string;
  paymentUrl: string;
  instructions: string;
  fields?: {
    accountNumberLabel: string;
    accountNumberRequired: boolean;
  };
}

export const knownBillerPortals: Record<string, BillerPortal> = {
  // === UTILITIES - ELECTRIC ===
  'consumers-energy': {
    name: 'Consumers Energy',
    domain: 'consumersenergy.com',
    paymentUrl: 'https://www.consumersenergy.com/pay-my-bill',
    instructions: 'Use the account number provided. You can pay as a guest without logging in.',
    fields: {
      accountNumberLabel: 'Account Number',
      accountNumberRequired: true,
    },
  },
  'dte-energy': {
    name: 'DTE Energy',
    domain: 'dteenergy.com',
    paymentUrl: 'https://www.dteenergy.com/pay',
    instructions: 'Pay as guest using account number. No login required.',
    fields: {
      accountNumberLabel: 'Account Number',
      accountNumberRequired: true,
    },
  },
  'spectrum': {
    name: 'Spectrum',
    domain: 'spectrum.net',
    paymentUrl: 'https://www.spectrum.net/billing',
    instructions: 'Pay as guest using phone number or account number.',
    fields: {
      accountNumberLabel: 'Account or Phone Number',
      accountNumberRequired: true,
    },
  },
  'comcast': {
    name: 'Comcast/Xfinity',
    domain: 'xfinity.com',
    paymentUrl: 'https://customer.xfinity.com/payments',
    instructions: 'Use account number to pay as guest.',
    fields: {
      accountNumberLabel: 'Account Number',
      accountNumberRequired: true,
    },
  },
  'at&t': {
    name: 'AT&T',
    domain: 'att.com',
    paymentUrl: 'https://www.att.com/pay',
    instructions: 'Pay as guest using phone number or account number.',
    fields: {
      accountNumberLabel: 'Phone or Account Number',
      accountNumberRequired: true,
    },
  },
  'verizon': {
    name: 'Verizon',
    domain: 'verizon.com',
    paymentUrl: 'https://www.verizon.com/pay',
    instructions: 'Use account number to pay as guest.',
    fields: {
      accountNumberLabel: 'Account Number',
      accountNumberRequired: true,
    },
  },
  'city-of-detroit-water': {
    name: 'City of Detroit Water',
    domain: 'detroitmi.gov',
    paymentUrl: 'https://www.detroitmi.gov/water-payment',
    instructions: 'Use account number found on bill.',
    fields: {
      accountNumberLabel: 'Water Account Number',
      accountNumberRequired: true,
    },
  },
  'default': {
    name: 'Biller Payment Portal',
    domain: '',
    paymentUrl: '',
    instructions: 'Contact the requester for direct payment instructions.',
  },
};

export function getBillerPortal(billerName: string): BillerPortal {
  const normalized = billerName.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return knownBillerPortals[normalized] || {
    ...knownBillerPortals.default,
    name: billerName,
  };
}

export function generatePaymentInstructions(need: {
  biller_name: string;
  account_number?: string;
  amount_remaining: number;
}): string {
  const portal = getBillerPortal(need.biller_name);
  
  let instructions = `## How to Pay ${portal.name}\n\n`;
  instructions += portal.instructions + '\n\n';
  
  if (portal.paymentUrl) {
    instructions += `**Payment URL:** ${portal.paymentUrl}\n\n`;
  }
  
  if (need.account_number && portal.fields?.accountNumberRequired) {
    instructions += `**${portal.fields.accountNumberLabel}:** ${need.account_number}\n\n`;
  }
  
  instructions += `**Amount to Pay:** $${need.amount_remaining.toFixed(2)}\n\n`;
  instructions += `---\n\n**Important:** After paying, please upload a screenshot or confirmation number as proof of payment. This helps us verify the need is fully met.\n\n`;
  instructions += `TrueNorth does not handle money. You are paying the biller directly.`;
  
  return instructions;
}
