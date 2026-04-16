const isValidPhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

const isValidPlate = (plate) => {
  return /^[A-Z0-9]{6}$/.test(plate);
};

const isValidIdentification = (identification) => {
  return Boolean(identification && identification.trim().length > 0);
};

const isPrivacyAccepted = (privacyAccepted) => {
  return privacyAccepted === true;
};

export const validateSoatForm = (formData) => {
  const errors = {};

  if (!isValidPhone(formData.phone)) {
    errors.phone = 'El celular debe tener 10 dígitos';
  }

  if (!isValidPlate(formData.plate)) {
    errors.plate = 'La placa no es válida';
  }

  if (!isValidIdentification(formData.identification)) {
    errors.identification = 'La cédula es obligatoria';
  }

  if (!isPrivacyAccepted(formData.privacyAccepted)) {
    errors.privacyAccepted = 'Debes autorizar el tratamiento de datos';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};