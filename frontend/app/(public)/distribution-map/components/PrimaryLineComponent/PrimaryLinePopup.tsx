"use client";

import type {PrimaryLineProperties} from "@/types/primary-line";
import {
  LineDotRightHorizontal,
  CircleDot,
} from "lucide-react";


type Props = {
  primaryLinePopup: PrimaryLineProperties;
};

const PrimaryLinePopup = ({ primaryLinePopup }: Props) => {
  
  const labelClass = "label text-xs";
  const infoClass = "text-xs text-nowrap text-base-content text-center  font-semibold";
  const infoContainerClass = " items-center  w-full gap-2";
  const containerClass = "bg-base-200 rounded-box p-4 w-full  ";
  return (
    <div className="w-80 gap-3   rounded-2xl ">
      <div className="flex w-full items-center justify-between border-b border-base-300 bg-base-200 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center bg-emerald-500/10 rounded-xl text-emerald-500">
          <LineDotRightHorizontal className="w-5 h-5" />
        </div>
        <div>
          <label className="label text-xs">
            PRIMARY LINE
          </label>
          <h1 className="text-xs  font-semibold truncate max-w-40">
            {primaryLinePopup?.primary_line_id}
          </h1>
        </div>

        <div className="self-start">
          {primaryLinePopup?.is_active ? (
            <div className="badge right-2 top-2 badge-xs badge-outline badge-soft badge-success">
              <span>Active</span>
            </div>
          ) : (
            <CircleDot className="text-red-400 size-4 fill-red-400/20" />
          )}
        </div>
      </div>

      <div className=" grid grid-cols-2 gap-3 p-4 w-full">
        {/* Village */}
        <section className={containerClass}>
          <label className={labelClass}>Village</label>
          <div className={infoContainerClass}>
            <p className={infoClass}>{primaryLinePopup.village}</p>
          </div>
        </section>
        {/* MUNICIPALITY */}
        <section className={containerClass}>
          <label className={labelClass}>Municipality</label>
          <div className={infoContainerClass}>
            <p className={infoClass}>{primaryLinePopup.municipality}</p>
          </div>
        </section>

        {/* Phasing */}
        <section className={containerClass}>
          <label className={labelClass}>Phasing</label>
          <div className={infoContainerClass}>
            <p className={infoClass}>{primaryLinePopup.phasing}</p>
          </div>
        </section>

        {/* Length In Meters */}
        <section className={containerClass}>
          <label className={labelClass}>Length (m)</label>
          <div className={infoContainerClass}>
            <p className={infoClass}>
              {primaryLinePopup.length_meters.toLocaleString()} m
            </p>
          </div>
        </section>

        {/* Conductor */}
        <section className={`${containerClass} col-span-2`}>
          <label className={labelClass}>Conductors</label>
          <div className={infoContainerClass}>
            <p className={infoClass}>
              {primaryLinePopup.conductor_wire}
            </p>
          </div>
        </section>

        {/* Neutral */}
        <section className={`${containerClass} col-span-2`}>
          <label className={labelClass}>Neutral</label>
          <div className={infoContainerClass}>
            <p className={infoClass}>
              {primaryLinePopup.neutral_wire}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrimaryLinePopup;
