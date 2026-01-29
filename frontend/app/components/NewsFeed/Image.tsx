
import React from 'react'
import Image from 'next/image'
type Props = {}

const SingleImagePost = (props: Props) => {
    return (
        <div className="relative group">
            <Image
                loading="eager"
                src="https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA"
                alt="Image"
                width={50}
                height={50}
                sizes="(min-width: 1024px) 200px, 100vw"
                className="w-full h-full lg:h-100 object-cover transform transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute top-4 left-4">
                <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">Innovation</span>
            </div>
        </div>
    )
}

export { SingleImagePost }