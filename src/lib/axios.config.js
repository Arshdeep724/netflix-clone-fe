import axios from "axios";
import { API_ROUTES } from "../constants";

const axiosApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosApiInstance.interceptors.request.use(async (config) => {
  config.headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  return config;
});

axiosApiInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    let res = error.response;
    const reqUrl = error.config.url;
    if (res.status === 401 && reqUrl !== "auth/login") {
      try {
        const refreshToken = localStorage.getItem("refresh");
        const refresh = await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL + "/" + API_ROUTES.REFRESH,
          {
            refresh: refreshToken,
          }
        );
        localStorage.setItem("token", refresh.data.access_token);
        error.config.headers["Authorization"] =
          "Bearer " + refresh.data.access_token;
        return axiosApiInstance(error.config);
      } catch (error) {
        if (error.response.status) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    console.error("Looks like there was a problem. Status Code: " + res.status);
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
