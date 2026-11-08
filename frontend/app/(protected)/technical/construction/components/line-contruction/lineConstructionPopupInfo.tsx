
"use client";
import React from 'react'
import {LineConstruction} from '@/types/construction/line-construction';
import Image from 'next/image';
type Props = {
    data: LineConstruction
}

const ConstructionLinePopupInfo = ({data}: Props) => {
    
  return (
    <div className="card w-80 h-full overflow-hidden rounded-2xl border border-base-300/60 bg-base-100 shadow-sm transition-shadow hover:shadow-lg">

    {/* Image */}
    <figure className="relative h-48 w-full">
        <a href={data.image} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
            <Image
                src={data.image}
                alt={data.line_type}
                fill
                sizes="320px"
                className="object-cover transition-transform duration-300 hover:scale-105"
            />
        </a>
    </figure>

    {/* Content */}
    <div className="card-body gap-3 p-4">

        <div>
            <h2 className="text-lg font-semibold tracking-tight">
                {data.line_type}
            </h2>
            <p className="text-sm text-base-content/60">
                {data.village}, {data.municipality}
            </p>
        </div>

        <div className="divider my-0" />

        <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">

            {[
                ["Phasing", data.phasing],
                ["Pole Assembly", data.pole_assembly],
                ["Conductor", data.conductor_wire],
                ["Neutral Wire", data.neutral_wire],
                ["Date", data.date],
            ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                    <p className="text-xs text-base-content/50">{label}</p>
                    <p className="truncate font-medium">{value || "—"}</p>
                </div>
            ))}

        </div>

        {/* Progress */}
        <div className="mt-2">
            <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-base-content/60">Completion</span>
                <span className="font-semibold">{data.pct_acc ?? 0}%</span>
            </div>

            <progress
                className="progress progress-primary w-full"
                value={data.pct_acc ?? 0}
                max={100}
            />
        </div>

    </div>
</div>
  )
}

export default ConstructionLinePopupInfo