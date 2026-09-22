export const sanitizeDigits = (value = "") => {
  return String(value).replace(/\D/g, "");
};

export const isValidPhoneNumber = (
  value,
  expectedLength = 10
) => {
  return sanitizeDigits(value).length === expectedLength;
};

export const isValidDocumentNumber = (
  value,
  maxLength = 15
) => {
  const documentNumber = sanitizeDigits(value);

  return (
    documentNumber.length > 0 &&
    documentNumber.length <= maxLength
  );
};

export const isValidEmail = (value = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(value).trim()
  );
};

export const isValidFileSize = (
  file,
  maxFileSize
) => {
  if (!file) return true;

  return file.size <= maxFileSize;
};