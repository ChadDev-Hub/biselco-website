"use client"

import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler} from "react-hook-form";


type Props = {
    show: boolean;
    download: (data:FormField) => void;
}
type FormField = {
    prepared_by: string
    prepared_position: string
    checked_by: string
    checked_position: string
    approved_by: string
    approved_position: string
}

const DownloadReport = ({ show, download }: Props) => {
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
            <button onClick={handleOpen} title='Download Report' type='button' className={`btn btn-ghost btn-circle btn-sm ${show ? "" : "hidden"}`}>
                <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g
                        id="SVGRepo_bgCarrier">
                    </g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                    </g>
                    <g
                        id="SVGRepo_iconCarrier">
                        <path
                            d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                        </path>
                    </g>
                </svg>
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