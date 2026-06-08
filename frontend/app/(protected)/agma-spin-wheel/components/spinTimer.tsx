"use client"
import React, { useRef, useState} from 'react'
import {Timer, XCircle} from "lucide-react"
import {useSearchParams, usePathname, useRouter} from "next/navigation";


const SpinTimer = () => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => {
        modalRef?.current?.showModal()
        setIsOpen(true)};
    const handleClose = () => {
        modalRef?.current?.close()
        setIsOpen(false)};

    // SEARCH PARAMETER FUNCTIONALITY

    const searchParams = useSearchParams();
    const currentPath = usePathname()
    const router = useRouter()
    
    const handleSelection = (value: string)=> {
        const timeValue = Number(value)
        const params = new URLSearchParams(searchParams.toString())
        
            params.set("spin_time", timeValue.toString())
            router.push(`${currentPath}?${params.toString()}`)
        
        
    }
  return (
    <>
        <button type="button" onClick={handleOpen} title="Spin Timer" className={`btn btn-circle btn-lg bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 ${isOpen ? "border-2 border-dashed border-purple-600" : ""}`}>
            <Timer className="w-6 h-6 text-white"/>
        </button>
        <dialog ref={modalRef} className="modal">
            <div className="modal-box max-w-xs  backdrop-blur-md bg-slate-950/80 0 shadow shadow-slate-50 ">
                <div className="dialog relative">
                <button onClick={handleClose} type="button" className="btn btn-sm btn-circle absolute btn-error -right-4 -top-4 shadow-md">
                    <XCircle className="w-6 h-6 text-white"/>
                </button>
                <span className="text-2xl space-y-2 font-bold">
                    SELECT SPIN TIMER
                </span>


                {/* OPTION */}
                <div>
                    <select onChange={(e)=>handleSelection(e.target.value)}  defaultValue={5} className="select bg-slate-800 font-bold shadow ">
                         <option value={5}>
                            5 Seconds
                         </option>
                         <option value={10}>
                            10 Seconds
                         </option>
                    </select>
                </div>
                 
                </div>
                
               
            </div>
        </dialog>
    </>
  )
}

export default SpinTimer