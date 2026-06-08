"use client"


import React from 'react'
import { WinnerInfoType } from "../../../../types/agma"
import {useRouter} from "next/navigation";
import Image from 'next/image';
type Props = {
    data: WinnerInfoType
}

const InfoCard = ({data}: Props) => {
    const router = useRouter()
  return (
    <div className="grid grid-cols-2   my-3">
        <div className=" self-center text-sm ">
            <p className="font-semibold">{data.name}</p>
            <p>{data.village} | {data.municipality}</p>
        </div>
        <div className="place-self-center">
            <div className="relative rounded-full w-20 h-20 overflow-hidden border-2 border-violet-500 border-dashed">
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
  )
}

export default InfoCard