// Utility functions for formatting dates and currency
// -------------------------------
// formatDate: formats a date string into 'MMM DD, YYYY' style
// formatCurrency: formats a number into JOD currency string

// Formats a date string (ISO or timestamp) into a readable format
export function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Formats a number into Jordanian Dinar currency string
export function formatCurrency(amount) {
  const value = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'JOD'
  }).format(value);
}