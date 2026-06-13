import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  currency: 'MUR' | 'USD' | 'EUR' | 'GBP';
  setCurrency: (currency: 'MUR' | 'USD' | 'EUR' | 'GBP') => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'MUR', // Default currency
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'currency-storage',
    }
  )
);
