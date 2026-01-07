/**
 * Currency utility functions for Euro (€) formatting
 */

export const formatEuro = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatEuroCompact = (amount: number): string => {
  return `€${amount.toFixed(2)}`;
};

export const parseEuroString = (euroString: string): number => {
  const cleaned = euroString.replace(/[€\s]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};
