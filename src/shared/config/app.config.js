export const APP_CONFIG = {
  webhookUrl: window.SOAT_CONFIG?.webhookUrl || '',
  mosparo: {
    host: window.SOAT_CONFIG?.mosparoHost || '',
    uuid: window.SOAT_CONFIG?.mosparoUuid || '',
    publicKey: window.SOAT_CONFIG?.mosparoPublicKey || ''
  }
};