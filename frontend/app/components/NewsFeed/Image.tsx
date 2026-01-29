"use client"
import React, { useState } from 'react'
import Image from 'next/image'
type Props = {
    src: string[]
}

const SingleImagePost = ({src}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true)}
        
        
    const handleClose = () => setIsOpen(false);
    return (
        <div className="relative group cursor-pointer" onClick={handleOpen}>
            <Image
                loading="eager"
                src={src[0]}
                alt="Image"
                width={50}
                height={50}
                sizes="(min-width: 1024px) 200px, 100vw"
                className="w-full h-full lg:h-100 object-cover transform transition-transform duration-500 group-hover:scale-102"
            />
            {isOpen && (
                <div
                    className= "fixed inset-0 bg-base-200/45  backdrop-blur-2xl h-full w-full flex items-center justify-center z-50"
                    onClick={handleClose} // close when clicking outside
                >
                    <div
                        className="relative max-w-full max-h-full p-4"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image
                    >
                        <Image
                            loading='eager'
                            src="https://drive.google.com/uc?export=view&id=1TuZkm86d71k_mhJ_0nrIJQrxvA02wCSA"
                            alt="Full Image"
                            width={500}
                            height={800}
                            className="h-full w-full object-contain rounded-xl"
                        />
                        <button
                            className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full px-3 py-1 hover:bg-black/70"
                            onClick={handleClose}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}



interface MultipleImageProps{
    images:string[]
}
const MultipleImage = ({images}:MultipleImageProps) => {
    return(
        <div className="columns-2 md:columns-3 gap-1 lg:columns-5  p-4">
            {images.map((im,index)=>(
                <SingleImagePost key={index} src={im}/>
            ))
            }
        </div>
    )
}
export { SingleImagePost , MultipleImage}