/**
 * @param {number} value
 * @param {number} minimumFractionDigits
 * @param {number} maximumFractionDigits
 * @returns {string}
 */
export const formatNumber = (
  value,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0
) => {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return new Intl.NumberFormat(
    'es-CO',
    {
      minimumFractionDigits,
      maximumFractionDigits
    }
  ).format(value);
};