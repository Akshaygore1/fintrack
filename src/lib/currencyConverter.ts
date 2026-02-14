// Currency conversion utilities for FinTrack

export type Currency = 'USD' | 'INR';

// Default exchange rate (1 USD = 85 INR)
// This can be updated by the user in settings
export const DEFAULT_EXCHANGE_RATE = 85;

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * exchangeRate;
  }

  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }

  return amount;
}

/**
 * Get the currency symbol for a given currency
 */
export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'INR':
      return '₹';
    default:
      return '$';
  }
}

/**
 * Get the locale for number formatting
 */
export function getCurrencyLocale(currency: Currency): string {
  switch (currency) {
    case 'USD':
      return 'en-US';
    case 'INR':
      return 'en-IN';
    default:
      return 'en-US';
  }
}

/**
 * Format amount in the specified currency
 */
export function formatAmount(
  amount: number,
  currency: Currency,
  options?: Intl.NumberFormatOptions
): string {
  const locale = getCurrencyLocale(currency);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/**
 * Format amount in compact notation (K, L, Cr)
 */
export function formatCompactAmount(amount: number, currency: Currency): string {
  const absAmount = Math.abs(amount);
  const symbol = getCurrencySymbol(currency);
  const sign = amount < 0 ? '-' : '';

  if (currency === 'INR') {
    if (absAmount >= 10000000) {
      return `${sign}${symbol}${(absAmount / 10000000).toFixed(2)}Cr`;
    }
    if (absAmount >= 100000) {
      return `${sign}${symbol}${(absAmount / 100000).toFixed(2)}L`;
    }
    if (absAmount >= 1000) {
      return `${sign}${symbol}${(absAmount / 1000).toFixed(2)}K`;
    }
  } else {
    // USD uses standard K, M, B notation
    if (absAmount >= 1000000000) {
      return `${sign}${symbol}${(absAmount / 1000000000).toFixed(2)}B`;
    }
    if (absAmount >= 1000000) {
      return `${sign}${symbol}${(absAmount / 1000000).toFixed(2)}M`;
    }
    if (absAmount >= 1000) {
      return `${sign}${symbol}${(absAmount / 1000).toFixed(2)}K`;
    }
  }

  return `${sign}${symbol}${absAmount.toFixed(2)}`;
}
