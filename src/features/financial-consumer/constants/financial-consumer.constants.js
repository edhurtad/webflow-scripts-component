export const FINANCIAL_CONSUMER_IDS = Object.freeze({
  documentNumber: "document-number",
  email: "email",
  phoneNumber: "phone-number",

  department: "department",
  city: "city",

  submissionDate: "submission-date",

  otherProduct: "other-product",
  otherProductField: "other-product-field",

  otherService: "other-service",
  otherServiceField: "other-service-field",

  caseDescription: "case-description",
  caseDescriptionCounter: "case-description-counter",

  specificRequest: "specific-request",
  specificRequestCounter: "specific-request-counter",

  amount: "amount",
});

export const FINANCIAL_CONSUMER_NAMES = Object.freeze({
  submissionDate: "fecha_digilenciamiento",
  idType: "tipo_documento",

  claimedProduct: "producto_reclamado",
  otherProduct: "otherProduct",

  claimedChannel: "canal_reclamo",

  claimedService: "servicio_fallas",
  otherService: "otherService",

  caseDescription: "descripcion_hechos",
  specificRequest: "solicitud_puntual",

  amount: "cuantia_reclamacion",
});

export const FINANCIAL_CONSUMER_VALUES = Object.freeze({
  otherProduct: "Otro",
  otherService: "Otro producto canal o servicio",
});

export const FINANCIAL_CONSUMER_LIMITS = Object.freeze({
  phoneNumber: 10,
  documentNumber: 15,
  caseDescription: 3000,
  specificRequest: 3000,
  maxFileSize: 5 * 1024 * 1024,
});

export const FINANCIAL_CONSUMER_PLACEHOLDERS = Object.freeze({
  department: "Seleccione el departamento",
  city: "Seleccione la ciudad",
});