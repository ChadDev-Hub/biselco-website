"use server";

import { cookies } from "next/headers";
const baseUrl = process.env.BASESERVERURL;

export const GetAgmaTicketAll = async (
  page: string | string[] | undefined,
  year: string | string[] | undefined,
  barangay: string | string[] | undefined,
  search: string | string[] | undefined,
  municipality: string | string[] | undefined,
  is_verified: string | string[] | undefined | boolean,
) => {
  const params = new URLSearchParams();
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;

  if (search) {
    params.set("search", typeof search === "string" ? search : "");
  } else {
    if (page) {
      params.set("page", typeof page === "string" ? page : "");
    }
    if (year !== "All" && year) {
      params.set("year", typeof year === "string" ? year : "");
    }
    if (barangay !== "All" && barangay) {
      params.set("barangay", typeof barangay === "string" ? barangay : "");
    }
    if (municipality !== "All" && municipality) {
      params.set(
        "municipality",
        typeof municipality === "string" ? municipality : "",
      );
    }
    if (is_verified !== "All" && is_verified) {
      params.set(
        "is_verified",
        typeof is_verified === "string" ? is_verified : "",
      );
    }
  }
  const res = await fetch(
    `${baseUrl}/v1/agma/registered/all?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await res.json();
  if (!res.ok) {
    return {
      status: res.status,
      data: data.detail,
    };
  }
  return {
    status: res.status,
    data: data,
  };
};

export const GetAgmaFilters = async (
  municipality: string | string[] | undefined,
) => {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;
  const params = new URLSearchParams();
  if (municipality !== "All" && municipality)
    params.set(
      "municipality",
      typeof municipality === "string" ? municipality : "",
    );
  const res = await fetch(
    `${baseUrl}/v1/agma/registered/all/filters?${params.toString()}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await res.json();
  if (!res.ok) {
    return {
      status: res.status,
      data: data.detail,
    };
  }
  return {
    status: res.status,
    data: data,
  };
};

export const GetAgmaCountRegistered = async (
  municipality: string | string[] | undefined,
) => {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;
  const params = new URLSearchParams();
  if (municipality)
    params.set(
      "municipality",
      typeof municipality === "string" ? municipality : "",
    );
  const res = await fetch(
    `${baseUrl}/v1/agma/statistic/count_registered?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
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

export const GetRegisteredOverTime = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("access_token")?.value;
  const res = await fetch(`${baseUrl}/v1/agma/statistic/registered_overtime`, {
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

export const GetAgmaRegistrationSchedules = async () => {
  const data = await fetch(`${baseUrl}/v1/events/agma/registration`, {
    method: "GET",
    cache: "no-store",
  });
  const res = await data.json();
  if (!data.ok) {
    return {
      status: data.status,
      error: res.detail,
    };
  }
  return {
    status: data.status,
    data: res,
  };
};
