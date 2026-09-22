/**
 * @typedef {Object} FinancialConsumerMessages
 * @property {string} invalidEmail
 * @property {string} invalidPhone
 * @property {string} invalidDocument
 * @property {string} fileTooLarge
 * @property {string} departmentsError
 * @property {string} citiesError
 */

/** @type {Readonly<FinancialConsumerMessages>} */
export const FINANCIAL_CONSUMER_MESSAGES = Object.freeze({
  invalidEmail: "Ingrese un correo válido.",
  invalidPhone: "El número debe tener 10 dígitos.",
  invalidDocument: "Ingrese un número de documento válido.",
  fileTooLarge: "El archivo excede el tamaño máximo permitido de 5 MB.",
  departmentsError: "No fue posible cargar los departamentos.",
  citiesError: "No fue posible cargar las ciudades.",
});