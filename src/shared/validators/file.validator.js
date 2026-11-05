/**
 * @param {File | null | undefined} file
 * @param {number} maxFileSize
 * @returns {boolean}
 */
export const isValidFileSize = (
  file,
  maxFileSize
) => {
  if (!file) return true;

  return file.size <= maxFileSize;
};