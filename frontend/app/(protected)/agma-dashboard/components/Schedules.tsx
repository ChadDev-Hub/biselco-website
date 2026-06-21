"use client";

import { use, useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { AgmaEventSchedules } from "../../../actions/events";
import { useWebsocket } from "@/app/utils/websocketprovider";
import { useAlert } from "../../../common/alert";
import { event } from "next/dist/build/output/log";


type PromiseType<T> = {
  status: number;
  error?: string;
  data?: T;
};
type EventSchedules = {
  id?: string | null;
  area?: string;
  event_location: string | null;
  event_date: string | null;
};
type Props = {
  promiseData: Promise<PromiseType<EventSchedules[]>>;
};

const Municipality: EventSchedules[] = [
  {
    id: null,
    area: "Municipality of Coron",
    event_location: null,
    event_date: null,
  },
  {
    id: null,
    area: "Municipality of Busuanga",
    event_location: null,
    event_date: null,
  },
  {
    id: null,
    area: "Municipality of Culion",
    event_location: null,
    event_date: null,
  },
  {
    id: null,
    area: "Municipality of Linapacan",
    event_location: null,
    event_date: null,
  },
];

type FormType = {
  schedules: EventSchedules[];
};
// CLASSNAMES
const labelClassName = "label text-sm font-medium mb-2"
const inputClassName = "input bg-base-100 w-full rounded-box focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"


const Schedules = ({ promiseData }: Props) => {
  const initialData = use(promiseData);
  
  const { message } = useWebsocket();
  const { showAlert } = useAlert();
  const [processedEvent, setProcessedEvent] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const store = localStorage.getItem("processed_events");
      return store ? JSON.parse(store) : [];
    } catch {
      return [];
    }
  });
  // FORM
  const { register, handleSubmit, control, setValue } = useForm<FormType>({
    defaultValues: {
      schedules: Municipality.map((mun) => {
        const existing = initialData?.data?.find(
          (item) => item.area === mun.area,
        );
        return existing ? { ...mun, ...existing } : mun;
      }),
    },
  });
  const { fields } = useFieldArray({
    control: control,
    name: "schedules",
  });

  useEffect(() => {
    if (message?.detail == "agma_cheds") {
      if (processedEvent.includes(message.event_id)) return;
      queueMicrotask(() => {
        setProcessedEvent((prev) => {
          const update = [...prev, message.event_id];
          localStorage.setItem("processed_events", JSON.stringify(event));
          return update;
        });
      });
      setValue("schedules", message.data);
    }
  }, [message, processedEvent, setValue]);

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    
    const payload = data.schedules.map((sched)=>({
      ...sched,
      event_date: sched.event_date ? new Date(sched.event_date).toISOString() : null
    }))
    const res = await AgmaEventSchedules(payload);
   
    switch (res?.status) {
      case 404:
        showAlert("warning", res.data);
        break;
      case 201:
        showAlert("success", res.data.message);
        break;
      default:
        break;
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto bg-base-100 border border-base-200 shadow-md rounded-2xl overflow-hidden">
      {/* HEADER */}
      <header className="p-6 border-b border-base-200 bg-base-50/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight text-base-content">
          Agma Schedules
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Manage and update municipal event schedules
        </p>
      </header>

      {/* FORM BODY */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
        <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {fields.map((sched, index) => (
            <div
              key={sched.area}
              className="group p-5 rounded-xl border border-base-200 bg-base-50/30 hover:bg-base-50 hover:border-primary/30 transition-all duration-200"
            >
              {/* Region Label */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                <h2 className="font-semibold text-sm tracking-wide uppercase text-base-content/80">
                  {sched.area}
                </h2>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Input */}
                <div className="form-control w-full">
                  <label className={labelClassName}>
                    <span className="label-text font-medium text-xs text-base-content/70">
                      Event Location
                    </span>
                  </label>
                  <input
                    type="text"
                    {...register(`schedules.${index}.event_location` as const)}
                    className={inputClassName}
                  />
                </div>

                {/* Date Input */}
                <div className="form-control w-full">
                  <label className={labelClassName}>
                    <span className="label-text font-medium text-xs text-base-content/70">
                      Event Date & Time
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    {...register(`schedules.${index}.event_date` as const)}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* ACTIONS FOOTER */}
        <footer className="p-4 bg-base-50/80 border-t border-base-200 flex justify-end gap-3">
          <button
            type="submit"
            className="btn btn-primary btn-sm px-6 norm-case shadow-md"
          >
            Save Schedules
          </button>
        </footer>
      </form>
    </div>
  );
};

export default Schedules;
