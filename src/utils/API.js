import axios from "axios";
import { SECRET_KEY, ACCESS_KEY, PRIVATE_AUTH_KEY } from "./Constants";
import cookie from "react-cookies";

export const headerConfig = {
  "Content-Type": "application/json",
};

export const headerFormData = {
  "Content-Type": "multipart/form-data",
  // "Content-Type": "'multipart/form-data'",
};

export const headerUpdatePassword = {
  "Content-Type": "application/json",
  Authorization: `${PRIVATE_AUTH_KEY}`,
};

export const activityPayload = {
  Parameter: { ActivityEvent: 201 },
};

export const register = async signupData => {
  return await axios.post(
    `/api/Authentication/Register?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}`,
    signupData,
    headerConfig,
  );
};

export const otp = async otpData => {
  return await axios.post(`/api/Form/SendOTP`, otpData, headerConfig);
};

export const otpVerify = async otpData => {
  return await axios.post(`/api/Form/VerifyOTP`, otpData, headerConfig);
};

export const signIn = async loginData => {
  return await axios.post(
    `/api/Authentication/Signin?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}`,
    loginData,
  );
};

export const logout = async () => {
  await cookie.remove("AuthKey", { path: "/" });
  await cookie.remove("LeadId", { path: "/" });
};

export const post = async (basePath, data) => {
  return await axios.post(`${basePath}`, data, headerConfig);
};

export const formDataPost = async (basePath, data) => {
  return await axios({
    method: "post",
    url: basePath,
    data: data,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  });
};

export const get = async basePath => {
  return await axios.get(`${basePath}`);
};

export const activityPost = async basePath => {
  return await axios.post(`${basePath}`, activityPayload);
};

export const activityPostEvent = async (basePath, payload) => {
  return await axios.post(`${basePath}`, payload);
};

export const activityUpdatePost = async (basePath, payload) => {
  return await axios.post(`${basePath}`, payload, headerConfig);
};

export const updatePasword = async data => {
  return await axios.post(
    `https://portalapi-in21.leadsquared.com/api/Settings/ChangePassword?accessKey=${ACCESS_KEY}&secretKey=${SECRET_KEY}`,
    data,
    headerUpdatePassword,
  );
};
