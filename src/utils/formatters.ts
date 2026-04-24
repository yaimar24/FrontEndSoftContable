/**
 * Centralized formatting utilities for currency, dates, and numbers.
 * Change APP_LOCALE and APP_CURRENCY here to adapt the entire app.
 */

const APP_LOCALE = 'es-CO';
const APP_CURRENCY = 'COP';

export const formatCurrency = (val?: number): string =>
  new Intl.NumberFormat(APP_LOCALE, { style: 'currency', currency: APP_CURRENCY, maximumFractionDigits: 0 }).format(val || 0);

export const formatCurrencyDecimals = (val?: number): string =>
  (val || 0).toLocaleString(APP_LOCALE, { style: 'currency', currency: APP_CURRENCY });

export const formatNumber = (val?: number): string =>
  (val || 0).toLocaleString(APP_LOCALE);

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat(APP_LOCALE, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatDateShort = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(APP_LOCALE);
};
