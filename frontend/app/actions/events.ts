"use server";
import { serverFetchAutoRefresh } from "./actionWraper";
const baseUrl = process.env.BASESERVERURL;

export const SetupAgmaEvent = async (form: FormData) => {
  const data = await serverFetchAutoRefresh(
    `${baseUrl}/v1/agma/setup`,
    "POST",
    form,
  );
  return data;
};

export const AgmaEventSchedules = async (data) => {
  const res = await serverFetchAutoRefresh(`${baseUrl}/v1/events/agma/schedules`,"POST",
    JSON.stringify(data),
    {"Content-Type": "application/json"}
)
  return res;
};
