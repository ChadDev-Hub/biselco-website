"use client"
import React, { useRef} from 'react'
import EnableButton from './complaintStatusToggle'

type Props = {
    status: status[];
    complaints_id: number;
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
const ComplaintStatusButton = ({ status, complaints_id, setShowAlert}: Props) => {
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
            <button type='button' className="btn" onClick={handleOpen}>open modal</button>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box relative">
                    <h1 className='text-md text-blue-500 absolute top-3'>Complaint Status</h1>
                    <button type='button' onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <div className='overflow-x-auto mt-4'>
                        <ul tabIndex={-1} className="dropdown-content text-xs menu bg-base-100 rounded-box w-lg p-2 shadow-sm">
                            {complaintStatusName.map((item: string, index: number) =>
                                <li key={index} className='space-y-2 flex flex-row space-x-2 justify-between w-full'>
                                    <span>{item}</span>
                                    {status.map((stats: status) => stats.name === item ?
                                        <span key={stats.id}>
                                            {stats.date} • {stats.time}</span> :
                                        <span key={stats.id} className='loading loading-dots loading-sm' />
                                    )}
                                    <EnableButton
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