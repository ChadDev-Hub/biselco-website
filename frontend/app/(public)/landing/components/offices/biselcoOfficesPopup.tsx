"use client";
import Link from "next/link";

type Props = {
  properties: properties;
};
type properties = {
  label: string;
  address: string;
  google_link: string;
};
const BiselcoOfficesPopup = ({
  properties: { label, address, google_link },
}: Props) => {
  return (
    <div className="w-full rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <header className="bg-blue-600 px-3 py-2 text-wrap">
        <h1 className="text-sm font-semibold text-white ">{label}</h1>
      </header>

      {/* Body */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-gray-600 leading-snug">📍 {address}</p>

        <div className="pt-2">
          <Link
            href={google_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            View on Google Maps 🗺️
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BiselcoOfficesPopup;
