import { APP_CONFIG } from '../../../shared/config/app.config.js';
import { SOAT_MESSAGES } from '../constants/soat.messages.js';

/**
 * Solicita la cotización SOAT al webhook configurado.
 *
 * @param {Record<string, unknown>} payload
 * @returns {Promise<Record<string, unknown>>}
 */
export const requestSoatQuote = async (payload) => {
  const response = await fetch(APP_CONFIG.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok || result?.success === false) {
    const error = new Error(result?.message || SOAT_MESSAGES.QUOTE_ERROR);

    error.data = result;

    throw error;
  }

  return result;
};