export const FX_MESSAGES = Object.freeze({
  INVALID_PHONE:
    'Ingresa primero un número Nequi válido de 10 dígitos.',

  CONSENT_REQUIRED:
    'Debes autorizar el tratamiento de tus datos para continuar.',

  INVALID_AMOUNT:
    'Ingresa un monto válido para consultar la conversión.',

  MAX_INTERESTS:
    'Puedes seleccionar máximo 2 opciones.',

  INVALID_REQUEST:
    'Revisa la información ingresada e inténtalo nuevamente.',

  UNSUPPORTED_CONVERSION:
    'Esta conversión no está disponible.',

  RATE_LIMIT:
    'Has realizado varias consultas seguidas. Espera un momento e inténtalo nuevamente.',

  RATE_UNAVAILABLE:
    'No pudimos consultar la tasa en este momento. Inténtalo nuevamente.',

  GENERIC_ERROR:
    'No fue posible realizar la conversión. Inténtalo nuevamente.'
});

export const FX_INTEREST_LABELS = Object.freeze({
  travel: 'Viajar',
  save: 'Ahorrar',
  buy: 'Comprar en línea',
  invest: 'Invertir',
  send: 'Enviar dinero',
  study: 'Estudiar'
});

export const FX_OPERATION_LABELS = Object.freeze({
  BUY: 'Tasa de compra',
  SELL: 'Tasa de venta'
});