"use client"

import { useRef } from "react";
import {Trash2} from "lucide-react"
type Props = {
    handleDelete: () => void
    show: boolean;
    is_active: boolean;
}

const Delete = ({ handleDelete, show , is_active}: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const handleOpen = () => modalRef.current?.showModal()
    const handleClose = () => modalRef.current?.close()
    const Delete = () => {
        handleDelete();
        handleClose();
      }
    return (
        <>
        <button
            onClick={handleOpen}
            title='Delete Selected'
            type='button'
            data-tip="Delete Change Meter"
            disabled={is_active ? false: true}
            className={`btn ${is_active? "btn-active": "btn-disabled"} tooltip tooltip-right sticky left-4 shadow btn-circle btn-sm  ${show ? "" : "hidden"}}`}>
                <Trash2 width={20} height={20} />
            
        </button>
        <dialog ref={modalRef} className="modal">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg text-warning">Delete Change Meter</h3>
                <p className="py-4 text-warning">Are you sure you want to delete this change meter?</p>
                <div className="modal-action">
                    <button type="button" onClick={handleClose} className="btn">Cancel</button>
                    <button type="button" onClick={Delete} className="btn btn-error">Delete</button>
                </div>
            </form>
        </dialog>
        </>
        
    )
}

export default Delete