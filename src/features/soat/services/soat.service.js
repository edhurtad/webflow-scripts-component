import { APP_CONFIG } from '../../../shared/config/app.config.js' 


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
  const error = new Error(
    result?.message || 'No fue posible realizar la cotización.'
  );

  error.data = result;

  throw error;
}

  return result;
};