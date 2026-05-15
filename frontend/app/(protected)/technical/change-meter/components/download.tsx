"use client"

import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler} from "react-hook-form";
import {FileDown} from "lucide-react"


type Props = {
    show: boolean;
    download: (data:FormField) => void;
    isactive: boolean;
}
type FormField = {
    prepared_by: string
    prepared_position: string
    checked_by: string
    checked_position: string
    approved_by: string
    approved_position: string
}

const DownloadReport = ({ show, download, isactive }: Props) => {
    const { register, reset, handleSubmit, formState: { errors, isValid, isSubmitSuccessful}} = useForm<FormField>();
    const [showForm, setShowForm] = useState(false);
    const [showDowndloadButon, setShowDowndloadButton] = useState(false);


    // MODAL
    const modalRef = useRef<HTMLDialogElement>(null);
    const handleOpen = () => modalRef?.current?.showModal();
    const handleClose = () => {
        modalRef?.current?.close();
        setShowForm(false);
    };


    // HANDLE SHOWFORM
    const handleShowForm = () => setShowForm(true);

    // HANDLE SHOW DOWNLOAD BUTTON
    useEffect(()=>{
        if(isValid){
            queueMicrotask(()=>{
                setShowDowndloadButton(true);
            })
        }else{
            queueMicrotask(()=>{
                setShowDowndloadButton(false);
            })
        }
    },[isValid])

    // CHECK IF IS SUBMIT SUCCESSFUL
    useEffect(()=>{
        if(isSubmitSuccessful){
            queueMicrotask(()=>{
                reset();
                handleClose();
            })
        }
    },[isSubmitSuccessful, reset])

    const onSubmit: SubmitHandler<FormField> = (data: FormField) => {
        download(data);
    };

    return (
        <>
            <button disabled={isactive? false : true} onClick={handleOpen} title='Download Report' type='button' className={`btn ${isactive? "btn-active" : "btn-disabled"} place-items-center shadow sticky left-14 btn-circle btn-sm ${show ? "" : "hidden"}`}>
                <FileDown width={20} height={20} />
            </button>
            <dialog ref={modalRef} className="modal backdrop-blur-xl">
                <div className="modal-box">
                    <div className="modal-start">
                        <h3 className="font-bold text-lg text-black">Download Report</h3>
                        <div className="chat chat-start w-full">
                            <div className="py-4 chat-bubble drop-shadow-md drop-shadow-gray-600">
                                <p>
                                    Do you want to download this report?
                                </p>
                                <button onClick={handleShowForm} type="button" className="btn btn-success btn-sm">Yes</button>
                            </div>
                        </div>
                    </div>
                    {showForm && <div className="chat  chat-start">
                        <div className="chat-bubble  drop-shadow-gray-600 drop-shadow-md border-gray-400 w-full">
                            <p className="text-start">Please Fillout the following:</p>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-col w-full">
                                {/* PREPARED BY */}
                                <div className="flex flex-col gap-1">
                                    <label className="label text-xs">
                                        Prepared By:
                                    </label>
                                    <input 
                                    type="text" {...register("prepared_by", { required: "Prepared By is required" })} 
                                    className="input input-sm w-full"
                                    placeholder="Name"
                                     />
                                     {errors.prepared_by && <span className="text-xs text-red-600">{errors.prepared_by.message}</span>}
                                     <input 
                                    type="text"
                                    className="input input-sm w-full"
                                    {...register("prepared_position", { required: "Must have Position" })} 
                                    placeholder="Position" />
                                    {errors.prepared_position && <span className="text-xs text-red-600">{errors.prepared_position.message}</span>}
                                </div>
                                {/* CHECKED BY */}
                                <div className="flex flex-col gap-1">
                                    <label className="label text-xs">
                                        Checked By:
                                    </label>
                                    <input type="text"
                                    className="input input-sm w-full"
                                    {...register("checked_by", { required: "Checked By is required" })} 
                                    placeholder="Name"/>
                                    {errors.checked_by && <span className="text-xs text-red-600">{errors.checked_by.message}</span>}
                                    <input type="text"
                                    className="input input-sm w-full"
                                    {...register("checked_position", { required: "Must have Position" })} 
                                    placeholder="Position" />
                                    {errors.checked_position && <span className="text-xs text-red-600">{errors.checked_position.message}</span>}
                                </div>
                                {/* APPROVED BY */}
                                <div className="flex flex-col gap-1">
                                    <label className="label text-xs">
                                        Approved By:
                                    </label>
                                    <input type="text"
                                    className="input input-sm w-full"
                                    {...register("approved_by", { required: "Approved By is required" })}
                                    placeholder="Name"/>
                                    {errors.approved_by && <span className="text-xs text-red-600">{errors.approved_by.message}</span>}
                                    <input type="text"
                                    className="input input-sm w-full"
                                    {...register("approved_position", { required: "Must have Position" })}
                                    placeholder="Position" />
                                    {errors.approved_position && <span className="text-xs text-red-600">{errors.approved_position.message}</span>}
                                </div>
                                {showDowndloadButon && <button type="submit" className="btn btn-success btn-sm">Download</button>}
                            </form>
                        </div>
                    </div>}

                    <div className="modal-action">
                        <button type="button" onClick={handleClose} className="btn">Cancel</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default DownloadReport;