import { locationConfig } from "../../../shared/config/location.config.js";

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} key
 * @property {string} label
 */

/**
 * @typedef {Object} City
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} DepartmentsResponse
 * @property {Department[]=} departments
 * @property {Department[]=} deparments
 */

/**
 * @typedef {Object} CitiesResponse
 * @property {Record<string, string>} cities
 */

/**
 * Obtiene y transforma una respuesta HTTP en JSON.
 *
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
const fetchJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  return /** @type {Promise<T>} */ (
    response.json()
  );
};

/**
 * Obtiene la lista de departamentos.
 *
 * Mantiene compatibilidad con la propiedad histórica
 * "deparments" de la fuente de datos.
 *
 * @returns {Promise<Department[]>}
 */
export const getDepartments = async () => {
  const data =
    await fetchJson(
      `${locationConfig.apiUrlCities}/z_departaments.json`
    );

  const typedData =
    /** @type {DepartmentsResponse} */ (data);

  return (
    typedData.departments ??
    typedData.deparments ??
    []
  );
};

/**
 * Obtiene las ciudades asociadas a un departamento.
 *
 * @param {string} departmentKey
 * @returns {Promise<City[]>}
 */
export const getCities = async (
  departmentKey
) => {
  const data =
    await fetchJson(
      `${locationConfig.apiUrlCities}/${departmentKey}.json`
    );

  const typedData =
    /** @type {CitiesResponse} */ (data);

  return Object.entries(
    typedData.cities ?? {}
  ).map(([label, id]) => ({
    id,
    label,
  }));
};