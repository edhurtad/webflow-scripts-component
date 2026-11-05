import {
  onlyNumbers,
} from "../../../shared/utils/string.utils.js";

export const getTodayIsoDate = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatSubmissionDate = (value = "") => {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}/${year}`;
};

/**
 * @param {string | number} value
 * @returns {string}
 */
export const normalizeAmount = (value = "") => {
  const normalizedValue =
    onlyNumbers(value).replace(
      /^0+(?=\d)/,
      ""
    );

  return normalizedValue || "0";
};

/**
 * @param {string | number} value
 * @returns {string}
 */
export const formatAmount = (value = "") => {
  const normalizedValue =
    normalizeAmount(value);

  return normalizedValue.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );
};