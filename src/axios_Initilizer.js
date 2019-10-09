import axios from "axios";
import { SERVICE_URL, PUBLIC_AUTH_KEY } from "./utils/Constants";

const axiosInitializer = {
  config: () => {
    axios.defaults.baseURL = SERVICE_URL;
    axios.defaults.headers.common["Authorization"] = PUBLIC_AUTH_KEY;

    //Request Interceptor
    axios.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    //Response Interceptor
    axios.interceptors.response.use(
      response => {
        if (response.data && response.data.message) {
          console.log(response.data.message);
        }
        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );
  },
};

export default axiosInitializer;
