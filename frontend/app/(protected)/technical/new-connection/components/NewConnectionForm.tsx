"use client"

import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import BiselcoMap from "@/app/common/Map"
import { newConnectionMeter } from "@/app/actions/newConnectionMeter"
import ElectricMeter from "../../components/electricMeterSvg"
import { useEffect, useRef, useState } from "react"
import { GetImageLocation } from '../../../../actions/imageGeolocation';
import { CirclePlus } from 'lucide-react';
import ImageViewer from '../../change-meter/components/imageViewr';


type FormField = {
    date: string;
    consumer_name: string;
    meter_serial_number: string;
    meter_brand: string;
    meter_sealed: string;
    initial_reading: number;
    multiplier: number;
    remarks: string;
    lon: number | undefined;
    lat: number | undefined;
    attachment: FileList | undefined;
    accomplished_by: string
}



const NewConnectionForm = () => {
    const { register, clearErrors, setError, control, formState: { errors, isSubmitting }, handleSubmit, setValue, reset, getValues } = useForm<FormField>()
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const attachment = useWatch({ control, name: "attachment" });
    const [imageLocationVerifying, setImageLocationVerifying] = useState(false);
    const handleClose = () => modalRef?.current?.close();
    const handleOpen = () => modalRef?.current?.showModal();
    const labelStyle = "label font-bold text-xs"
    const inputStle = "input input-sm w-full"
    const errorStyle = "text-xs text-error italic"
    const consumerName = useWatch({
        control: control,
        name: "consumer_name",
        defaultValue: ""
    });
    const lon = useWatch({
        control: control,
        name: "lon"
    })
    const lat = useWatch({
        control: control,
        name: "lat"
    })

    useEffect(() => {
        if (attachment?.length === 0 || attachment === undefined) return;
        const runCheck = async () => {
            setImageLocationVerifying(true);
            const {latitude, longitude}= await GetImageLocation(attachment[0]);
            if (!latitude || !longitude){
                setError("lat", {message:"Unable to verify location of image attached please pin the exact location"});
                setImageLocationVerifying(false);
                setValue("lat", undefined);
                setValue("lon", undefined);
                return;
            }
            setValue("lat", latitude);
            setValue("lon", longitude);
            clearErrors("lat");
            setImageLocationVerifying(false);
            
        };
        runCheck();
    }, [attachment, setValue, setError, setImageLocationVerifying, clearErrors]);
    const onSubmit: SubmitHandler<FormField> = async () => {
        const data = getValues();
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof FileList) {
                form.append(key, value[0]);
            } else {
                form.append(key, String(value));
            }
        })
        const res = await newConnectionMeter(form);
        switch (res?.status) {
            case 201:
                reset();
                break;
            case 403:
                setError("lat", { message: res.data });
            default:
                break;
        }
    }
    return (
        <>
            <button
                type="button"
                data-tip="Add Change Meter"
                title="Change Meter Form"
                onClick={handleOpen}
                className="btn btn-active btn-circle btn-sm tooltip tooltip-right tooltip-xs"
            >
                <CirclePlus/>
            </button>
            <dialog ref={modalRef} className="modal  modal-bottom">
                <div className='px-2 w-full mx-auto modal-box border max-w-3xl drop-shadow-md z-10 bg-base-100 rounded-box  border"'>

                <div
                    className={`sticky -top-4 `}
                >
                   
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn absolute z-100 -top-4 right-0 btn-sm btn-circle"
                    >
                        X
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">

                    <div >
                        {/* DATE */}
                        <div className="flex flex-col">
                            <label className={labelStyle}>
                                Date Accomplished
                            </label>
                            <input {...register("date", { required: "Date is required" })} type="date" className={inputStle} />
                            {errors.date && <span className={errorStyle}>{errors.date.message}</span>}
                        </div>
                        {/* CONSUMER NAME */}
                        <div className="flex  flex-col">
                            <label className={labelStyle}>
                                Consumer Name
                            </label>
                            <input {...register("consumer_name", { required: "Please enter consumer name" })} type="text" 
                            placeholder="Consumer Name" 
                            className={inputStle} />
                            {errors.consumer_name && <span className={errorStyle}>{errors.consumer_name.message}</span>}
                        </div>

                        {/* METER SERIAL NUMBER */}
                        <div className="flex flex-col">
                            <label className={labelStyle}>
                                Meter Serial Number
                            </label>
                            <input {...register("meter_serial_number", { required: "Please enter correct Seriral Number" })} type="text" className={inputStle}
                            placeholder="Meter Serial Number" />
                            {errors.meter_serial_number && <span className={errorStyle}>{errors.meter_serial_number.message}</span>}
                        </div>

                        {/* METER BRAND*/}
                        <div className="flex flex-col">
                            <label className={labelStyle} >
                                Meter Brand
                            </label>
                            <input {...register("meter_brand", { required: "Please enter meter brand" })} type="text" className={inputStle}
                            placeholder="Meter Brand" />
                            
                            {errors.meter_brand && <span className={errorStyle}>{errors.meter_brand.message}</span>}
                        </div>

                        {/* METER SEALED */}
                        <div className="flex flex-col">
                            <label className={labelStyle}>
                                Meter Seal
                            </label>
                            <input {...register("meter_sealed")} type="text" className={inputStle} placeholder="Meter Seal" />
                        </div>

                        {/* INITIAL READING */}
                        <div className="flex flex-col">
                            <label className={labelStyle}>
                                Initial Reading
                            </label>
                            <input type="number" accept="number" {...register("initial_reading", {
                                valueAsNumber: true,
                                required: "Initial Reading is required",
                                setValueAs: (v) => {
                                    if (v === "" || v === undefined) return undefined;
                                    const num = Number(v)
                                    return isNaN(num) ? undefined : num
                                }
                            })} className={inputStle} placeholder="Initial Reading" />
                            {errors.initial_reading && <span className={errorStyle}>{errors.initial_reading.message}</span>}
                        </div>

                        {/* MULTIPLIER */}
                        <div className="flex flex-col">
                            <label className={labelStyle}>
                                Multiplier
                            </label>
                            <input type="number" accept="number" defaultValue={1} {...register("multiplier", {
                                valueAsNumber: true,
                                required: "Multiplier is required",
                                setValueAs: (value) => Number(value)
                            })} className={inputStle} />
                            {errors.multiplier && <span className={errorStyle}>{errors.multiplier.message}</span>}
                        </div>

                        {/* REMARKS */}
                        <div className="flex flex-col h-fit">
                            <label className={labelStyle} >
                                Remarks
                            </label>
                            <textarea {...register("remarks")} className="textarea textarea-sm w-full" />
                        </div>

                        {/* ACCOMPLISHED BY */}
                        <div>
                            <label className={labelStyle}>
                                Accomplished By
                            </label>
                            <input {...register("accomplished_by", { required: "Accomplished By is required" })} type="text" className={inputStle} placeholder="Accomplished By" />
                            {errors.accomplished_by && <span className={errorStyle}>{errors.accomplished_by.message}</span>}
                        </div>

                    </div>

                    <div>
                        {/* LOCATION */}

                        {/* IMAGE */}
                        <div className="flex flex-col items-center gap-2">
                            <label className={labelStyle} >
                                Image
                            </label>
                            <input {...register("attachment", { required: "Image is required" })} multiple={false} accept="*/*" type="file" className="file-input file-input-sm file-input-success w-full " />
                            {attachment?.[0] &&
                            <ImageViewer image={URL.createObjectURL(attachment[0])}/>}
                            {errors.attachment && <span className={errorStyle}>{errors.attachment.message}</span>}

                        </div>

                        <div className="flex relative  flex-col">
                            <label className={labelStyle}>
                                Location
                            </label>
                            <input type="hidden" {...register('lon', { required: "Please Select a location" })} />
                            <input type="hidden" {...register('lat', { required: "Please Select a location" })} />
                            <BiselcoMap
                                markerPopup={`${consumerName ? `${consumerName} "Electric Meter` : ""}`}
                                markerSvg={<ElectricMeter />}
                                consumermeters={lon && lat ? [lon, lat] : undefined}
                                onSelectLocation={(lat, lon) => {
                                    setValue("lat", lat);
                                    setValue("lon", lon);
                                    clearErrors("lat");
                                }} />
                            {imageLocationVerifying && <p className="skeleton w-full absolute top-[50%] left-[20%] text-lg italic font-semibold skeleton-text">Verifying Image Location..</p>}
                            {errors.lat && <span className={errorStyle}>{errors.lat.message}</span>}
                        </div>
                    </div>


                    <div className="col-span-1 sm:col-span-1 md:col-span-2">
                        {/* SUBMIT */}
                        <button type="submit" disabled={isSubmitting} className={`btn w-full btn-accent`}>
                            {isSubmitting ?
                                <p className="skeleton skeleton-text">Submitting..</p>
                                :
                                <p>Submit New Connection</p>
                            }
                        </button>
                    </div>

                </form>
                </div>
            </dialog>
        </>

    )
}

export default NewConnectionForm;