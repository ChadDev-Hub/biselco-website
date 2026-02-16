"use client"
import React, { useRef } from 'react'
import EnableButton from './complaintStatusToggle'


type Props = {
    status: status[];
    complaints_id: number;
    user_id: number;
    setShowAlert: React.Dispatch<React.SetStateAction<Alerts | null>>
}
type status = {
    id: number;
    complaint_id: number;
    name: string;
    description: string;
    date: string;
    time: string;
}

type AlertType = "error" | "success"
type Alerts = {
    type: AlertType,
    message: string,

}
const ComplaintStatusButton = ({ status, complaints_id, setShowAlert, user_id }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const complaintStatusName = ['Received', 'Pending', 'Working', 'Complete']

    const handleOpen = () => {
        if (modalRef.current) {
            modalRef.current.showModal()
        }
    }
    const handleClose = () => {
        if (modalRef.current) {
            modalRef.current.close()
        }
    }


    return (
        <>
            <button aria-label='modal-button' type='button' className="btn btn-circle bg-yellow-100 shadow-md drop-shadow-md" onClick={handleOpen}>
                <svg
                    width={25}
                    height={25}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g
                        id="SVGRepo_bgCarrier"
                        strokeWidth="0">
                    </g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                    </g>
                    <g
                        id="SVGRepo_iconCarrier">
                        <path
                            d="M13 3H7C5.89543 3 5 3.89543 5 5V10M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19M19 9V19C19 20.1046 18.1046 21 17 21H10C7.79086 21 6 19.2091 6 17V17C6 14.7909 7.79086 13 10 13H13M13 13L10 10M13 13L10 16"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round">
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
                                        user_id={user_id}
                                        id={complaints_id}
                                        enabled={
                                            status.find((stats: status) => stats.name === item) ? true : false
                                        }
                                        name={item}
                                        setShowAlert={setShowAlert}
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