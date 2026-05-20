"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { queryConsumer } from "../../../lib/serverFetch";
import BiselcoMap from "@/app/common/Map";
import { PostComplaints } from "@/app/actions/complaint";
import ImageViewer from "../../(protected)/technical/change-meter/components/imageViewr";
type ConsumerData = {
  account_no: string;
  account_name: string;
  meter_brand: string;
  meter_no: string;
  village: string;
  municipality: string;
  geolocation: {
    type: string;
    coordinates: coordinates;
  };
};
type coordinates = number[];
// Define the type for form data
type ComplaintFormData = {
  accountNumber: string;
  issue: string | null;
  detail: string | null;
  lon?: number;
  lat?: number;
  attachment?: File;
};

type Props = {
  title: string;
  choices?: string[];
  isother?: boolean;
};

const MeterComplaintsV1 = ({ choices, isother }: Props) => {
  // DEFINE STATE VARIABLES------------------------------------------------------
  const [consumer, setConsumer] = useState<ConsumerData[]>([]);
  const [selectedConsumer, setSelectedConsumer] = useState<string>("");

  // CREATE FORM HOOK
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    reset,
    control,
  } = useForm<ComplaintFormData>({});

  // WATCH INPUTS ---------------------------------------------------------------
  const accountNumber = useWatch({
    control: control,
    name: "accountNumber",
  });

  // WATCH LATITUDE AND LONGITUDE
  const lat = useWatch({
    control: control,
    name: "lat",
  });
  const lon = useWatch({
    control: control,
    name: "lon",
  });

  const attachment = useWatch({
    control: control,
    name: "attachment",
  });

  // DEBOUNCE FOR SEARCHING ON CONSUMER DATA
  const [debounced] = useDebounce(accountNumber, 500);

  useEffect(() => {
    if (!debounced) {
      queueMicrotask(() => {
        setConsumer([]);
        resetField("lat");
        resetField("lon");
      });
      return;
    }

    if (debounced === selectedConsumer) {
      queueMicrotask(() => setConsumer([]));
      return;
    }

    const fetchConsumer = async () => {
      const res = await queryConsumer(debounced);
      if (res.status === 200) {
        setConsumer(res.data);
      }
    };
    fetchConsumer();
  }, [debounced, selectedConsumer, resetField]);
  // HANDLE SELECTED CONSUMER
  const selectConsumer = (account: string, geolocation: coordinates) => {
    setSelectedConsumer(account);
    setValue("accountNumber", account);
    setValue("lon", geolocation[0]);
    setValue("lat", geolocation[1]);

    setConsumer([]);
  };

  // DEFINE STYLES -------------------------------------------------------
  const errorStyle = "text-error text-[0.75rem] italic ";
  const labelStyle = "label text-xs font-bold";
  const inputStyle = "input input-sm w-full";
  const inputerrorStyle = " input-error w-full";
  const formStyle = "form p-4 flex flex-col gap-2";

  // Handle Submission ---------------------------------------------------
  const onSubmit: SubmitHandler<ComplaintFormData> = async (data) => {
    const formData = new FormData();
    formData.append("accountNumber", data.accountNumber);
    formData.append("issue", data.issue ? data.issue : "Illegal Connection");
    formData.append(
      "details",
      data.detail ? data.detail : "Illegal Connection",
    );
    formData.append("is_meter_complaint", true.toString());

    if (data.lon !== undefined && data.lat !== undefined) {
      formData.append("lon", data.lon.toString());
      formData.append("lat", data.lat.toString());
    }

    if (data.attachment?.[0]) {
      formData.append("attachment", data.attachment[0]);
    }
    const res = await PostComplaints(formData);
    switch (res?.status) {
      case 201:
        reset();
        break;
      case 403:
        setError("lat", { message: res.data });
        setError("lon", { message: res.data });
        break;
      case 404:
        setError("lat", { message: res.data });
        setError("lon", { message: res.data });
        break;
    }
  };
  console.log(isSubmitSuccessful);
  return (
    <>
      {isSubmitSuccessful ? (
        <div className="p-4 flex justify-center bg-base-200 shadow  text-success rounded">
          <h1 className="font-bold">
            Thank you! Your complaint has been submitted.
          </h1>
        </div>
      ) : (
        <form className={`overflow-y-auto max-h-[80vh] ${formStyle}`} onSubmit={handleSubmit(onSubmit)}>
          {/* ACCOUNT NUMBER */}
          <section className="flex flex-col dropdown dropdown-bottom">
            <label className={labelStyle}>Consumer Name</label>
            <input
              tabIndex={0}
              role="button"
              className={`${inputStyle}${errors.accountNumber ? inputerrorStyle : ""}`}
              type="text"
              {...register("accountNumber", {
                required: "Please Enter Account Number",
              })}
            />

            {consumer.length > 0 && (
              <ul
                tabIndex={-1}
                className="dropdown-content shadow-md drop-shadow-md p-2 bg-base-200 w-full cursor-pointer  overflow-y-scroll max-h-52"
              >
                {consumer.map((consumer) => (
                  <li
                    className="hover:bg-base-300 text-md"
                    key={consumer.account_no}
                    onClick={() => {
                      selectConsumer(
                        consumer.account_no,
                        consumer.geolocation.coordinates,
                      );
                    }}
                  >
                    {consumer.account_name}
                  </li>
                ))}
              </ul>
            )}
            {errors.accountNumber && (
              <p className={errorStyle}>{errors.accountNumber.message}</p>
            )}
          </section>

          {/* ISSUE */}

          {!isother && (
            <section>
              <select
                defaultValue=""
                {...register("issue", { required: "Please Select Issue" })}
                className="select select-sm w-full"
                title="Select Issues"
              >
                <option value="" disabled>
                  Select Issue
                </option>
                {choices?.map((choice) => (
                  <option key={choice}>{choice}</option>
                ))}
              </select>
              {errors.issue && (
                <p className={errorStyle}>{errors.issue.message}</p>
              )}
            </section>
          )}

          {/* DETAIL */}
          <section>
            <label className={labelStyle}>Detail</label>
            <textarea
              className={`textarea textarea-sm w-full ${errors.issue ? inputerrorStyle : ""}`}
              {...register("detail", { required: "Provide Detail" })}
            />
            {errors.detail && (
              <p className={errorStyle}>{errors.detail.message}</p>
            )}
          </section>

          {/* MAP  */}
          <section>
            <input
              type="hidden"
              {...register("lon", { required: "Please Select Location" })}
            />
            <input
              type="hidden"
              {...register("lat", { required: "Please Select Location" })}
            />
            <BiselcoMap
              consumermeters={lat && lon ? [lon, lat] : undefined}
              onSelectLocation={(lat, lon) => {
                setValue("lat", lat);
                setValue("lon", lon);
              }}
            />
            {errors.lat && <p className={errorStyle}>{errors.lat?.message}</p>}
          </section>

          {/* ATTACHMENT */}
          <section className="flex items-center flex-col">
            <label className={`self-start ${labelStyle}`}>Attachment</label>
            <input
              type="file"
              {...register("attachment", {
                required: "Please Upload Attachment",
              })}
              className={`file-input file-input-sm w-full ${errors.attachment ? inputerrorStyle : ""}`}
            />
            
            {errors.attachment && (
              <p className={`${errorStyle} self-start`}>{errors.attachment.message}</p>
            )}
            {attachment && 
            <div className="p-2">
              <ImageViewer image={attachment[0] ? URL.createObjectURL(attachment[0]) : ""} />
            </div>
            }
          </section>

          <button
            disabled={isSubmitting}
            className="btn btn-primary"
            type="submit"
          >
            {isSubmitting ? (
              <span className="skeletonskeleton-text">Submitting...</span>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </form>
      )}
    </>
  );
};

export default MeterComplaintsV1;
