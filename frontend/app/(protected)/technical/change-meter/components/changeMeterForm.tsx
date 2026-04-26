"use client"
import BiselcoMap from "@/app/common/Map"
import { useState, useEffect } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import { useDebounce } from "use-debounce";
import { queryConsumer } from "@/lib/serverFetch";
import Image from "next/image";
import { SubmitChangeMeter } from "@/app/actions/changeMeter";
import { useLoading } from "@/app/common/loadingIndication";
import { useSearchParams } from "next/navigation";
import { Archivo_Black } from "next/font/google";
import ElectricMeter from "../../components/electricMeterSvg";
type FormField = {
    dateAccomplished: string;
    accountNumber: string;
    consumerName: string;
    pullOutMeterNumber: string;
    pullOutMeterBrand: string;
    pullOutMeterReading: number;
    NewMeterNumber: string;
    NewMeterBrand: string;
    NewMeterSealed: string;
    InitialMeterReading: number;
    lat: number | undefined;
    lon: number | undefined;
    remarks: string | undefined;
    accomplishedBy: string;
    attachment?: File;
}

type Consumer = {
    account_name: string;
    account_no: string;
    meter_brand: string;
    meter_no: string;
    municipality: string;
    village: string;
    geolocation: Location;
}

type Location = {
    type: string;
    coordinates: [number, number];
}

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

