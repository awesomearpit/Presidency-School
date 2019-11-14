import moment from "moment";

export const nonDigitRemove = str => {
  return str ? str.replace(/[^\d]/g, "") : null;
};

export const lowerCase = str => {
  return str ? str.toLowerCase() : null;
};

export const momentFormat = str => {
  return moment(str).format("DD-MM-YYYY");
};
