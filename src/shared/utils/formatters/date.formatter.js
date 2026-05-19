/**
 * Convierte una fecha en formato YYYYMMDD a una fecha larga en español.
 *
 * @param {string} dateValue - Fecha en formato YYYYMMDD.
 * @returns {string}
 */

export const formatLongDate = (dateValue = '') => {
  if (!dateValue || dateValue.length !== 8) return dateValue;

  const year = Number(dateValue.slice(0, 4));
  const month = Number(dateValue.slice(4, 6)) - 1;
  const day = Number(dateValue.slice(6, 8));

  const date = new Date(year, month, day);

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};