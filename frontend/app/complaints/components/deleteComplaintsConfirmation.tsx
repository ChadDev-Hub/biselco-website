"use client"
import { DeleteComplaint } from '@/app/actions/complaint'
import {Trash2} from 'lucide-react'
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
                <Trash2 className="text-red-500"/>
            </button>
            <dialog ref={dialogRef} className='modal '>
                <div className="modal-box bg-base-100">
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