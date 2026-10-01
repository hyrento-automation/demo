import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'MUR' | 'CHF';

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  AED: 'AED ',
  MUR: 'Rs ',
  CHF: 'CHF ',
};

export const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83,
  AED: 3.67,
  MUR: 45,
  CHF: 0.90,
};

export function formatPrice(amountInUsd: number, currency: SupportedCurrency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const rate = CURRENCY_RATES[currency] || 1;
  const converted = Math.round(amountInUsd * rate);
  return `${symbol}${converted.toLocaleString()}`;
}

interface CurrencyState {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatPrice: (amountInUsd: number) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'USD', // Default universal currency
      setCurrency: (currency) => set({ currency }),
      formatPrice: (amountInUsd: number) => formatPrice(amountInUsd, get().currency),
    }),
    {
      name: 'currency-storage-v2',
    }
  )
);
