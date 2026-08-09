"use server";

import { cookies } from "next/headers";
const baseUrl = process.env.BASESERVERURL;




export const GetRaffleInitialEntries = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;
  const res = await fetch(`${baseUrl}/v1/agma/raffle/initial_entries`, {
    method: "GET",
    cache: "no-store",
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

export const GetRaffleStatsData = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;
  const res = await fetch(`${baseUrl}/v1/agma/raffle/stats`, {
    method: "GET",
    cache: "no-store",
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


