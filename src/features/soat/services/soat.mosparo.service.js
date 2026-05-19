import { APP_CONFIG } from '../../../shared/config/app.config.js';
import { SOAT_MESSAGES } from '../constants/soat.messages.js';

const MOSPARO_CONTAINER_ID = 'mosparo-box';

const waitForMosparo = (maxAttempts = 40, delay = 250) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      attempts += 1;

      if (window.mosparo) {
        resolve(window.mosparo);
        return;
      }

      if (attempts >= maxAttempts) {
        reject(new Error(SOAT_MESSAGES.MOSPARO_TIMEOUT_ERROR));
        return;
      }

      setTimeout(check, delay);
    };

    check();
  });
};

export const createMosparoInstance = async () => {
  const Mosparo = await waitForMosparo();

  return new Mosparo(
    MOSPARO_CONTAINER_ID,
    APP_CONFIG.mosparo.host,
    APP_CONFIG.mosparo.uuid,
    APP_CONFIG.mosparo.publicKey,
    {
      designMode: false,
      language: 'es_419',
      customMessages: {
        es_419: {
          label: SOAT_MESSAGES.MOSPARO_LABEL
        },
        es_CO: {
          label: SOAT_MESSAGES.MOSPARO_LABEL
        },
        es_ES: {
          label: SOAT_MESSAGES.MOSPARO_LABEL
        }
      }
    }
  );
};

export const getMosparoTokens = (formElement) => {
  const submitToken =
    formElement?.querySelector('[name="_mosparo_submitToken"]')?.value || '';

  const validationToken =
    formElement?.querySelector('[name="_mosparo_validationToken"]')?.value || '';

  return {
    submitToken,
    validationToken
  };
};