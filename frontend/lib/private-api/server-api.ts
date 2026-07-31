import { cookies } from "next/headers";
import axios from "axios";

const getServiceApi = async () => {
  const cookieStore = await cookies();
  const serverApi = axios.create({
    baseURL: process.env.BASESERVERURL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const fastapiRefresh = axios.create({
    baseURL: process.env.BASESERVERURL,
    withCredentials: true,
  });

  serverApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        try {
          originalRequest._retry = true;
          await fastapiRefresh.get("/v1/auth/token/refresh_access_token");
          return serverApi(originalRequest);
        } catch (refreshError) {
          throw refreshError;
        }
      }

      return Promise.reject(error);
    },
  );
  return serverApi;
};

export default getServiceApi;
