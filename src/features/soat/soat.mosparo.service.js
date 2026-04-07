import { APP_CONFIG } from '../../shared/config/app.config.js';

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
        reject(new Error('Mosparo no cargó a tiempo.'));
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
    'mosparo-box',
    APP_CONFIG.mosparo.host,
    APP_CONFIG.mosparo.uuid,
    APP_CONFIG.mosparo.publicKey,
    { designMode: false }
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