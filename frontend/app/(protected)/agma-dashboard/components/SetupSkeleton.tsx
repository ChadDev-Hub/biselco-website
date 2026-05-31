import React from "react";

const SetupSkeleton = () => {
  const eventTitleClassName = "skeleton h-7 w-40 bg-slate-200";
  const eventDescriptionClassName = "skeleton h-8 w-120 bg-slate-200";
  const labelClassName = "skeleton h-5 w-20 bg-slate-200";
  const inputClassName = "skeleton h-8 w-full bg-slate-200";
  const inputContainerClassName = "space-y-2"
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 my-4">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <div className="space-y-2">
          <div className="skeleton h-6 w-32 bg-slate-200"></div>
          <div className="skeleton h-4 w-100 bg-slate-200"></div>
        </div>

        {/* Status Badge Toggle */}
        <div className="skeleton w-20 h-4 badge bg-slate-200 rounded-full flex items-center justify-center"></div>
      </div>

      {/* Grid Configuration Fields */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name - Full Width */}
          <div className="md:col-span-2 space-y-2">
            <div className={eventTitleClassName}></div>
            <div className={eventDescriptionClassName}></div>
          </div>

          {/* Start Date */}
          <div className={inputContainerClassName}>
            <div className={labelClassName}></div>
            <div className={inputClassName}></div>
          </div>

          {/* End Date */}
          <div className={inputContainerClassName}>
            <div className={labelClassName}></div>
            <div className={inputClassName}></div>
          </div>

          {/* Registration Opening Time */}
          <div className={inputContainerClassName}>
            <div className={labelClassName}></div>
            <div className={inputClassName}></div>
          </div>

          {/* Assembly Formal Call Time */}
          <div className={inputContainerClassName}>
            <div className={labelClassName}></div>
            <div className={inputClassName}></div>
          </div>
        </div>

        <div className="mt-8 w-full pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className=" skeleton h-8 w-32 bg-slate-200"></div>
        </div>
      </div>

      {/* Footer Audit Tracking */}
    </div>
  );
};

export default SetupSkeleton;
