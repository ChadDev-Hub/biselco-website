"use client"

import { useRef } from "react"
import Image from "next/image"
type Props = {
    image: string
}

const ImageViewer = ({ image }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const handleOpen = () => modalRef.current?.showModal()
    const handleClose = () => modalRef.current?.close()
    return (
        <>
            <button className="btn btn-circle btn-ghost" onClick={handleOpen}>📷</button>
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <button type="button" onClick={handleClose} className="btn btn-circle btn-ghost absolute right-2 top-2">X</button>
                    <Image 
                    src={image} 
                    alt="image" 
                    width={500} 
                    height={500} 
                    sizes="(min-width: 1024px) 200px, 100vw"/>
                </div>
            </dialog>
        </>
    )
}

export default ImageViewer;