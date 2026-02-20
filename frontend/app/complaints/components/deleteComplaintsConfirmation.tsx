import React from 'react'
import { DeleteComplaint } from '@/lib/serverFetch'
type DeletConfirmationProps = {
    onClose: () => void;
    deleteComplaint: (id: number)=> void;
    complaintId: number;
}

const DeletConfirmation = ({onClose, deleteComplaint, complaintId}:DeletConfirmationProps) => {
    const handleDelete = () =>{
        deleteComplaint(complaintId)
        DeleteComplaint(complaintId)
        onClose()
    }
    return (
            <div className="modal-box bg-base-100/45">
                <h3 className="font-bold text-lg">Delete Complaits</h3>
                <p className="py-4">Do you want to Delete this Complaint</p>
                <div className="modal-action">
                        <button onClick={handleDelete} disabled={false && <div className="loading"></div>} type='button' className="btn btn-error rounded-full">Delete</button>
                        <button onClick={onClose} type='button' className="btn btn-neutral rounded-full">Close</button>
                </div>
            </div>
    )
}

export default DeletConfirmation