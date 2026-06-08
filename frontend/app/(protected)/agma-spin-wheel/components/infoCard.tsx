"use client";

import React from "react";
import { WinnerInfoType } from "../../../../types/agma";
import { useRouter } from "next/navigation";

import Image from "next/image";
type Props = {
  data: WinnerInfoType;
};

const InfoCard = ({ data }: Props) => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2   my-3">
      <div className=" self-center text-sm ">
        <p className="font-semibold">{data.name}</p>
        <p>
          {data.village} | {data.municipality}
        </p>
      </div>
      <div className="flex flex-col items-center relative">
        <div className="w-10 h-4 bg-linear-to-r from-gray-500 via-gray-300 to-gray-500 rounded-t-md shadow-md flex flex-col items-center justify-between py-px -mt-0.5 z-10">
          <div className="w-2 h-1 bg-gray-800 rounded-b-full"></div>
          <div className="w-6 h-px bg-gray-600"></div>
          <div className="w-4 h-px bg-gray-600"></div>
          {/* Contact point */}
        </div>
        <div
          onClick={() => router.refresh()}
          className="
          relative w-24 h-24 rounded-full cursor-pointer overflow-hidden
          border-2 border-amber-400 border-dashed
          bg-amber-50/5
          shadow-[0_0_15px_rgba(245,158,11,0.3)]
          transition-all duration-300 ease-in-out
          hover:border-amber-300 
          hover:border-solid 
          hover:scale-105
          hover:shadow-[0_0_30px_rgba(245,158,11,0.8),inset_0_0_15px_rgba(245,158,11,0.5)]
          active:scale-95 active:brightness-125
        "
        >
          <Image
            onClick={() => router.refresh()}
            loading="eager"
            src={data.image}
            alt={"Winner Profile"}
            fill
            sizes="100%"
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
