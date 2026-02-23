"use client"

import React, { useRef } from 'react'

import ComplaintMap from '../../components/complaintsMap'
type Props = {
    location: location;
}
type location = {
    latitude: number;
    longitude: number;
    srid: number;
}

const MapButton = ({ location }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const handleOpenModal = () => {
        modalRef.current?.showModal()
    };
    const handleCloseModal = () => modalRef.current?.close();
    return (
        <>
            <button aria-label='open-modal' type='button' onClick={handleOpenModal} className="btn rounded-full btn-sm bg-blue-600 drop-shadow-sm">
                <svg
                    version="1.1"
                    id="Icons"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width={25}
                    height={25} fill="currentColor">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0">
                    </g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                    </g>
                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <polygon points="12.3,23.7 11,22.4 11,31 19.6,31 15.3,26.7 ">
                            </polygon>
                            <path d="M22.4,31H27c0.6,0,1-0.4,1-1V15.4L17.4,26L22.4,31z">
                            </path>
                            <path d="M4,30c0,0.6,0.4,1,1,1h4V20.4l-5-5V30z">
                            </path>
                            <path d="M15.4,18.8c0.2,0.1,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2c0.3-0.2,6.4-5,6.4-10.8c0-3.9-3.1-7-7-7S9,4.1,9,8 C9,13.8,15.1,18.6,15.4,18.8z M16,5c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S14.3,5,16,5z">
                            </path>
                            <path d="M27,7h-2.1C25,7.3,25,7.7,25,8c0,6.6-6.4,11.8-7.2,12.4C17.3,20.8,16.7,21,16,21s-1.3-0.2-1.8-0.6C13.4,19.8,7,14.6,7,8 c0-0.3,0-0.7,0.1-1H5C4.4,7,4,7.4,4,8v4.6l6.7,6.7c0,0,0,0,0,0l3,3l2.3,2.3l12-12V8C28,7.4,27.6,7,27,7z">
                            </path>
                        </g>
                    </g>
                </svg>
            </button >
            <dialog ref={modalRef} className="modal backdrop-blur-sm">
                <div className="modal-box h-fit w-full bg-base-100/75">
                    <h3 className="font-bold text-lg flex gap-2 items-center">
                        <span>
                            <svg
                                version="1.1"
                                id="Icons"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                width={25}
                                height={25} fill="currentColor">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0">
                                </g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                                </g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <polygon points="12.3,23.7 11,22.4 11,31 19.6,31 15.3,26.7 ">
                                        </polygon>
                                        <path d="M22.4,31H27c0.6,0,1-0.4,1-1V15.4L17.4,26L22.4,31z">
                                        </path>
                                        <path d="M4,30c0,0.6,0.4,1,1,1h4V20.4l-5-5V30z">
                                        </path>
                                        <path d="M15.4,18.8c0.2,0.1,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2c0.3-0.2,6.4-5,6.4-10.8c0-3.9-3.1-7-7-7S9,4.1,9,8 C9,13.8,15.1,18.6,15.4,18.8z M16,5c1.7,0,3,1.3,3,3s-1.3,3-3,3s-3-1.3-3-3S14.3,5,16,5z">
                                        </path>
                                        <path d="M27,7h-2.1C25,7.3,25,7.7,25,8c0,6.6-6.4,11.8-7.2,12.4C17.3,20.8,16.7,21,16,21s-1.3-0.2-1.8-0.6C13.4,19.8,7,14.6,7,8 c0-0.3,0-0.7,0.1-1H5C4.4,7,4,7.4,4,8v4.6l6.7,6.7c0,0,0,0,0,0l3,3l2.3,2.3l12-12V8C28,7.4,27.6,7,27,7z">
                                        </path>
                                    </g>
                                </g>
                            </svg>
                        </span>
                        Complaint Locations
                        
                    </h3>
                    <div className="modal-action">
                        <button type='button' onClick={handleCloseModal} className="btn btn-circle absolute btn-sm right-3 top-2">X</button>
                    </div>
                    <div className='modal-middle'>
                        <ComplaintMap
                        latitude={location.latitude}
                        longitude={location.longitude}
                        srid={location.srid}/>
                    </div>
                </div>
            </dialog>
        </>

    )
}
export default MapButton;