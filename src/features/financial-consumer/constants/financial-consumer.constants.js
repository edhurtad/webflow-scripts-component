/**
 * @typedef {Object} FinancialConsumerIds
 * @property {string} documentNumber
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} department
 * @property {string} city
 * @property {string} submissionDate
 * @property {string} otherProduct
 * @property {string} otherProductField
 * @property {string} otherService
 * @property {string} otherServiceField
 * @property {string} caseDescription
 * @property {string} caseDescriptionCounter
 * @property {string} specificRequest
 * @property {string} specificRequestCounter
 * @property {string} amount
 */

/**
 * @typedef {Object} FinancialConsumerNames
 * @property {string} submissionDate
 * @property {string} idType
 * @property {string} claimedProduct
 * @property {string} otherProduct
 * @property {string} claimedChannel
 * @property {string} claimedService
 * @property {string} otherService
 * @property {string} caseDescription
 * @property {string} specificRequest
 * @property {string} amount
 */

/**
 * @typedef {Object} FinancialConsumerValues
 * @property {string} otherProduct
 * @property {string} otherService
 */

/**
 * @typedef {Object} FinancialConsumerLimits
 * @property {number} phoneNumber
 * @property {number} documentNumber
 * @property {number} caseDescription
 * @property {number} specificRequest
 * @property {number} maxFileSize
 */

/**
 * @typedef {Object} FinancialConsumerPlaceholders
 * @property {string} department
 * @property {string} city
 */

/** @type {Readonly<FinancialConsumerIds>} */
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

/** @type {Readonly<FinancialConsumerNames>} */
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

/** @type {Readonly<FinancialConsumerValues>} */
export const FINANCIAL_CONSUMER_VALUES = Object.freeze({
  otherProduct: "Otro",
  otherService: "Otro producto canal o servicio",
});

/** @type {Readonly<FinancialConsumerLimits>} */
export const FINANCIAL_CONSUMER_LIMITS = Object.freeze({
  phoneNumber: 10,
  documentNumber: 15,
  caseDescription: 3000,
  specificRequest: 3000,
  maxFileSize: 5 * 1024 * 1024,
});

/** @type {Readonly<FinancialConsumerPlaceholders>} */
export const FINANCIAL_CONSUMER_PLACEHOLDERS = Object.freeze({
  department: "Seleccione el departamento",
  city: "Seleccione la ciudad",
});