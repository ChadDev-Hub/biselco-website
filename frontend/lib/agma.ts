"use server";

import { cookies } from "next/headers";
const baseUrl = process.env.BASESERVERURL;

export const GetAgmaCountRegistered = async (municipality?: string) => {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;
  const params = new URLSearchParams();
  if (municipality) params.set("municipality", municipality);
  const res = await fetch(`${baseUrl}/v1/agma/statistic/count_registered?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    return {
      status: res.status,
      error: data.detail,
    };
  }
  return {
    status: res.status,
    data: data,
  };
};
