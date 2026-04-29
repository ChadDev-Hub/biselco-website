"use client"
import { DeleteComplaint } from '@/app/actions/complaint'

import { useRef } from 'react';
type DeletConfirmationProps = {
    complaintId: number;
}

const DeletConfirmation = ({ complaintId }: DeletConfirmationProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const handleOpen = () => dialogRef.current?.showModal();
    const onClose = () => dialogRef.current?.close();
    const handleDelete = async () => {
        console.log(complaintId);
        await DeleteComplaint(complaintId);
    }
    return (
        <>
            <button title='delete' onClick={handleOpen} className='btn btn-circle btn-ghost'>
                <svg
                    className='drop-shadow-amber-600 drop-shadow-md'
                    width={25}
                    height={25}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier"
                        stroke-width="0">
                    </g>
                    <g id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                    </g>
                    <g
                        id="SVGRepo_iconCarrier">
                        <path
                            d="M10 11V17"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </path>
                        <path d="M14 11V17"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </path>
                        <path
                            d="M4 7H20"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </path>
                        <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </path>
                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </path>
                    </g>
                </svg>
            </button>
            <dialog ref={dialogRef} className='modal '>
                <div className="modal-box bg-base-100/45">
                    <h3 className="font-bold text-lg">Delete Complaits</h3>
                    <p className="py-4">Do you want to Delete this Complaint</p>
                    <div className="modal-action">
                        <button onClick={handleDelete} disabled={false && <div className="loading"></div>} type='button' className="btn btn-error rounded-full">Delete</button>
                        <button onClick={onClose} type='button' className="btn btn-neutral rounded-full">Close</button>
                    </div>
                </div>
            </dialog>
        </>


    )
}

export default DeletConfirmation;