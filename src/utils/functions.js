import moment from "moment";

export const nonDigitRemove = str => {
  return str.replace(/[^\d]/g, "");
};

export const momentFormat = str =>{
  return moment(str).format("DD-MM-YYYY")
}