
import React from 'react'
import Image from 'next/image'
type Props = {
    data: data
}

type data = {
    account_no: string;
    account_name: string;
    year: string;
    image: string;
    name: string;
    village: string;
    municipality: string;
    phone: string;
    meter_no: string;
    meter_brand: string;
    date_registered: string;
    time_registered: string;
    signature: string


}

const AgmaTicketCard = ({data}: Props) => {
  return (
    <div
      id="agma-ticket"
      className="relative w-full max-w-md mx-auto overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xl"
    >
      <div className="h-2 absolute top-0 bg-yellow-500 w-full"></div>
      {/* Top Section: Header & Profile */}
      <div className="p-6 bg-primary/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Official Ticket
            </p>
            <h1 className="text-xl font-black text-slate-800">
              BISELCO AGMA {data.year}
            </h1>
          </div>
          <div className="text-right">
            <span className="px-2 py-1 text-xs font-mono font-bold bg-slate-800 text-white rounded">
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
        <div className="h-30 flex items-end w-full">
         
          {/* Signature & Action */}
          <div className="pt-6 flex justify-between items-end ">
            <div className="w-32 border-b  border-slate-300  pb-1">
              <Image
                loading="eager"
                width={120}
                height={40}
                src={data.signature}
                alt="Signature"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover contrast-200 w-auto h-auto"
              />
              <p className="text-[9px] uppercase text-center text-slate-400 mt-1">
                Signature
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Bar */}
      <div className="h-2 bg-primary w-full absolute bottom-0"></div>
    </div>
  )
}

export default AgmaTicketCard