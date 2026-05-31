"use client";

import { use, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { SetupAgmaEvent } from "../../../actions/events";
import { useAlert } from "../../../common/alert";
import { useWebsocket } from "@/app/utils/websocketprovider";


// Define the shape of your event configuration data
type FormType = {
  title: string;
  description: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  created_at?: string;
  start_time?: string;
  end_time?: string;
};
type PromiseType = {
  status: number;
  detail?: string | undefined;
  data?: FormType | undefined;
};
type Props = {
  initialData: Promise<PromiseType>;
};

const labelClassName = "label text-sm font-medium mb-2"
const inputClassName = "input bg-base-100 w-full rounded-box focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"

const SetupSection = ({ initialData }: Props) => {
  const AgmaEventData = use(initialData);
  const { message } = useWebsocket();
  const { showAlert } = useAlert();
  const [processedEvent, setProcessedEvent] = useState<string[]>(()=>{
    if (typeof window === "undefined") return []; // SSR safety guard
    try {
      const stored = localStorage.getItem("processed_events");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const {
    getValues,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      title: AgmaEventData.data?.title ?? "AGMA",
      description:
        AgmaEventData.data?.description ??
        "Annual General Membership Assembly Meeting",
      start_date: AgmaEventData.data?.start_date,
      end_date: AgmaEventData.data?.end_date,
      start_time: AgmaEventData.data?.start_time,
      end_time: AgmaEventData.data?.end_time,
      is_active: AgmaEventData.data?.is_active,
    },
  });
  useEffect(() => {
    if (message?.detail === "agma_setup") {
      if (processedEvent.includes(message.event_id)) return;
      queueMicrotask(() => {
        setProcessedEvent((prev) => {
          const update = [...prev, message.event_id]
          localStorage.setItem("processed_events", JSON.stringify(update))
          return update
        });
      });
      
      setValue("title", message.data.title);
      setValue("description", message.data.description);
      setValue("start_date", message.data.start_date);
      setValue("end_date", message.data.end_date);
      setValue("start_time", message.data.start_time);
      setValue("end_time", message.data.end_time);
      setValue("is_active", message.data.is_active);
      showAlert("success", message.message);
    }
  }, [message, setValue, showAlert, processedEvent]);


  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (value !== "") formData.append(key, String(value));
    }
    const res = await SetupAgmaEvent(formData);
    switch (res?.status) {
      case 201:
        showAlert("success", res.data.message);
        break;
      case 403:
        showAlert("error", res.data.message);
        break;
      default:
        break;
    }
  };
  // Toggle active status helper

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 my-4">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Event Configuration
          </h2>
          <p className="text-sm text-gray-500">
            Manage operational parameters and scheduling for the assembly.
          </p>
        </div>

        {/* Status Badge Toggle */}
        <div
          className={`px-4 py-1.5 badge badge-outline w-fit text-nowrap text-xs font-semibold tracking-wide transition-all ${
            getValues("is_active") ? "badge-success" : "badge-neutral"
          }`}
        >
          {getValues("is_active") ? "● Active" : "○ Inactive"}
        </div>
      </div>

      {/* Grid Configuration Fields */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name - Full Width */}
          <div className="md:col-span-2">
            <label className={labelClassName}>
              Event Title
            </label>
            <div
              title="Event Name"
              className={inputClassName}
            >
              {getValues("description")}
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className={labelClassName}>
              Start Date
            </label>
            <input
              title="Start Date"
              type="date"
              {...register("start_date")}
              className={inputClassName}
            />
          </div>

          {/* End Date */}
          <div>
            <label className={labelClassName}>
              End Date
            </label>
            <input
              title="End Date"
              type="date"
              {...register("end_date")}
              className={inputClassName}
            />
          </div>

          {/* Registration Opening Time */}
          <div>
            <label className={labelClassName}>
              Registration Opening Time
            </label>
            <input
              title="Registration Opening Time"
              type="time"
              {...register("start_time")}
              className={inputClassName}
            />
          </div>

          {/* Assembly Formal Call Time */}
          <div>
            <label className={labelClassName}>
              Registration Closing Time
            </label>
            <input
              title="Assembly Call Time"
              type="time"
              {...register("end_time")}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="mt-8 w-full pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isSubmitting ? (
              <span className="skeleton skeleton-text">
                Saving Configuration...
              </span>
            ) : (
              <span>Save Configuration</span>
            )}
          </button>
        </div>
      </form>

      {/* Footer Audit Tracking */}
    </div>
  );
};

export default SetupSection;
