"use client";

import React from 'react'
import Image from 'next/image';

type Props = {
    cardTitle: string;
    cardDescription: string;
    children: React.ReactNode
}

const FormCard = ({cardTitle, cardDescription, children}: Props) => {
    return (
        <div className="card bg-base-100 image-full h-65 w-full sm:w-full md:w-95 lg:w-100 shadow-md drop-shadow-md hover:scale-101">
            <figure >
                <Image
                    width={600}
                    height={400}
                    src="/electric-meter.webp"
                    alt="eletric-meter"/>
            </figure>
            <div className="card-body">
                <h2 className="card-title font-bold">{cardTitle}</h2>
                <p className='card-body'>{cardDescription}</p>
                <div className="card-actions justify-end">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default FormCard;