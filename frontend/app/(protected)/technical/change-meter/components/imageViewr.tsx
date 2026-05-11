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
     <dialog ref={dialogRef} className="modal modal-bottoms">
        <div className="modal-box h-full w-full max-h-[70vh]">
            <div className="relative w-full border">
                <button onClick={handleClose} className="absolute right-0 top-2"></button>
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