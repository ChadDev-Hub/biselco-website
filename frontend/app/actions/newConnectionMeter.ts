"use server";
import { serverFetchAutoRefresh } from "./actionWraper";

const baseUrl = process.env.BASESERVERURL;

// POST NEW CONNECTION
export const newConnectionMeter = async (data: FormData) => {
  const res = serverFetchAutoRefresh(
    `${baseUrl}/v1/new_connection/`,
    "POST",
    data,
  );
  return res;
};

//  DELETE NEW CONNECTION DATA
export const deleteNewConnection = async (id: Set<number>, page: number) => {
  const res = serverFetchAutoRefresh(
    `${baseUrl}/v1/new_connection/`,
    "DELETE",
    JSON.stringify({
      items: Array.from(id),
      page: page,
    }),
    {
      "content-type": "application/json",
    },
  );
  return res;
};
