import { PaymentMethodType } from '@/types/enums/UserEnums';

export const getPaymentMethodName = (type: PaymentMethodType): string => {
  const typeMap: Record<PaymentMethodType, string> = {
    [PaymentMethodType.CARD]: 'Credit/Debit Card',
    [PaymentMethodType.BANK_ACCOUNT]: 'Bank Account',
    [PaymentMethodType.WALLET]: 'Digital Wallet',
    [PaymentMethodType.CRYPTO_WALLET]: 'Cryptocurrency Wallet',
  };

  return typeMap[type] || type;
};

export const conversionRates: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 154.5,
    CAD: 1.36,
    AUD: 1.52,
    CNY: 7.24,
    INR: 83.28,
    CHF: 0.91,
    USD: 1,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    JPY: 168.4,
    CAD: 1.48,
    AUD: 1.65,
    CNY: 7.88,
    INR: 90.78,
    CHF: 0.98,
    EUR: 1,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.17,
    JPY: 196.8,
    CAD: 1.73,
    AUD: 1.93,
    CNY: 9.19,
    INR: 105.89,
    CHF: 1.15,
    GBP: 1,
  },
  JPY: {
    USD: 0.0065,
    EUR: 0.0059,
    GBP: 0.0051,
    CAD: 0.0088,
    AUD: 0.0098,
    CNY: 0.047,
    INR: 0.54,
    CHF: 0.0058,
    JPY: 1,
  },
  CAD: {
    USD: 0.74,
    EUR: 0.68,
    GBP: 0.58,
    JPY: 113.5,
    AUD: 1.12,
    CNY: 5.33,
    INR: 61.25,
    CHF: 0.67,
    CAD: 1,
  },
  AUD: {
    USD: 0.66,
    EUR: 0.61,
    GBP: 0.52,
    JPY: 101.6,
    CAD: 0.89,
    CNY: 4.76,
    INR: 54.72,
    CHF: 0.6,
    AUD: 1,
  },
  CNY: {
    USD: 0.14,
    EUR: 0.13,
    GBP: 0.11,
    JPY: 21.35,
    CAD: 0.19,
    AUD: 0.21,
    INR: 11.5,
    CHF: 0.13,
    CNY: 1,
  },
  INR: {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
    JPY: 1.86,
    CAD: 0.016,
    AUD: 0.018,
    CNY: 0.087,
    CHF: 0.011,
    INR: 1,
  },
  CHF: {
    USD: 1.1,
    EUR: 1.02,
    GBP: 0.87,
    JPY: 170.19,
    CAD: 1.5,
    AUD: 1.67,
    CNY: 7.95,
    INR: 91.58,
    CHF: 1,
  },
};
// This function converts an amount from one currency to another using predefined conversion rates.
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // If we have a direct conversion rate
  if (conversionRates[fromCurrency]?.[toCurrency]) {
    return parseFloat(
      (amount * conversionRates[fromCurrency][toCurrency]).toFixed(2)
    );
  }

  // If we don't have a direct conversion rate, try to convert via USD
  if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
    if (
      conversionRates[fromCurrency]?.['USD'] &&
      conversionRates['USD']?.[toCurrency]
    ) {
      const toUsd = amount * conversionRates[fromCurrency]['USD'];

      return parseFloat(
        (toUsd * conversionRates['USD'][toCurrency]).toFixed(2)
      );
    }
  }

  // If conversion is not possible, return the original amount
  console.warn(`Cannot convert from ${fromCurrency} to ${toCurrency}`);

  return amount;
};

export const currencies = [
  'USD', // United States Dollar
  'EUR', // Euro
  'GBP', // British Pound Sterling
  'JPY', // Japanese Yen
  'CHF', // Swiss Franc
  'CAD', // Canadian Dollar
  'AUD', // Australian Dollar
  'CNY', // Chinese Yuan Renminbi
  'INR', // Indian Rupee
];

export const isValidIpAddress = (ip: string): boolean => {
  if (!ip || typeof ip !== 'string') {
    return false;
  }

  // IPv4 validation
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 validation (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

export const validateAndFormatIpAddress = (ip: string): string | null => {
  if (!isValidIpAddress(ip)) {
    return null;
  }

  return ip.trim();
};

// Helper function to handle file download
export const downloadFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
