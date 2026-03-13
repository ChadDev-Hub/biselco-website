"use client"

import React, {  useState } from "react";
import BiselcoMap from "./Map";
import Image from "next/image";
import { PostGenericComplaints } from "@/app/actions/complaint";
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
  choices: string[];
}

const toTitleCase = (text: string) =>
  text.replace(/\b\w/g, c => c.toUpperCase());

const GenericComplaints = ({ title,choices }: Props) => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    issue: "",
    details: "",
    lon: undefined,
    lat: undefined,
    attachment: undefined
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && name === "attachment") {
      const file = e.target.files?.[0];
      setFormData({ ...formData, [name]: file });
      
    } else {
      setFormData({ ...formData, [name]: value });
    };
  };

  // SIMPLE VALIDATION
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.issue) {
      newErrors.issue = "Please select an issue type.";
    }

    if (!formData.details) {
      newErrors.details = "Please provide complaint details.";
    }

    if (!formData.lon || !formData.lat) {
      newErrors.geolocation = "Please select a location.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle Form Submission
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    

  // Here you would normally send data to your API
    const data = new FormData(e.currentTarget as HTMLFormElement);
    data.set("lon", formData.lon?.toString() ?? "");
    data.set("lat", formData.lat?.toString() ?? "");
    
    
    const res = await PostGenericComplaints(data);
    switch (res?.status) {
      case 201:
        setSubmitted(true);
        break;
      case 403:
        const newErrors: { [key: string]: string } = {};
        newErrors.geolocation = res.data;
        setErrors(newErrors);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {submitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          Thank you! Your complaint has been submitted.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            

          {/* Issue Type */}
          <div className="relative overflow-visible">
            <label className="block mb-1 font-medium">Issue</label>
            <select
              enterKeyHint="next"
              title="Select Issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${errors.issue ? "border-red-500" : "border-gray-300"
                } select `}
            >
              <option value=""  disabled={true}>Select Issue</option>
              {choices.map((choice) => (
                <option key={choice} value={choice}>
                  {toTitleCase(choice)}
                </option>
              ))}
              
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
            <div className="w-full">
              <label className="label w-full text-wrap font-bold text-black">
                Please Pin The Location of Your Complaints
              </label>
              <BiselcoMap
                animatePing
                markerPopup="Complaint Location"
                consumermeters={formData.lon && formData.lat ? [formData.lon, formData.lat] : undefined}
                onSelectLocation={(lat, lon)=>{
                  setFormData(prev => ({...prev, lat, lon}))
                }}
              />
              {errors.geolocation && <p className="text-red-500 text-sm">{errors.geolocation}</p>}
            </div>
          {/* Image */}
          <div className="w-full flex flex-col gap-4">
            <input
             capture="environment" 
             name="attachment" 
             onChange={handleChange} 
             accept="image/*" 
             title="Complaints Image" 
             className="w-full file-input" 
             type="file"
             placeholder="Upload Image" />   
              {formData.attachment && (
                <Image
                  src={URL.createObjectURL(formData.attachment)}
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

export default GenericComplaints;