"use client"

import Image from "next/image"
import { use } from "react"

type PromiseType = {
    status?: number
    data: RegisteredType
}

type RegisteredType = {
    account_no: string;
    name: string;
    phone: string;
    image: string;
    signature: string;
    account_name: string;
    village: string;
    municipality: string;
    meter_no: string;
    meter_brand: string;
}

type Props = {
    registered: Promise<PromiseType>
}

const AgmaTicketCard = ({ registered }: Props) => {
    const { data } = use(registered)
    const year = new Date().getFullYear();
    return (
        <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xl">
            {/* Top Section: Header & Profile */}
            <div className="p-6 bg-primary/5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Official Ticket</p>
                        <h1 className="text-xl font-black text-slate-800">AGMA {year}</h1>
                    </div>
                    <div className="text-right">
                        <span className="px-2 py-1 text-xs font-mono font-bold bg-slate-800 text-white rounded">
                            #{data.account_no.slice(-6)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-white shadow-md">
                        <Image
                            fill
                            loading="eager"
                            src={data.image}
                            alt={data.name}
                            sizes="100%"
                            className="object-cover object-center w-auto h-auto"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold leading-tight text-slate-900">{data.name}</h2>
                        <p className="text-sm text-slate-500">{data.village}, {data.municipality}</p>
                    </div>
                </div>
            </div>

            {/* Perforation Line Effect */}
            <div className="relative flex items-center px-4">
                <div className="absolute -left-3 h-6 w-6 rounded-full bg-base-200 shadow-inner"></div>
                <div className="w-full border-t-2 border-dashed border-slate-200">
                    
                </div>
                <div className="absolute -right-3 h-6 w-6 rounded-full bg-base-200 shadow-inner"></div>
            </div>

            {/* Bottom Section: Details */}
            <div className="p-6 pt-4">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                    <div>
                        <p className="text-[10px] uppercase font-semibold text-slate-400">Account Number</p>
                        <p className="font-mono font-medium text-slate-800">{data.account_no}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-semibold text-slate-400">Meter Number</p>
                        <p className="font-mono font-medium text-slate-800">{data.meter_no} ({data.meter_brand})</p>
                    </div>
                </div>

                {/* Signature & Action */}
                <div className="mt-6 flex items-end justify-between">
                    <div className="w-32 border-b border-slate-300 pb-1">
                         <Image
                         loading="eager"
                            width={120}
                            height={40}
                            src={data.signature}
                            alt="Signature"
                            className="grayscale contrast-125 w-auto h-auto"
                        />
                        <p className="text-[9px] uppercase text-center text-slate-400 mt-1">Signature</p>
                    </div>
                </div>
            </div>

            {/* Bottom Decorative Bar */}
            <div className="h-2 bg-primary w-full"></div>
        </div>
    )
}

export default AgmaTicketCard;