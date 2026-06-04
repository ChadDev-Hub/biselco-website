"use client";

import React from "react";
import {
  MapIcon,
  LineDotRightHorizontal,
  RulerDimensionLine,
  ChevronsLeftRightEllipsis,
  CircleDot,
} from "lucide-react";

export type PrimaryLineProperties = {
  primary_line_id: string;
  village: string;
  municipality: string;
  color: string;
  is_active: boolean;
  length_meters: number;
  phasing: string;
};

type Props = {
  primaryLinePopup: PrimaryLineProperties;
};

const PrimaryLinePopup = ({  primaryLinePopup }: Props) => {
  const labelClass = "label text-xs font-semibold text-gray-500 block mt-2";
  const infoClass = "text-sm text-base-content";
  const infoContainerClass = "flex items-center gap-2 mt-0.5";

  return (
    
    <div className="bg-base-100 w-64  flex flex-col rounded-box overflow-hidden" >
      <header className="flex justify-between items-center bg-blue-700 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <LineDotRightHorizontal className="w-5 h-5 text-white" />
          <h1 className="text-md text-white font-semibold truncate max-w-40">
            {primaryLinePopup?.primary_line_id}
          </h1>
        </div>

        <div>
          {primaryLinePopup?.is_active ? (
            <CircleDot className="text-green-400 size-4 fill-green-400/20" />
          ) : (
            <CircleDot className="text-red-400 size-4 fill-red-400/20" />
          )}
        </div>
      </header>

      <main className="p-4 bg-base-100 flex flex-col gap-1 text-left">
        {/* Phasing */}
        <section>
          <label className={labelClass}>Phasing:</label>
          <div className={infoContainerClass}>
            <ChevronsLeftRightEllipsis className="w-4 h-4 opacity-70" />
            <p className={infoClass}>{primaryLinePopup.phasing}</p>
          </div>
        </section>

        {/* Length In Meters */}
        <section>
          <label className={labelClass}>Length (m):</label>
          <div className={infoContainerClass}>
            <RulerDimensionLine className="w-4 h-4 opacity-70" />
            <p className={infoClass}>{primaryLinePopup.length_meters.toLocaleString()} m</p>
          </div>
        </section>

        {/* Location */}
        <section>
          <label className={labelClass}>Location:</label>
          <div className={infoContainerClass}>
            <MapIcon className="w-4 h-4 opacity-70" />
            <p className={infoClass}>
              {primaryLinePopup.village} <span className="text-gray-400">|</span> {primaryLinePopup.municipality}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrimaryLinePopup;