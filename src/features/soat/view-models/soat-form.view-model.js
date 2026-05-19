/**
 * Construye el payload de cotización SOAT desde los datos del formulario.
 *
 * @param {HTMLFormElement} formElement
 * @param {{ withAP: boolean, privacyAccepted: boolean }} formData
 * @param {{ submitToken: string, validationToken: string }} mosparoTokens
 * @returns {{ action: string, formData: Record<string, unknown> }}
 */
export const buildSoatQuotePayload = (
  formElement,
  formData,
  mosparoTokens
) => {
  const rawFormData = Object.fromEntries(new FormData(formElement).entries());

  return {
    action: 'quote',
    formData: {
      ...rawFormData,
      withAP: formData.withAP,
      privacyPolicy: formData.privacyAccepted,
      _mosparo_submitToken: mosparoTokens.submitToken,
      _mosparo_validationToken: mosparoTokens.validationToken
    }
  };
};