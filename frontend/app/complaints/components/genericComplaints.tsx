"use client";


import { useForm, SubmitHandler, useWatch } from "react-hook-form";

import BiselcoMap from "@/app/common/Map";
import { PostComplaints } from "@/app/actions/complaint";
import ImageViewer from "../../(protected)/technical/change-meter/components/imageViewr";


// Define the type for form data
type ComplaintFormData = {
 
  issue: string | null;
  detail: string | null;
  lon?: number;
  lat?: number;
  attachment?: File;
};

type Props = {
  choices?: string[];
  isother?: boolean;
};

const GenericComplaintV1 = ({ choices, isother }: Props) => {
  // DEFINE STATE VARIABLES------------------------------------------------------
  // CREATE FORM HOOK
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    reset,
    control,
  } = useForm<ComplaintFormData>({});

  // WATCH INPUTS ---------------------------------------------------------------

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

  

  // DEFINE STYLES -------------------------------------------------------
  const errorStyle = "text-error text-[0.75rem] italic ";
  const labelStyle = "label text-xs font-bold";
  const inputerrorStyle = " input-error w-full";
  const formStyle = "form p-4 flex flex-col gap-2";

  // Handle Submission ---------------------------------------------------
  const onSubmit: SubmitHandler<ComplaintFormData> = async (data) => {
    const formData = new FormData();
    formData.append("issue", data.issue ? data.issue : "Other");
    formData.append(
      "details",
      data.detail ? data.detail : "Illegal Connection",
    );
    formData.append("is_meter_complaint", false.toString());

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

export default GenericComplaintV1;
