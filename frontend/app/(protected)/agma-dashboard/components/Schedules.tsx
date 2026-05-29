"use client";

import { use } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { AgmaEventSchedules } from "../../../actions/events";

type PromiseType<T> = {
  status: number;
  error?: string;
  data?: T;
};
type EventSchedules = {
  id?: string | null;
  area?: string;
  event_location?: string;
  event_date?: string;
};
type Props = {
  promiseData: Promise<PromiseType<EventSchedules[]>>;
};

const Municipality: EventSchedules[] = [
  {
    id: null,
    area: "Municipality of Coron",
    event_location: "",
    event_date: "",
  },
  {
    id: null,
    area: "Municipality of Busuanga",
    event_location: "",
    event_date: "",
  },
  {
    id: null,
    area: "Municipality of Culion",
    event_location: "",
    event_date: "",
  },
  {
    id: null,
    area: "Municipality of Linapacan",
    event_location: "",
    event_date: "",
  },
];

type FormType = {
  schedules: EventSchedules[];
};

const Schedules = ({ promiseData }: Props) => {
  const initialData = use(promiseData);
  const {
    register,
    handleSubmit,

    control,
  } = useForm<FormType>({
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

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const scheduleData = data.schedules.map((item) => ({
      id: item.id ?? null,
      area: item.area ?? "",
      event_location: item.event_location ?? "",
      event_date: item.event_date
        ? new Date(item.event_date).toISOString()
        : null,
    }));
    const res = await AgmaEventSchedules(scheduleData)
    console.log(res)
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
                  <label className="label py-1.5">
                    <span className="label-text font-medium text-xs text-base-content/70">
                      Event Location
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Municipal Hall"
                    {...register(`schedules.${index}.event_location` as const)}
                    className="input  w-full bg-base-100 focus:input-primary transition-all text-sm h-11"
                  />
                </div>

                {/* Date Input */}
                <div className="form-control w-full">
                  <label className="label py-1.5">
                    <span className="label-text font-medium text-xs text-base-content/70">
                      Event Date & Time
                    </span>
                  </label>
                  <input
                    type="datetime-local"
                    {...register(`schedules.${index}.event_date` as const)}
                    className="input input-bordered w-full bg-base-100 focus:input-primary transition-all text-sm h-11"
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
