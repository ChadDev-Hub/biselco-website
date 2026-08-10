import getServerApi from "./server-api";
import axios from "axios";
import { ApiError } from "@/types/api-error";
import { AllTicketInfoType } from "../../../types/agma";
import { redirect } from "next/navigation";
type Props = {
  search: string | string[] | undefined;
  page: string | string[] | undefined;
  year: string | string[] | undefined;
  barangay: string | string[] | undefined;
  municipality: string | string[] | undefined;
  is_verified: string | string[] | undefined | boolean;
};

// GET ALL TICKETS
export const GetAgmaTicketAll = async ({
  search,
  page,
  year,
  barangay,
  municipality,
  is_verified,
}: Props) => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(`/v1/agma/registered/all`, {
      params: {
        search: search,
        page: page,
        year: year,
        barangay: barangay,
        municipality: municipality,
        is_verified: is_verified,
      },
      headers: {
        "Catch-Control": "no-cache",
        "pragma": "no-cache",
      },
    });
    return {
      status: status,
      data: data as AllTicketInfoType,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};

// GET ALL FILTERS
export const GetAgmaFilters = async (
  municipality: string | string[] | undefined,
) => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(
      "/v1/agma/registered/all/filters",
      {
        params: {
          municipality: municipality,
        },
      },
    );
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};

// GET COUNT REGISTERED
export const GetAgmaCountRegistered = async (
  municipality: string | string[] | undefined,
) => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(
      "/v1/agma/statistic/count_registered",
      {
        params: {
          municipality: municipality,
        },
      },
    );
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};

// REGISTERED BY MUNICIPALITY
export const GetAgmaRegisterByMunicipality = async () => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(
      "/v1/agma/statistic/total_per_mun",
    );
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};

// GET AGMA REGISTRATION SCHEDULE
export const GetAgmaRegistrationSchedules = async () => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(
      "/v1/events/agma/registration",
    );
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};

//  GET AGMA STATS
export const GetAgmaStats = async () => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get("/v1/agma/stats");
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};

// GET AGMA SETUP
export const GetAgmaSetup = async () => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get("/v1/agma/setup");
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};

// GET AGMA SCHEDULES
export const GetAgmaSchedules = async () => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get("/v1/events/agma/schedules");
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data.detail,
        error.response?.status || 500,
      );
    }
    throw error;
  }
};


// AGMA RAFFLE -------------------------------------------------------------

// GET AGMA RAFFLE ENTRY
export const GetRaffleInitialEntries = async () => {
  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(
      "/v1/agma/raffle/initial_entries",
    );
    return {
      status: status,
      data: data as string[],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};



export const GetRaffleStatsData = async () => {

  try {
    const serverApi = await getServerApi();
    const { data, status } = await serverApi.get(
      "/v1/agma/raffle/stats",
    );
    return {
      status: status,
      data: data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          redirect("/");
        default:
          throw new ApiError(
            error.response?.data.detail,
            error.response?.status || 500,
          );
      }
    }
    throw error;
  }
};
 