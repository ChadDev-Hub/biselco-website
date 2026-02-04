"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Carousel from '../carousel'



type Props = {
    postId: number;
    src: string;
}

/**
 * A component that displays a single image post.
 * It will render a smaller image when not hovered and a larger image when hovered.
 * When clicked, it will open a full screen modal with the full image.
 * @param {Props} props - The props object
 * @return {React.ReactElement} - The rendered component
 */
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
                    className="fixed inset-0 bg-base-200/45  h-full w-full flex items-center justify-center z-50"
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
                            className="h-full w-full object-contain image-full rounded-sm drop-shadow-2xl"
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




type MultipleImageProps = {
    postId: number;
    images: string[];
}
/**
 * A component that displays a quilted image style for the given images.
 * It will display the first 5 images in a grid and the 6th image
 * as a background image with a blur effect.
 *
 * @param {MultipleImageProps} props - The props object
 * @return {React.ReactElement} - The rendered component    
 */
const QuiltedStyle = ({ images, postId }: MultipleImageProps) => {
    const displayImage = images.slice(0, 5)
    const image6th = images[images.length - 1]
    const [showAllImages, setShowAllImages] = useState(false);
    const handleShowAllImages = () => {
        setShowAllImages(true);
    }

    const handleHideImages = () => {
        setShowAllImages(false);
    }

    const FiveImagesGridSpan = (index: number) => {
        switch (index) {
            case 0: return "col-span-2 row-span-2 lg:row-span-2 lg:col-span-2";
            case 1: return "row-span-2 col-span-2 lg:row-span-1 lg:col-span-2";
            case 2: return "col-span-2 lg:row-span-2 lg:col-span-2";
            case 3: return "col-span-2 lg:row-span-2";
            default: return "col-span-3 lg:row-span-1 lg:col-span-1";
        }
    }

    const FourImagesGridSpan = (index: number) => {
        switch (index) {
            case 0: return "col-span-2 row-span-2 lg:row-span-4 lg:col-span-2";
            case 1: return "row-span-2 col-span-2 lg:row-span-2 lg:col-span-2";
            case 2: return "col-span-4 row-span-1 lg:row-span-2 lg:col-span-1";
            default: return "col-span-3 lg:row-span-1 lg:col-span-1";
        }
    }

    const ThreeImagesGridSpan = (index: number) => {
        switch (index) {
            case 0: return "col-span-2 row-span-2 lg:row-span-2 lg:col-span-2";
            case 1: return "row-span-2 col-span-2 lg:row-span-2 lg:col-span-2";
            default: return "col-span-4 row-span-2   lg:row-span-2 lg:col-span-4";
        }
    }

    const TwoImagesGridSpan = (index: number) => {
        switch (index) {
            case 0: return "col-span-2 row-span-2 lg:row-span-4 lg:col-span-2";
            default: return "col-span-2 lg:row-span-4 lg:col-span-2";
        }
    }
    return (
        <>
            {showAllImages ?
                <div className='relative'>
                    <div className='absolute z-40 w-full  flex justify-end'>
                        <button type='button' onClick={handleHideImages} aria-label='grid' className='btn btn-ghost btn-circle right-2'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="4" height="4" rx="1" />
                                <rect x="8" y="2" width="4" height="4" rx="1" />
                                <rect x="14" y="2" width="4" height="4" rx="1" />
                                <rect x="2" y="8" width="4" height="4" rx="1" />
                                <rect x="8" y="8" width="4" height="4" rx="1" />
                                <rect x="14" y="8" width="4" height="4" rx="1" />
                                <rect x="2" y="14" width="4" height="4" rx="1" />
                                <rect x="8" y="14" width="4" height="4" rx="1" />
                                <rect x="14" y="14" width="4" height="4" rx="1" />
                            </svg>
                        </button>
                    </div>

                    <Carousel postId={postId} imageList={images} />
                </div>

                : <div className="grid grid-cols-4  grid-rows-4 gap-2  w-full h-110">
                    {displayImage.map((im, index) => (
                        <div key={index} className={` 
                overflow-hidden 
                rounded-sm 
                ${
                    images.length > 4 ? FiveImagesGridSpan(index) :
                        images.length === 4 ? FourImagesGridSpan(index) : 
                        images.length === 3 ? ThreeImagesGridSpan(index) :
                        TwoImagesGridSpan(index)
                }
                `}>
                    <Image
                        src={im}
                        alt={`PostImage #${index}`}
                        width={50}
                        height={50}
                        sizes="(min-width: 1024px) 200px, 100vw"
                        className='w-full h-full object-cover' />
                </div>
                    ))}
            {images.length > 3 && <div onClick={handleShowAllImages} className={`
            relative
            cursor-pointer col-span-1 lg:col-span-1 lg:row-span-2 flex justify-center items-center`}>
                <svg
                    className='z-10'
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
                <Image
                    src={image6th}
                    alt={`PostImage`}
                    width={50}
                    height={50}
                    sizes="(min-width: 1024px) 200px, 100vw"
                    className='absolute inset-0 w-full h-full object-cover blur-sm hover:scale-105' />
            </div>}
        </div >}
        </>
    )
}







export { SingleImagePost, QuiltedStyle }