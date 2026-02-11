import React from 'react'

interface DeletConfirmationProps {
    onClose: () => void;
}

const DeletConfirmation = ({onClose}:DeletConfirmationProps) => {
    return (
        
            <div className="modal-box bg-base-100/45">
                <h3 className="font-bold text-lg">Delete Complaits</h3>
                <p className="py-4">Do you want to Delete this Complaint</p>
                <div className="modal-action">
                        <button type='button' className="btn btn-error rounded-full">Delete</button>
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={onClose} type='button' className="btn btn-neutral rounded-full">Close</button>
                </div>
            </div>
    )
}

export default DeletConfirmation