import {
  STORAGE_KEY
} from '../constants/business-fee-calculator.constants.js';

import {
  isValidBusinessPhone
} from '../validators/business-fee-calculator.validator.js';

export const readLeadSession = () => {
  try {
    const savedLead = JSON.parse(
      window.sessionStorage.getItem(
        STORAGE_KEY
      )
    );

    if (
      savedLead &&
      isValidBusinessPhone(
        savedLead.phone
      ) &&
      savedLead.terms === true
    ) {
      return {
        phone: String(
          savedLead.phone
        ),
        terms: true
      };
    }
  } catch {
    return null;
  }

  return null;
};

export const saveLeadSession = (
  phone
) => {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        phone,
        terms: true
      })
    );

    return true;
  } catch {
    return false;
  }
};