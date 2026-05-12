"use client"

import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import BiselcoMap from "@/app/common/Map"
import Image from "next/image"
import { newConnectionMeter } from "@/app/actions/newConnectionMeter"
import ElectricMeter from "../../components/electricMeterSvg"
import { Archivo_Black } from "next/font/google"
import { CheckImageLocation } from "@/app/actions/newConnectionMeter"
import { useEffect, useRef, useState } from "react"
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

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

const NewConnectionForm = () => {
    const { register, clearErrors, setError, control, formState: { errors, isSubmitting }, handleSubmit, setValue, reset, getValues } = useForm<FormField>()
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const attachment = useWatch({ control, name: "attachment" });
    const [imageLocationVerifying, setImageLocationVerifying] = useState(false);

    const handleClose = () => modalRef?.current?.close();
    const handleOpen = () => modalRef?.current?.showModal();

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
            const result = await CheckImageLocation(attachment[0]);
            switch (result?.status) {
                case 200:
                    setValue("lat", result.data.lat);
                    setValue("lon", result.data.lon);
                    clearErrors("lat");
                    setImageLocationVerifying(false);
                    break;
                case 404:
                    setError("lat", { message: result.data })
                    setValue("lon", undefined)
                    setValue("lat", undefined)
                    setImageLocationVerifying(false);
                    break
                default:
                    break;
            }
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
                className="btn btn-primary btn-circle btn-sm tooltip tooltip-right tooltip-xs"
            >
                <svg
                    width={25}
                    height={25}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                            d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                            stroke="#1C274C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        ></path>{" "}
                        <path
                            d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                            stroke="#1C274C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        ></path>{" "}
                    </g>
                </svg>
            </button>
            <dialog ref={modalRef} className="modal  xl:px-20  modal-bottom">
                <div className='px-2 w-full  modal-box border drop-shadow-md z-10   glass rounded-box  border"'>

                <div
                    className={`sticky top-0 text-lg text-blue-800 pb-2 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}
                >
                    New Connection Form
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn absolute z-100 top-1 right-2 btn-xs btn-circle"
                    >
                        X
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">

                    <div >
                        {/* DATE */}
                        <div className="flex flex-col">
                            <label className="label">
                                Date Accomplished
                            </label>
                            <input {...register("date", { required: "Date is required" })} type="date" className="input w-full" />
                            {errors.date && <span className="text-red-500">{errors.date.message}</span>}
                        </div>
                        {/* CONSUMER NAME */}
                        <div className="flex flex-col">
                            <label >
                                Consumer Name
                            </label>
                            <input {...register("consumer_name", { required: "Please enter consumer name" })} type="text" className="input w-full" />
                            {errors.consumer_name && <span className="text-red-500">{errors.consumer_name.message}</span>}
                        </div>

                        {/* METER SERIAL NUMBER */}
                        <div className="flex flex-col">
                            <label >
                                Meter Serial Number
                            </label>
                            <input {...register("meter_serial_number", { required: "Please enter correct Seriral Number" })} type="text" className="input w-full" />
                            {errors.meter_serial_number && <span className="text-red-500">{errors.meter_serial_number.message}</span>}
                        </div>

                        {/* METER BRAND*/}
                        <div className="flex flex-col">
                            <label >
                                Meter Brand
                            </label>
                            <input {...register("meter_brand", { required: "Please enter meter brand" })} type="text" className="input w-full" />
                            {errors.meter_brand && <span className="text-red-500">{errors.meter_brand.message}</span>}
                        </div>

                        {/* METER SEALED */}
                        <div className="flex flex-col">
                            <label >
                                Meter Sealed
                            </label>
                            <input {...register("meter_sealed")} type="text" className="input w-full" />
                        </div>

                        {/* INITIAL READING */}
                        <div className="flex flex-col">
                            <label>
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
                            })} className="input w-full" />
                            {errors.initial_reading && <span className="text-red-600">{errors.initial_reading.message}</span>}
                        </div>

                        {/* MULTIPLIER */}
                        <div className="flex flex-col">
                            <label>
                                Multiplier
                            </label>
                            <input type="number" accept="number" defaultValue={1} {...register("multiplier", {
                                valueAsNumber: true,
                                required: "Multiplier is required",
                                setValueAs: (value) => Number(value)
                            })} className="input w-full" />
                            {errors.multiplier && <span className="text-red-600">{errors.multiplier.message}</span>}
                        </div>

                        {/* REMARKS */}
                        <div className="flex flex-col h-fit">
                            <label >
                                Remarks
                            </label>
                            <textarea {...register("remarks")} className="textarea w-full" />
                        </div>

                        {/* ACCOMPLISHED BY */}
                        <div>
                            <label>
                                Accomplished By
                            </label>
                            <input {...register("accomplished_by", { required: "Accomplished By is required" })} type="text" className="input w-full" />
                            {errors.accomplished_by && <span className="text-red-600">{errors.accomplished_by.message}</span>}
                        </div>

                    </div>

                    <div>
                        {/* LOCATION */}

                        {/* IMAGE */}
                        <div className="flex flex-col">
                            <label >
                                Image
                            </label>
                            <input {...register("attachment", { required: "Image is required" })} multiple={false} accept="image/*" type="file" className="file-input w-full " />
                            {attachment?.[0] &&
                                <Image
                                    src={attachment ? URL.createObjectURL(attachment[0]) : ""}
                                    alt="Attachment"
                                    width={200}
                                    height={200}
                                    sizes="(min-width: 1024px) 200px, 100vw"
                                    className="max-h-40 w-auto h-auto mt-4 drop-shadow-2xl drop-shadow-gray-700" />}
                            {errors.attachment && <span className="text-red-600">{errors.attachment.message}</span>}

                        </div>

                        <div className="flex relative  flex-col">
                            <label >
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
                            {errors.lat && <span className="text-red-600">{errors.lat.message}</span>}
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