const ChangeMeterForm = () => {
    const { register, control, handleSubmit, setValue, reset, setError, formState: { errors, isSubmitting } } = useForm<FormField>();
    const [consumer, setConsumer] = useState<Consumer[]>([]);
    const [selectedConsumer, setSelectedConsumer] = useState<string>("");
    const { showLoading } = useLoading();
    const useParams = useSearchParams();
    
    // WATCH COORDINATES
    const lon = useWatch({
        control: control,
        name: "lon"
    })
    const lat = useWatch({
        control: control,
        name: "lat"
    })
    // WATCH ACCOUNT NUMBER INPUT
    const consumerSearch = useWatch({
        control: control,
        name: "accountNumber",
        defaultValue: ""
    });

    // WATH CONSUMER NAME
    const consumerName = useWatch({
        control: control,
        name: "consumerName",
        defaultValue: ""
    });

    // WATCH IMAGE UPLOAD
    const attachment = useWatch({
        control: control,
        name: "attachment"
    })

    useEffect(() => {
        if (consumerSearch === "") {
            setValue("consumerName", "");
            setValue("pullOutMeterNumber", "");
            setValue("pullOutMeterBrand", "");
            setValue("lat", undefined);
            setValue("lon", undefined);
        }
    }, [consumerSearch, setValue]);

    // DEBOUNCE CONSUMER QUERY
    const [debounceSearch] = useDebounce(consumerSearch, 500);

    useEffect(() => {
        if (!debounceSearch) {
            queueMicrotask(() => setConsumer([]));
            return;
        }
        if (debounceSearch === selectedConsumer) {
            queueMicrotask(() => setConsumer([]));
            return;
        }
        const fetchConsumer = async () => {
            const res = await queryConsumer(debounceSearch);
            if (res.status === 200) {
                setConsumer(res.data);
            }
        }
        fetchConsumer();
    }, [debounceSearch, selectedConsumer]);

    // HANDLE SELECTED CONSUMER
    const selectConsumer = (account: Consumer) => {
        setSelectedConsumer(account.account_no);
        setValue("accountNumber", account.account_no);
        setValue("consumerName", account.account_name);
        setValue("pullOutMeterNumber", account.meter_no);
        setValue("pullOutMeterBrand", account.meter_brand);
        setValue("lat", account.geolocation.coordinates[1]);
        setValue("lon", account.geolocation.coordinates[0]);
        setConsumer([]);
    }
    console.log(isSubmitting);
    // HANDLE SUBMIT
    const onSubmit: SubmitHandler<FormField> = async(data) => {
        const NewData = new FormData();
        NewData.append("dateAccomplished", data.dateAccomplished);
        NewData.append("accountNumber", data.accountNumber);
        NewData.append("consumerName", data.consumerName);
        NewData.append("pullOutMeterNumber", data.pullOutMeterNumber);
        NewData.append("pullOutMeterBrand", data.pullOutMeterBrand);
        NewData.append("pullOutMeterReading", data.pullOutMeterReading.toString());
        NewData.append("NewMeterNumber", data.NewMeterNumber);
        NewData.append("NewMeterBrand", data.NewMeterBrand);
        NewData.append("NewMeterSealed", data.NewMeterSealed);
        NewData.append("InitialMeterReading", data.InitialMeterReading.toString());
        NewData.append("lat", data.lat?.toString() ?? "");
        NewData.append("lon", data.lon?.toString() ?? "");
        if(data.remarks?.trim()){NewData.append("remarks", data.remarks)}
        NewData.append("accomplishedBy", data.accomplishedBy);
        if (data.attachment?.[0]) {
            NewData.append("attachment", data.attachment[0]);
        }
        showLoading(true, "Submitting Change Meter...")
        const page = useParams.get("page") as unknown as number;

        const res  =  await SubmitChangeMeter(NewData,page ? page : 1 )
        switch (res?.status) {
            case 201:
                reset();
                showLoading(false);
                break;
            case 403:
                showLoading(false);
                setError("lat", { message: res.data })
                break;
            case 404:
                showLoading(false);
                setError("lon", { message: res.data })
                break;
            default:
                break;
        };
    }

    return (
        <fieldset className='fieldset drop-shadow-md glass rounded-box w-full overflow-y-auto max-w-200 border"'>
            <legend className={`fieldset-legend text-3xl text-blue-800 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}>Change Meter Form</legend>
            <form onSubmit={handleSubmit(onSubmit)} className="flex overflow-x-auto h-full flex-col gap-2 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="">
                        {/* Date Accomplished */}
                        <div>
                            <label className='label font-bold text-md'>
                                Date Accomplished
                            </label>
                            <input
                                {...register('dateAccomplished', { required: true })}
                                title="Date Accomplished"
                                className="input w-full"
                                type="date" />
                            {errors.dateAccomplished && <span className="text-red-500">Date Accomplished is required</span>}
                        </div>
                        {/* Account Number  */}
                        <div className="relative">
                            <label className='label font-bold text-md'>
                                Account Number
                            </label>
                            <input
                                {...register('accountNumber', { required: true })}
                                name="accountNumber"
                                title="Account Number"
                                placeholder="Search Account here..."
                                className="input dropdown  w-full"
                                type="text" />
                            {errors.accountNumber && <span className="text-red-500">Account Number is required</span>}
                            {consumer.length > 0 ?
                                <ul className="dropdown-conten rounded-box drop-shadow-md  grid grid-cols-1 menu absolute max-h-60 overflow-y-auto w-full bg-base-100  z-10">
                                    {consumer.map((item: Consumer) => (
                                        <li key={item.account_no} onClick={() => selectConsumer(item)}>
                                            <a >
                                                {item.account_no} - {item.account_name}
                                            </a>
                                        </li>

                                    ))}
                                </ul> : null}
                        </div>
                        {/* Consumer Name */}
                        <div>
                            <label className="label font-bold text-md">Consumer Name</label>
                            <input {...register('consumerName', { required: "Account Name is required" })} title="Consumer Name" placeholder="Conumer Name" className="input w-full" type="text" />
                            {errors.consumerName && <span className="text-red-500">{errors.consumerName.message}</span>}
                        </div>

                        {/* Pull out Meter */}
                        <div className="flex flex-col gap-1">
                            <label className='label font-bold text-md'>Pullout Meter</label>
                            <input {...register('pullOutMeterNumber', { required: "Please Input Pullout Meters" })} title="Pullout Meter Number" placeholder="Meter Number" className="input w-full" type="text" />
                            {errors.pullOutMeterNumber && <span className="text-red-500">{errors.pullOutMeterNumber.message}</span>}
                            <input {...register('pullOutMeterBrand', { required: "Please Input Pullout Meters" })} title="Pullout Meter Brand" placeholder="Brand" className="input w-full" type="text" />
                            {errors.pullOutMeterBrand && <span className="text-red-500">{errors.pullOutMeterBrand.message}</span>}
                            <input {...register('pullOutMeterReading', { required: "Please Input Pullout Meters" })} title="Pullout Meter Reading" placeholder="Reading" className="input  w-full" type="number" />
                            {errors.pullOutMeterReading && <span className="text-red-500">{errors.pullOutMeterReading.message}</span>}
                        </div>
                        {/* New Meter */}
                        <div className="flex flex-col gap-1">
                            <label className="label font-bold text-md">New Meter</label>
                            <input {...register("NewMeterNumber", { required: "Please Input New Meters" })} title="New Meter Number" placeholder="Meter Number" className="input w-full" type="text" />
                            {errors.NewMeterNumber && <span className="text-red-500">{errors.NewMeterNumber.message}</span>}
                            <input {...register("NewMeterBrand", { required: "Please Input New Meters" })} title="New Meter Brand" placeholder="Brand" className="input w-full" type="text" />
                            {errors.NewMeterNumber && <span className="text-red-500">{errors.NewMeterNumber.message}</span>}
                            <input {...register("NewMeterSealed", { required: "Please Input New Meters" })} title="New Meter Sealed" placeholder="Meter Sealed" className="input  w-full" type="text" />
                            {errors.NewMeterSealed && <span className="text-red-500">{errors.NewMeterSealed.message}</span>}
                            <input {...register("InitialMeterReading", { required: "Please Input New Meters" })} title="New Meter Reading" placeholder="Initial Reading" className="input  w-full" type="number" />
                            {errors.InitialMeterReading && <span className="text-red-500">{errors.InitialMeterReading.message}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        {/* Location */}
                        <div className="border-gray-200 w-full inset-shadow-md shadow drop-shadow-md">
                            <input type="hidden" {...register('lon', { required: "Please Select Location" })} />
                            <input type="hidden" {...register("lat", { required: "Please Select Location" })} />

                            <label className="label font-bold text-md">Location</label>
                            <BiselcoMap
                                markerPopup={`${consumerName ? `${consumerName} Electric Meter` : ""}`}
                                markerSvg={<ElectricMeter />}
                                consumermeters={lon && lat ? [lon, lat] : undefined}
                                onSelectLocation={(lat, lon) => {
                                    setValue("lat", lat);
                                    setValue("lon", lon);
                                }} />
                            {errors.lat && <span className="text-red-500">{errors.lat?.message}</span>}
                        </div>

                        {/* IMAGE */}
                        <div className="flex flex-col self-center items-center justify-center ">
                            <label className="label font-bold text-md"> Upload Image</label>
                            <input capture className="file-input" type="file" accept="image/*" {...register('attachment', { required: "Please Upload Image of the Electric Meter" })} />
                            {errors.attachment && <span className="text-red-500">{errors.attachment.message}</span>}
                            {attachment?.[0] &&
                                <Image src={attachment ? URL.createObjectURL(attachment[0]) : ""}
                                    alt="Image"
                                    width={200}
                                    height={200}
                                    sizes="(min-width: 1024px) 200px, 100vw"
                                    className="max-h-40 w-auto h-auto mt-4 drop-shadow-2xl drop-shadow-gray-700" />
                            }
                        </div>
                    </div>
                    {/* Remarks */}
                    <div>
                        <label className="label font-bold text-md">Remarks</label>
                        <input title="Remarks" {...register('remarks')} placeholder="Remarks" className="input w-full" type="text" />
                    </div>
                    {/* Accomplished By */}
                    <div>
                        <label className="label font-bold text-md"> Accomplished By</label>
                        <input {...register('accomplishedBy', { required: "Input Who Installed the Meter" })} type="text" title="Accomplished by" placeholder="Accomplished By" className="input w-full" />
                        {errors.accomplishedBy && <span className="text-red-500">{errors.accomplishedBy.message}</span>}
                    </div>
                </div>
                 <div className="col-span-1 sm:col-span-1 md:col-span-2">
                    {/* SUBMIT */}
                    <button type="submit" disabled={isSubmitting} className={`btn w-full btn-accent`}>
                        {isSubmitting ?
                            <p className="skeleton skeleton-text">Submitting..</p>
                            :
                            <p>Submit Change Meter</p>
                        }
                    </button>
                </div>
            </form>
        </fieldset>
    )
}

export default ChangeMeterForm;