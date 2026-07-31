import axios from "axios";

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASESERVERURL,
  withCredentials: true,
});

const fastapiRefresh = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASESERVERURL,
  withCredentials: true,
});


clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if(error.response?.status === 401 && !originalRequest._retry) {
        try{
            originalRequest._retry = true;
            await fastapiRefresh.get('/v1/auth/token/refresh_access_token');
            return clientApi(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("LoginStatus");
            window.location.href = "/landing";
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
  },
);


export default clientApi;