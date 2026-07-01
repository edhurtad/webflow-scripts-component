import { SOAT_MESSAGES } from '../constants/soat.messages.js';

const isValidPhone = (phone) => {
  return /^3\d{9}$/.test(phone);
};

const isValidPlate = (plate) => {
  return /^[A-Z0-9]{6}$/.test(plate);
};

const isValidIdentification = (identification) => {
  return /^\d{6,10}$/.test(identification);
};

const isPrivacyAccepted = (privacyAccepted) => {
  return privacyAccepted === true;
};

/**
 * Valida los datos del formulario SOAT.
 *
 * @param {{ phone: string, plate: string, identification: string, privacyAccepted: boolean }} formData
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validateSoatForm = (formData) => {
  const errors = {};

  if (!isValidPhone(formData.phone)) {
    errors.phone = SOAT_MESSAGES.INVALID_PHONE;
  }

  if (!isValidPlate(formData.plate)) {
    errors.plate = SOAT_MESSAGES.INVALID_PLATE;
  }

  if (!isValidIdentification(formData.identification)) {
    errors.identification = SOAT_MESSAGES.INVALID_IDENTIFICATION;
  }

  if (!isPrivacyAccepted(formData.privacyAccepted)) {
    errors.privacyAccepted = SOAT_MESSAGES.PRIVACY_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};