"use client"
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import BiselcoMap from "./Map";

type PromiseType = {
  status: number
  data: ConsumerData[]
} | undefined

type Props = {
  data: Promise<PromiseType>
}

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
type coordinates = [number, number] | undefined

// Define the type for form data
interface ComplaintFormData {
  accountNumber: string;
  issue: string;
  details: string;
  geolocation: coordinates | undefined;
}

const MeterComplaints = ({ data }: Props) => {
  const consumerData = use(data)
  const [selectedConsumer, setSelectedConsumer] = useState<ConsumerData[] | []>([]);
  const [formData, setFormData] = useState<ComplaintFormData>({
    accountNumber: "",
    issue: "",
    details: "",
    geolocation: undefined
  });
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deBounceAccountNumber] = useDebounce(formData.accountNumber, 500);



  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "accountNumber") {
      if (value === "") {
        setFormData({ ...formData, [name]: value, ['geolocation']: undefined })
        setSelectedConsumer([]);
        return;
      }
      setSelectedConsumer(consumerData?.data ?? []);
    }
  };

  // handle Consumer Selection
  const handleConsumerSelect = (accountNumber: string, coords: coordinates) => {
    setFormData({ ...formData, accountNumber: accountNumber, geolocation: coords });
    setSelectedConsumer([]);
  }

  useEffect(() => {
    if (deBounceAccountNumber) {
      router.replace(`/complaints?consumer=${deBounceAccountNumber}`);
    } else {
      router.replace(`/complaints`);
    };
  }, [deBounceAccountNumber, router]);

  // Simple validation
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.accountNumber) {
      newErrors.accountNumber = "Account number is required.";
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be numeric.";
    }

    if (!formData.issue) {
      newErrors.issue = "Please select an issue type.";
    }

    if (!formData.details) {
      newErrors.details = "Please provide complaint details.";
    }

    if (!formData.geolocation) {
      newErrors.geolocation = "Please select a location.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Here you would normally send data to your API
    console.log("Submitted Complaint:", formData);
    setSubmitted(true);
  };

  return (
    <div className="w-full h-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Submit a Meter Complaint</h2>
      {submitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          Thank you! Your complaint has been submitted.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Consumer Meter Account Number */}
          <div className="relative">
            <label className="block mb-1 font-medium">Consumer Meter Account No</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Search your meter account here..."
              className={`w-full px-3 py-2 border rounded ${errors.accountNumber ? "border-red-500" : "border-gray-300"
                } dropdown dropdown-center dropdown-bottom input input-primary`}
            />
            {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
            {selectedConsumer && selectedConsumer.length > 0 ? (
              <ul className="dropdown-content shadow-md z-10 grid top-16 bg-base-100 w-full grid-cols-1 menu absolute rounded-box drop-shadow-md max-h-50 overflow-y-scroll">
                {consumerData?.data.map((consumer) => (
                  <li
                    key={consumer.account_no}
                    onClick={() => handleConsumerSelect(consumer.account_no, consumer.geolocation.coordinates)}
                  ><a>
                      {consumer.account_no + " | " + consumer.account_name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>


          {/* Issue Type */}
          <div>
            <label className="block mb-1 font-medium">Issue</label>
            <select
              enterKeyHint="next"
              title="Select Issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${errors.issue ? "border-red-500" : "border-gray-300"
                } input`}
            >
              <option value="">Select issue</option>
              <option value="billing">Billing</option>
              <option value="meter">Meter Issue</option>
              <option value="service">Service Disruption</option>
              <option value="other">Other</option>
            </select>
            {errors.issue && <p className="text-red-500 text-sm">{errors.issue}</p>}
          </div>

          {/* Complaint Details */}
          <div>
            <label className="block mb-1 font-medium">Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Describe your complaint"
              className={`w-full px-3 py-2 border rounded ${errors.details ? "border-red-500" : "border-gray-300"
                } textarea`}
            />
            {errors.details && <p className="text-red-500 text-sm">{errors.details}</p>}
          </div>
          {/* Map */}
          {formData.geolocation &&
            <div className="w-full">
              <label className="label w-full text-wrap font-bold text-black">
                Check if the Meter location of Complaints is Correct if not please pin the location on the Map
              </label>
              <BiselcoMap
                animatePing
                markerPopup="Electric Meter Location"
                consumermeters={formData.geolocation
                  ? formData.geolocation
                  : undefined}
              />
              {errors.geolocation && <p className="text-red-500 text-sm">{errors.geolocation}</p>}
            </div>}

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