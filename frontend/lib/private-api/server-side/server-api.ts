import { cookies } from "next/headers";
import axios from "axios";

const getServerApi = async () => {
  const cookieStore = await cookies();
  const serverApi = axios.create({
    baseURL: process.env.BASESERVERURL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return serverApi;
};

export default getServerApi;
