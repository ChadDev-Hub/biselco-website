"use client"
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import BiselcoMap from "../../common/Map";
import Image from "next/image";
import { PostComplaints } from "@/app/actions/complaint";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { queryConsumer } from "@/lib/serverFetch";



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
  }
}
type coordinates = [number | undefined, number | undefined];
// Define the type for form data
interface ComplaintFormData {
  accountNumber: string;
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

const MeterComplaints = ({title, choices, isother}: Props) => {

  // DEFINE STATE VARIABLES
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [consumer, setConsumer] = useState<ConsumerData[]>([]);
  const [selectedConsumer, setSelectedConsumer] = useState<string>("");
  // CREATE FORM HOOK
  const { register, control, handleSubmit, setValue, setError, formState: { errors } } = useForm<ComplaintFormData>()

  // DEFINE EFFECT FUNCTIONS


  // WATCH ATTACHNMENT
  const attachment = useWatch({
    control: control,
    name: "attachment"
  })


  // WATCH LATITUDE AND LONGITUDE
  const lat = useWatch({
    control: control,
    name: "lat"

  })
  const lon = useWatch({
    control: control,
    name: "lon"
  })


  // WATCH ACCOUNT NUMBER INPUT
  const consumerSearch = useWatch({
    control: control,
    name: "accountNumber",
    defaultValue: ""
  })

  // DEBOUNCE CONSUMER QUERY
  const [debounceSearch] = useDebounce(consumerSearch, 500);

  // ROUTER


  // CHANGE ROUTER WHEN CONSUMER QUERY CHANGES
  useEffect(() => {
  if (!debounceSearch) {
    queueMicrotask(() => {
      setConsumer([]);
    })
    return;
  }

  if (debounceSearch === selectedConsumer) {
    queueMicrotask(() => {
      setConsumer([]);
    })
    return;
  }
  const fetchConsumer = async () => {
    const res = await queryConsumer(debounceSearch);
    if (res.status === 200) {
      setConsumer(res.data);
    }
  };
  fetchConsumer();
}, [debounceSearch, selectedConsumer]);

  useEffect(() => {
    if (consumerSearch === "") {
      const showMap = () => {
        setShowMap(false)
        setValue("lon", undefined);
        setValue("lat", undefined);
      };
      showMap();
    }
  }, [consumerSearch, setValue]);


  // HANDLE SELECTED CONSUMER
  const selectConsumer = (account: string, geolocation: coordinates) => {
    setSelectedConsumer(account);
    setValue("accountNumber", account);
    setValue("lon", geolocation[0]);
    setValue("lat", geolocation[1]);
    setShowMap(true);
    setConsumer([]);
  }

  // 
  useEffect(() => {
    if (errors.lat || errors.lon) {
      const showMap = () => {
        setShowMap(true);
      };
      showMap();
    }
  }, [errors.lat, errors.lon]);


  // HANDLE SUBMIT
  const [submitted, setSubmitted] = useState(false);
  const onSubmit: SubmitHandler<ComplaintFormData> = (data) => {
    setLoading(true);
    const newDATA = new FormData();
    newDATA.append("accountNumber", data.accountNumber);
    newDATA.append("issue",(data.issue ? data.issue : "Illegal Connection"));
    newDATA.append("details", data.details);
    newDATA.append("lon", data.lon?.toString() ?? "");
    newDATA.append("lat", data.lat?.toString() ?? "");
    if (data.attachment?.[0]) {
      newDATA.append("attachment", data.attachment[0]);
    }

    PostComplaints(newDATA).then((res) => {
      switch (res?.status) {
        case 201:
          setSubmitted(true);
          setLoading(false);

          break;
        case 403:
          setError("lat", { message: res.data });
          setError("lon", { message: res.data });
          setLoading(false);
          break;
        default:
          break;
      }
    });
  }
  return (
    <div className="w-full h-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {submitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          Thank you! Your complaint has been submitted.
        </div>
      ) : loading ?
        (<div className="w-full text-center">
          <h4>
            Please wait... <span className="loading loading-infinity loading-xl text-primary"/>
          </h4>
          <h5>
            We are Verifying the Complaints Location...
          </h5>
        </div>)
        :
        (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Consumer Meter Account Number */}
            <div className="relative">
              <label className="block mb-1 font-medium">Consumer Meter Account No</label>
              <input
                type="text"
                {...register("accountNumber", { required: true })}
                placeholder="Search your meter account here..."
                className={`w-full px-3 py-2 border rounded ${errors.accountNumber ? "border-red-500" : "border-gray-300"
                  } dropdown dropdown-center dropdown-bottom input input-primary`}
              />
              {errors.accountNumber && <p className="text-red-500 text-sm">Account Number Must Provided</p>}
              {consumer?.length > 0 ? (
                <ul className="dropdown-content shadow-md z-10 grid top-16 bg-base-100 w-full grid-cols-1 menu absolute rounded-box drop-shadow-md max-h-50 overflow-y-scroll">
                  {consumer?.map((consumer: ConsumerData) => (
                    <li
                      key={consumer.account_no}
                      onClick={() => selectConsumer(consumer.account_no, consumer.geolocation.coordinates)}
                    ><a>
                        {consumer.account_no + " | " + consumer.account_name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {/* Issue Type */}
            {!isother &&<div className="relative overflow-visible">
              <label className="block mb-1 font-medium">Issue</label>
              <select
                enterKeyHint="next"
                title="Select Issue"
                {...register("issue", { required: true })}
                className={`w-full px-3 py-2 border rounded ${errors.issue ? "border-red-500" : "border-gray-300"
                  } select `}
              >
                <option value="" disabled={true}>Select Issue</option>
                {choices?.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
              {errors.issue && <p className="text-red-500 text-sm">Please Select an Issue</p>}
            </div>}

            {/* Complaint Details */}
            <div>
              <label className="block mb-1 font-medium">Details</label>
              <textarea
                {...register("details", { required: true })}
                placeholder="Describe your complaint"
                className={`w-full px-3 py-2 border rounded ${errors.details ? "border-red-500" : "border-gray-300"
                  } textarea`}
              />
              {errors.details && <p className="text-red-500 text-sm">Details Must Provided</p>}
            </div>

            {/* Map */}
            <input type="hidden" {...register("lat", { required: "Please Pin Your Meter Location on the Map" })} />
            <input type="hidden" {...register("lon", { required: "Please Pin Your Meter Location on the Map" })} />
            {showMap &&
              <div className="w-full">
                <label className="label w-full text-wrap font-bold text-black">
                  Check if the Meter location of Complaints is Correct if not please pin the location on the Map
                </label>
                <BiselcoMap
                  animatePing
                  markerPopup="Electric Meter Location"
                  consumermeters={lon && lat ? [lon, lat] : undefined}
                  onSelectLocation={(lat, lon) => {
                    setValue("lon", lon);
                    setValue("lat", lat);
                  }}
                />
                {errors.lon && errors.lat && <p className="text-red-500 text-sm">{errors.lon.message}</p>}
              </div>}
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
              {attachment?.[0] && (
                <Image
                  src={URL.createObjectURL(attachment[0])}
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
              Submit Complaint
            </button>
          </form>
        )}
    </div>
  );
};

export default MeterComplaints;