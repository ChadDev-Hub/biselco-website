"use client";

import Image from "next/image";
import { TicketInfoType } from "../../../../types/agma";
import ImageViewer from "@/app/(protected)/technical/change-meter/components/imageViewr";
import { useAuth } from "@/app/utils/authProvider";
import { usePathname } from "next/navigation";
import VerificationButton from './verification-btn';

type Props = {
  data: TicketInfoType;
};

const AgmaTicketCard = ({ data }: Props) => {
  const { user } = useAuth();
  const currentPath = usePathname();
  return (
    <div
      id="agma-ticket"
      className="relative  w-full max-w-md  mx-auto overflow-hidden bg-white border-slate-200 rounded-2xl shadow-md"
    >
      <div className="h-2 absolute top-0 bg-yellow-500 w-full"></div>
      {/* Top Section: Header & Profile */}
      <div className="p-6 bg-primary/5">
        <div className="flex gap-3 justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Official Ticket
            </p>
            <h1 className="text-xl font-black text-slate-800">
              BISELCO AGMA {data.year}
            </h1>
          </div>
          <div className="text-right flex flex-col gap-2">
            {
            currentPath === "/agma-dashboard" &&
            user?.roles.map((role) => role.name).includes("admin") && <VerificationButton verification={{id: data.id, is_verified: data.is_verified}} />}
            <span className="px-2 py-1 text-xs self-end w-fit font-mono font-bold bg-slate-800 text-white rounded">
              #{data.account_no}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-white shadow-md">
            <Image
              src={data.image}
              fill
              className="object-cover"
              alt={data.name}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-tight text-slate-900">
              {data.name}
            </h2>
            <p className="text-sm text-slate-500">
              {data.village}, {data.municipality}
            </p>
            <p className="text-xs text-slate-500">{data.phone}</p>
          </div>
        </div>
      </div>

      {/* Perforation Line Effect */}
      <div className="relative flex items-center px-4">
        <div className="absolute -left-3 h-6 w-6 rounded-full bg-base-200 shadow-inner"></div>
        <div className="w-full border-t-2 border-dashed border-slate-200"></div>
        <div className="absolute -right-3 h-6 w-6 rounded-full bg-base-200 shadow-inner"></div>
      </div>

      {/* Bottom Section: Details */}
      <div className="p-6 pt-4 flex flex-col  h-full">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">
              Account Number
            </p>
            <p className="font-mono font-medium text-slate-800">
              {data.account_no}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">
              Meter Number
            </p>
            <p className="font-mono font-medium text-slate-800">
              <span>{data.meter_no} </span>
              <br />
              <span>{data.meter_brand}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">
              Account Name
            </p>
            <p className="font-mono font-medium text-slate-800">
              {data.account_name}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">
              Date Registered
            </p>
            <p className="font-mono font-medium text-slate-800">
              <span>{data.date_registered}</span>
              <br />
              <span>{data.time_registered}</span>
            </p>
          </div>
        </div>
        <div className="h-30 flex gap-2 items-end w-full">
          {/* Signature & Action */}

          <div className="w-32 h-32 items-end flex justify-center   border-b relative  border-slate-300  pb-1">
            <Image
              loading="eager"
              fill
              src={data.signature}
              alt="Signature"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
            <p className="text-[9px]  uppercase text-center text-slate-400 mt-1">
              Signature
            </p>
          </div>

          {currentPath == "/agma-dashboard" &&
            user?.roles.map((role) => role.name).includes("admin") && (
              <div className=" items-center flex flex-col justify-center  border-b relative  border-slate-300  pb-1">
                <div>
                  <ImageViewer className={`${data.sample_bill ? "border border-dashed": "border-none"}`} image={data.sample_bill ?? null} />
                </div>

                <p className="text-[9px]  uppercase text-center text-slate-400 mt-1">
                  Sample Bill
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Bottom Decorative Bar */}
      <div className="h-2 bg-primary w-full absolute bottom-0"></div>
    </div>
  );
};

export default AgmaTicketCard;
