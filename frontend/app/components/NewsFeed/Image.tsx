"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
type Props = {
    src: string
}

const SingleImagePost = ({ src }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true)
    }


    const handleClose = () => setIsOpen(false);
    return (
        <div className="relative group cursor-pointer" onClick={handleOpen}>
            <Image
                loading="eager"
                src={src}
                alt="Image"
                width={50}
                height={50}
                sizes="(min-width: 1024px) 200px, 100vw"
                className="w-full h-full lg:h-100 object-cover transform transition-transform duration-500 group-hover:scale-102"
            />
            {isOpen && (
                <div
                    className="fixed inset-0 bg-base-200/45  backdrop-blur-2xl h-full w-full flex items-center justify-center z-50"
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
                            type='button'
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



interface MultipleImageProps {
    images: string[]
}
const MultipleImage = ({ images }: MultipleImageProps) => {
    const disPlayImage = images.slice(0, 5)
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-125">
            {disPlayImage.map((im, index) => {
                const isFirst = index === 0;
                const isFourth = index === 3;
                return (
                    <div
                        key={index}
                        className={`relative overflow-hidden rounded-xl shadow-sm transition-transform hover:scale-[1.02] 
                            ${isFirst ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                            } ${isFourth ? "col-span-2" : "col-span-1 row-span-1"}`}>
                        <SingleImagePost src={im} />
                    </div>

                )

            })
            }
        </div>
    )
}
export { SingleImagePost, MultipleImage }