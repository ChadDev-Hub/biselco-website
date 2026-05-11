"use client"
import Image from 'next/image';
import { useRef } from 'react';


type Props = {
    image: string;
}

const ImageViewer = ({image}: Props) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null)
    const handleOpen = () => dialogRef.current?.showModal()
    const handleClose = () => dialogRef.current?.close()
  return (
    <>
    <button onClick={handleOpen} type="button" title="View Image" className="relative w-full h-full btn">
            <Image
              fill
              loading="eager"
              src={image}
              className="object-fill border-2 border-white  rounded-box p-0.5 object-center w-full"
              sizes="100%"
              alt="change meter image"
            />
     </button>
     <dialog ref={dialogRef} className="modal modal-bottom px-2 sm:px-4 xl:px-[20%]">
        <div className="modal-box relative h-full w-full max-h-[80vh] ">
            <div className="absolute right-2 top-2 z-50 ">
                <button onClick={handleClose} className="btn btn-xs btn-error drop-shadow-2xl drop-shadow-black ">X</button>
            </div>
            <Image
              fill
              loading="eager"
              src={image}
              className="object-fill border-2 border-white  rounded-box p-0.5 object-center w-full"
              sizes="100%"
              alt="change meter image"
            />
        </div>
     </dialog>
    </>
  )
}

export default ImageViewer;