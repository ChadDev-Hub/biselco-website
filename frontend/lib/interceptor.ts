import axios from "axios";

const fastapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASESERVERURL,
  withCredentials: true,
});

const fastapiRefresh = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASESERVERURL,
  withCredentials: true,
});



fastapi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._retry) {
        try{
            originalRequest._retry = true;
            await fastapiRefresh.get('/v1/auth/token/refresh');
            return fastapi(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("LoginStatus");
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
  },
);


export default fastapi;