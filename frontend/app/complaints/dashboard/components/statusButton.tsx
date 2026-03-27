"use client"
import React, { useRef } from 'react'
import EnableButton from './complaintStatusToggle'



type Props = {
    status: status[];
    complaints_id: number;
    onOpen: (complaint_id:number) => void

}
type status = {
    id: number;
    complaint_id: number;
    name: string;
    description: string;
    date: string;
    time: string;
}



const ComplaintStatusButton = ({ status, complaints_id, onOpen }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const complaintStatusName = ['Received', 'Pending', 'Working', 'Complete']

    const handleOpen = () => {
        if (modalRef.current) {
            modalRef.current.showModal()
            onOpen(complaints_id)
        }
    }
    const handleClose = () => {
        if (modalRef.current) {
            modalRef.current.close()
        }
    }
    return (
        <>
            <button aria-label='modal-button' data-tip="Update Status" type='button' className="btn btn-circle btn-ghost tooltip tooltip-right " onClick={handleOpen}>
                <svg
                    width={30}
                    height={30}
                    viewBox="0 0 1024 1024"
                    className="icon drop-shadow-amber-900 drop-shadow-md"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000">
                    <g id="SVGRepo_bgCarrier" strokeWidth={0}>
                    </g>
                    <g id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                    </g>
                    <g
                        id="SVGRepo_iconCarrier">
                        <path
                            d="M896 618.666667H443.733333c-10.666667 0-21.333333-4.266667-29.866666-12.8l-78.933334-78.933334c-8.533333-8.533333-8.533333-21.333333 0-29.866666l78.933334-78.933334c8.533333-8.533333 19.2-12.8 29.866666-12.8H896c12.8 0 21.333333 8.533333 21.333333 21.333334v170.666666c0 12.8-8.533333 21.333333-21.333333 21.333334z"
                            fill="#3F51B5">
                        </path>
                        <path
                            d="M192 128h42.666667v768H192z"
                            fill="#CFD8DC">
                        </path>
                        <path
                            d="M213.333333 213.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"
                            fill="#90A4AE">
                        </path>
                        <path
                            d="M213.333333 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#90A4AE">
                        </path>
                        <path d="M213.333333 810.666667m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#90A4AE">
                        </path>
                        <path d="M725.333333 917.333333H443.733333c-10.666667 0-21.333333-4.266667-29.866666-12.8l-78.933334-78.933333c-8.533333-8.533333-8.533333-21.333333 0-29.866667l78.933334-78.933333c8.533333-8.533333 19.2-12.8 29.866666-12.8H725.333333c12.8 0 21.333333 8.533333 21.333334 21.333333v170.666667c0 12.8-8.533333 21.333333-21.333334 21.333333z" fill="#448AFF">
                        </path>
                        <path d="M746.666667 320H443.733333c-10.666667 0-21.333333-4.266667-29.866666-12.8l-78.933334-78.933333c-8.533333-8.533333-8.533333-21.333333 0-29.866667l78.933334-78.933333c8.533333-8.533333 19.2-12.8 29.866666-12.8H746.666667c12.8 0 21.333333 8.533333 21.333333 21.333333v170.666667c0 12.8-8.533333 21.333333-21.333333 21.333333z" fill="#00BCD4">
                        </path>
                    </g>
                </svg>
            </button>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box relative">
                    <h1 className='text-md text-blue-500 absolute top-3'>Complaint Status</h1>
                    <button type='button' onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <div className='overflow-x-auto mt-4'>
                        <ul tabIndex={-1} className="dropdown-content text-xs menu bg-base-100 rounded-box w-lg p-2 shadow-sm">
                            {complaintStatusName.map((item: string, index: number) =>
                                <li key={index} className='space-y-2 flex flex-row space-x-2 justify-between w-full'>
                                    <span>{item}</span>
                                    {status.find((stats: status) => stats.name === item) ?
                                        <span key={index}>
                                            {status.find((stats: status) => stats.name === item)?.date} • {status.find((stats: status) => stats.name === item)?.time}
                                        </span>
                                        :
                                        <span key={index} className='loading loading-dots loading-sm' />
                                    }
                                    <EnableButton
                                        id={complaints_id}
                                        enabled={
                                            status.find((stats: status) => stats.name == item) ? true : false
                                        }
                                        name={item}
                                    />
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </dialog>
        </>
    )
}
export default ComplaintStatusButton