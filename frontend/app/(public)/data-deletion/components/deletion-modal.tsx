"use client"
import {useRef} from 'react'

const DeletiopModal = () => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const handleOpen = () => modalRef.current?.showModal()
    const handleClose = () => modalRef.current?.close()
  return (
    <>
    <button onClick={handleOpen} className="btn btn-error place-content-center btn-circle btn-md w-full  p-2">
        Request Deletion
    </button>
    <dialog ref={modalRef} className="modal border">
        <div className="modal-box relative h-fit">
            <h3 className="text-lg font-bold text">Request Deletion</h3>
            <p className="py-4">Are you sure you want to request deletion of your account?</p>
            <div className="modal-action">
                <button className="btn" onClick={handleClose}>Cancel</button>
                <button className="btn btn-error" >Delete Account</button>
            </div>
        </div>
    </dialog>
    </>
  )
}

export default DeletiopModal