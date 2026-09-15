"use client";

import React from "react";
import {
  LineDotRightHorizontal,
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

const PrimaryLinePopup = ({ primaryLinePopup }: Props) => {
  const labelClass = "label text-xs";
  const infoClass = "text-xs text-base-content text-center w-full font-semibold";
  const infoContainerClass = "flex items-center gap-2";
  const containerClass = "bg-base-200 p-6 rounded-box";
  return (
    <div className="bg-base-100 w-fit flex flex-col rounded-box overflow-hidden m-0 relative">
      <header className="flex items-center bg-base-200 p-5 gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LineDotRightHorizontal className="w-5 h-5" />
        </div>
        <div>
          <label className="label text-xs">
            PRIMARY LINE
          </label>
          <h1 className="text-xs text-base-content font-semibold truncate max-w-40">
            {primaryLinePopup?.primary_line_id}
          </h1>
        </div>

        <div className="self-start">
          {primaryLinePopup?.is_active ? (
            <div className="badge absolute right-2 top-2 badge-xs badge-outline badge-soft badge-success">
              <span>Active</span>
            </div>
          ) : (
            <CircleDot className="text-red-400 size-4 fill-red-400/20" />
          )}
        </div>
      </header>

      <main className="grid grid-cols-2 gap-3 p-4">
        {/* Village */}
        <section className={containerClass}>
          <label className={labelClass}>Village</label>
          <div className={infoContainerClass}>
            <p className={infoClass}>{primaryLinePopup.village} </p>
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
      </main>
    </div>
  );
};

export default PrimaryLinePopup;
