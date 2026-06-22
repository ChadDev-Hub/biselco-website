
"use client";

import React, { useRef} from 'react'
import {monitoringType} from "@/types/agma"
import {XCircle} from "lucide-react"
type Props = {
    data: monitoringType[] | undefined
}

const VerificationAuditTrails = ({data}:Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const handleOpen = () => dialogRef.current?.showModal();
    const handleClose = () => dialogRef.current?.close();

  return (
    <>
    <button onClick={handleOpen} type="button" className="btn btn-md">
        Verification Audit Trail
    </button>
    <dialog ref={dialogRef} className="modal">
        <div className="modal-box relative">
            <button onClick={handleClose} type="button" className="btn shadow btn-sm btn-error btn-circle sticky top-0.2 right-0.3">
                <XCircle className="w-6 h-6 text-white" />
            </button>
        </div>
    </dialog>
    </>
  )
}

export default VerificationAuditTrails