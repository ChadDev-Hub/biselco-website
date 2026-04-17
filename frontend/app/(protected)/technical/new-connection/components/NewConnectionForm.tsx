"use client"

import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import BiselcoMap from "@/app/common/Map"
import Image from "next/image"
import { newConnectionMeter } from "@/app/actions/newConnectionMeter"
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
    image: File | undefined;
    accomplished_by: string

}
const NewConnectionForm = () => {
    const { register, control, formState: { errors, isValid }, handleSubmit, setValue } = useForm<FormField>()
    const attachment = useWatch({ control, name: "image" })
    const onSubmit: SubmitHandler<FormField> = (data) => {
        if (isValid) {
            const form = new FormData();
            console.log(data)
            Object.entries(data).forEach(([key, value]) => {
                if (value == null) return;

                form.append(
                    key,
                    value instanceof FileList ? value[0] : String(value)
                );
            })
            newConnectionMeter(form);

        }
    }

    return (
        <fieldset className="fieldset w-full glass rounded-box p-4">
            <legend className="fieldset-legend">
                <h2 className="text-3xl text-blue-800 text-shadow-md text-shadow-amber-600">
                    New Connection Form
                </h2>
            </legend>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">

                <div>
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
                        <input type="number" accept="number" {...register("initial_reading", { valueAsNumber: true, required: "Initial Reading is required" })} className="input w-full" />
                        {errors.initial_reading && <span className="text-red-600">{errors.initial_reading.message}</span>}
                    </div>

                    {/* MULTIPLIER */}
                    <div className="flex flex-col">
                        <label>
                            Multiplier
                        </label>
                        <input type="number" accept="number" defaultValue={1} {...register("multiplier", { valueAsNumber: true, required: "Multiplier is required" })} className="input w-full" />
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
                        <input {...register("image", { required: "Image is required" })} multiple={false} accept="image/*" type="file" capture className="file-input w-full" />
                        {attachment?.[0] &&
                            <Image
                                src={attachment ? URL.createObjectURL(attachment[0]) : ""}
                                alt="Attachment"
                                width={200}
                                height={200}
                                sizes="(min-width: 1024px) 200px, 100vw"
                                className="max-h-40 w-auto h-auto mt-4 drop-shadow-2xl drop-shadow-gray-700" />}
                        {errors.image && <span className="text-red-600">{errors.image.message}</span>}
                    </div>


                    

                </div>


                <div className="col-span-2">
                    {/* SUBMIT */}
                <button type="submit" className="btn w-full btn-accent">
                    Submit New Connection
                </button>

                </div>
                
            </form>
        </fieldset>
    )
}

export default NewConnectionForm;