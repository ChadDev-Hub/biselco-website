"use client"

import BiselcoMap from "../../common/Map";
import Image from "next/image";
import { PostGenericComplaints } from "@/app/actions/complaint";
import { useForm, useWatch, SubmitHandler } from "react-hook-form";


// Define the type for form data
interface ComplaintFormData {
  issue: string;
  details: string;
  lon: number | undefined;
  lat: number | undefined;
  attachment?: File;
}

type Props = {
  title: string;
  choices?: string[];
  isother?: boolean
}

const toTitleCase = (text: string) =>
  text.replace(/\b\w/g, c => c.toUpperCase());


const GenericComplaints = ({ title, choices, isother }: Props) => {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isSubmitted }, setError, reset, control } = useForm<ComplaintFormData>()
  // Handle form input changes



  // WATCHED

  const attachment = useWatch({
    control: control,
    name: "attachment"
  })
  const lon = useWatch({
    control: control,
    name: "lon"
  });

  const lat = useWatch({
    control: control,
    name: "lat"
  });

  // handle Form Submission
  const onSubmit: SubmitHandler<ComplaintFormData> = async (formData) => {

    // Here you would normally send data to your API
    const data = new FormData();
    data.append("issue", formData.issue.trim() || "other");
    data.append("details", formData.details);
    data.append("lon", String(formData.lon));
    data.append("lat", String(formData.lat));
    if (formData.attachment) {
      data.append("attachment", formData.attachment[0]);
    }
    const res = await PostGenericComplaints(data);

    switch (res?.status) {
      case 201:
        reset();
        break;
      case 403:
        const newErrors: { [key: string]: string } = {};
        newErrors.geolocation = res.data;
        setError("lat", { message: res.data });
        setError("lon", { message: res.data });
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {isSubmitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          Thank you! Your complaint has been submitted.
        </div>
      ) :
        isSubmitting ? (
          <div className="w-full text-center">
            <h4 className="skeleton skeleton-text">
              Please wait...
              <span className="loading loading-infinity loading-xl text-primary" />
            </h4>
            <h5 className="skeleton skeleton-text">We are Verifying the Complaints Location...</h5>
          </div>)
          :
          (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">


              {/* Issue Type */}
              <div className={`relative overflow-visible ${isother ? "hidden" : ""}`} >
                <label className="block mb-1 font-medium">Issue</label>
                <select
                  {...register("issue", { required: isother ? false : "Please select an issue" })}
                  title="Select Issue"
                  className={`w-full px-3 py-2 border rounded ${errors.issue ? "border-red-500" : "border-gray-300"
                    } select `}
                >
                  <option value="" disabled={true}>Select Issue</option>
                  {choices?.map((choice) => (
                    <option key={choice} value={choice}>
                      {toTitleCase(choice)}
                    </option>
                  ))}

                </select>
                {errors.issue && <p className="text-red-500 text-sm">{errors.issue.message}</p>}
              </div>

              {/* Complaint Details */}
              <div>
                <label className="block mb-1 font-medium">Details</label>
                <textarea
                  {...register("details", { required: "Please describe your complaint" })}
                  placeholder="Describe your complaint"
                  className={`w-full px-3 py-2 border rounded ${errors.details ? "border-red-500" : "border-gray-300"
                    } textarea`}
                />
                {errors.details && <p className="text-red-500 text-sm">{errors.details.message}</p>}
              </div>

              {/* Map */}
              <div className="w-full">
                <label className="label w-full text-wrap font-bold text-black">
                  Please Pin The Location of Your Complaints
                </label>
                <input {...register("lon", { required: "Please select a location" })} type="hidden" />
                <input {...register("lat", { required: "Please select a location" })} type="hidden" />

                <BiselcoMap
                  animatePing
                  markerPopup="Report Location"
                  consumermeters={lon && lat ? [lon, lat] : undefined}
                  onSelectLocation={(lat, lon) => {
                    setValue("lon", lon);
                    setValue("lat", lat);
                  }}
                />
                {errors.lat && errors.lon && <p className="text-red-500 text-sm">{errors.lat.message}</p>}
              </div>
              {/* Image */}
              <div className="w-full flex flex-col gap-4">
                <input
                  capture="environment"
                  {...register("attachment")}
                  accept="image/*"
                  title="Complaints Image"
                  className="w-full file-input"
                  type="file"
                  placeholder="Upload Image" />
                {attachment && (
                  <Image
                    src={URL.createObjectURL(attachment?.[0])}
                    alt="Complaints Image"
                    width={200}
                    height={200}
                    sizes="(min-width: 1024px) 200px, 100vw"
                    className="w-auto h-auto"
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isSubmitting ? <span className="skeleton skeleton-text"> Submitting</span> : "Submit"}
              </button>
            </form>
          )}
    </div>
  );
};

export default GenericComplaints;