export const EXCHANGE_RATES: Record<string, number> = {
  MUR: 1,       // Base Currency
  USD: 0.022,   // 1 MUR = 0.022 USD
  EUR: 0.020,   // 1 MUR = 0.020 EUR
  GBP: 0.017,   // 1 MUR = 0.017 GBP
};

export const formatPrice = (priceInMur: number, currency: string = "MUR") => {
  const rate = EXCHANGE_RATES[currency] || 1;
  const convertedPrice = priceInMur * rate;
  
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === 'MUR' ? 0 : 2,
    maximumFractionDigits: currency === 'MUR' ? 0 : 2,
  }).format(convertedPrice);
};
