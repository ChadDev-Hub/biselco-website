"use client"
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";



// Define the type for form data
interface ComplaintFormData {
  accountNumber: string;
  issue: string;
  details: string;
}

const MeterComplaints: React.FC = () => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    accountNumber: "",
    issue: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "accountNumber") {
        
    }
    setFormData({ ...formData, [name]: value });
  };

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
          <div>
            <label className="block mb-1 font-medium">Consumer Meter Account No</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              className={`w-full px-3 py-2 border rounded ${
                errors.accountNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
          </div>

          {/* Issue Type */}
          <div>
            <label className="block mb-1 font-medium">Issue</label>
            <select
              title="Select Issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.issue ? "border-red-500" : "border-gray-300"
              }`}
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
              className={`w-full px-3 py-2 border rounded ${
                errors.details ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.details && <p className="text-red-500 text-sm">{errors.details}</p>}
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