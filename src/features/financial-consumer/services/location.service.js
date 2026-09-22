import { locationConfig } from "../../../shared/config/location.config.js";

const fetchJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export const getDepartments = async () => {
  const data = await fetchJson(
    `${locationConfig.apiUrlCities}/z_departaments.json`
  );

  return data.departments ?? data.deparments ?? [];
};

export const getCities = async (departmentKey) => {
  const data = await fetchJson(
    `${locationConfig.apiUrlCities}/${departmentKey}.json`
  );

  return Object.entries(data.cities ?? {}).map(([label, id]) => ({
    id,
    label,
  }));
};