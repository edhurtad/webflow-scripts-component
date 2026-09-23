/**
 * @param {string} value
 * @returns {string}
 */
export const onlyNumbers = (
  value = ''
) => String(value).replace(/\D/g, '');