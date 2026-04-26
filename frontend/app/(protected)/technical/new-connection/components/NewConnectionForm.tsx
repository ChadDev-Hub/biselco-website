                                                                                                    "use client"

import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import BiselcoMap from "@/app/common/Map"
import Image from "next/image"
import { newConnectionMeter } from "@/app/actions/newConnectionMeter"
import ElectricMeter from "../../components/electricMeterSvg"
import { Archivo_Black } from "next/font/google"
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
    attachment: File | undefined;
    accomplished_by: string
}

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

const NewConnectionForm = () => {
    const { register, setError, control, formState: { errors, isSubmitting }, handleSubmit, setValue, reset, getValues} = useForm<FormField>()
    const attachment = useWatch({ control, name: "attachment" });


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
    const onSubmit: SubmitHandler<FormField> = async () => {
        const data = getValues();
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof FileList){
                form.append(key, value[0]);
            }else{
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
        <fieldset className="fieldset w-full glass rounded-box p-4">
            <legend className={`fieldset-legend text-3xl text-blue-800 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}>New Connection Form</legend>
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
                                const num =Number(v)
                                return isNaN(num) ? undefined : num}})} className="input w-full" />
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
                            setValueAs:(value) => Number(value)})} className="input w-full" />
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
                    <div className="flex flex-col">
                        <label >
                            Location
                        </label>
                        <input type="hidden" {...register('lon', { required: "Please Select a location" })} />
                        <input type="hidden" {...register('lat', { required: "Please Select a location" })} />
                        <BiselcoMap
                            markerPopup={`${consumerName ? `${consumerName} "Electric Meter`: ""}`}
                            markerSvg={<ElectricMeter/>}
                            consumermeters={lon && lat ? [lon, lat] : undefined}
                            onSelectLocation={(lat, lon) => {
                                setValue("lat", lat);
                                setValue("lon", lon);
                            }} />
                        {errors.lat && <span className="text-red-600">{errors.lat.message}</span>}
                    </div>
                    {/* IMAGE */}
                    <div className="flex flex-col">
                        <label >
                            Image
                        </label>
                        <input {...register("attachment", { required: "Image is required" })} multiple={false} accept="image/*" type="file" capture className="file-input w-full" />
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
        </fieldset>
    )
}

export default NewConnectionForm;