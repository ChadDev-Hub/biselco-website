"use client";

import React from "react";
import {
  MapIcon,
  LineDotRightHorizontal,
  RulerDimensionLine,
  ChevronsLeftRightEllipsis,
  CircleDot,
} from "lucide-react";
type Props = {
  ref: React.RefObject<HTMLDivElement | null>;
  primaryLinePopup: PrimaryLineProperties;
};
type PrimaryLineProperties = {
  primary_line_id: string;
  village: string;
  municipality: string;
  color: string;
  is_active: boolean;
  length_meters: number;
  phasing: string;
};
const PrimaryLinePopup = ({ ref, primaryLinePopup }: Props) => {
  const labelClass = "label text-xs";
  const infoClass = "text-sm";
  const infoContainerClass = "flex items-center gap-2";
  return (
    <div className="bg-base-100 w-fit  flex-col shadow rounded-box" ref={ref}>
      <header className="flex gap-2  rounded-t-box w-full bg-blue-700">
        <div className="m-4 w-full items-center gap-2 flex">
          <LineDotRightHorizontal className="w-6 h-6 text-white" />
          <h1 className="text-lg  text-white font-semibold">
            {primaryLinePopup?.primary_line_id}
          </h1>
        </div>

        <div
          className={` w-full flex justify-end  p-2  }`}
        >
          {primaryLinePopup?.is_active ? <CircleDot className="text-green-500 size-3.5"/> : <CircleDot className="text-red-500"/>}
        </div>
      </header>
      <main className="p-4">
        <section>
          <label className={labelClass}>Phasing:</label>
          <label className={infoContainerClass}>
            <ChevronsLeftRightEllipsis className="w-6 h-6 " />
            <p className={infoClass}>{primaryLinePopup.phasing}</p>
          </label>
        </section>
        {/* Length In Meters */}
        <section>
          <label className={labelClass}>Length (m):</label>
          <label className={infoContainerClass}>
            <RulerDimensionLine className="w-6 h-6 " />
            <p className={infoClass}>{primaryLinePopup.length_meters}</p>
          </label>
        </section>
        {/* Location */}
        <section className="items-center ">
          <label className={labelClass}>Location:</label>
          <label htmlFor="" className={infoContainerClass}>
            <MapIcon className="w-6 h-6 " />
            <p className={infoClass}>{primaryLinePopup.village}</p>
            <p className={infoClass}>|</p>
            <p className={infoClass}>{primaryLinePopup.municipality}</p>
          </label>
        </section>
      </main>
    </div>
  );
};

export default PrimaryLinePopup;
