"use client"
import BiselcoMap from "@/app/common/Map"
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import {useForm, SubmitHandler, useWatch} from "react-hook-form"
import { useDebounce } from "use-debounce";

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
    remarks: string;
    accomplishedBy: string;
    attachmend?: File;
}

type Consumer = {
    account_name: string;
    account_no: string;
    meter_brand: string;
    meter_no: string; 
    municipality: string;
    village: string;
    location: Location;
}

type Location = {
    type: string;
    coordinates: [number, number];
}

type Props = { 
    data:Consumer;
}
const ChangeMeterForm = ({data}: Props) => {
    const {register,control, handleSubmit, setValue, formState: { errors }} = useForm<FormField>();
    const router = useRouter();
    const [consumer, setConsumer] = useState(data);

    // WATCH ACCOUNT NUMBER INPUT
    const consumerSearch = useWatch({
        control: control,
        name: "accountNumber",
        defaultValue: ""
    });

    // DEBOUNCE CONSUMER QUERY
    const [debounceSearch] = useDebounce(consumerSearch, 500);
    useEffect(() => {
        if(debounceSearch){
            router.replace("/technical/change-meter?consumerSearch=" + debounceSearch);
        }
        else{ 
            router.replace("/technical/change-meter");
        }
    }, [debounceSearch, router]);


    // HANDLE SUBMIT
    const onSubmit: SubmitHandler<FormField> = (data) => 
        console.log(data);

    return (
        <fieldset className='fieldset drop-shadow-md shadow-md bg-base-200 border-base-300 rounded-box w-full max-w-md border"'>
            <legend className='fieldset-legend text-3xl'>Change Meter Form</legend>
            <form onSubmit={handleSubmit(onSubmit)} className="flex overflow-x-auto max-h-140 flex-col gap-2 p-4">
                {/* Date Accomplished */}
                <div>
                    <label className='label font-bold text-md'>
                        Date Accomplished
                    </label>
                    <input 
                    {...register('dateAccomplished', {required: true})}
                    title="Date Accomplished"
                    className="input w-full" 
                    type="date" />
                    {errors.dateAccomplished && <span className="text-red-500">Date Accomplished is required</span>}
                </div>
                {/* Account Number  */}
                <div>
                    <label className='label font-bold text-md'>
                        Account Number
                    </label>
                    <input
                    {...register('accountNumber', {required: true})}
                    name="accountNumber" 
                    title="Account Number" 
                    placeholder="Search Account here..." 
                    className="input w-full" 
                    type="text" />
                    {errors.accountNumber && <span className="text-red-500">Account Number is required</span>}
                </div>
                {/* Consumer Name */}
                <div>
                    <label className="label font-bold text-md">Consumer Name</label>
                    <input title="Consumer Name" placeholder="Conumer Name" className="input w-full" type="text" />
                </div>

                {/* Pull out Meter */}
                <div className="flex flex-col gap-1">
                    <label className='label font-bold text-md'>Pullout Meter</label>
                    <input title="Pullout Meter Number" placeholder="Meter Number" className="input w-full" type="text" />
                    <input title="Pullout Meter Number" placeholder="Brand" className="input w-full" type="text" />
                    <input  title="Pullout Meter Reading" placeholder="Reading" className="input  w-full" type="number" />
                </div>
                {/* New Meter */}
                <div className="flex flex-col gap-1">
                    <label className="label font-bold text-md">New Meter</label>
                    <input title="New Meter Number" placeholder="Meter Number" className="input w-full" type="text" />
                    <input title="New Meter Number" placeholder="Brand" className="input w-full" type="text" />
                    <input  title="New Meter Sealed" placeholder="Meter Sealed" className="input  w-full" type="number" />
                    <input  title="New Meter Reading" placeholder="Initial Reading" className="input  w-full" type="number" />
                </div>
                {/* Location */}
                <div>
                    <label className="label font-bold text-md">Location</label>
                    <BiselcoMap />
                </div>
                {/* Remarks */}
                <div>
                    <label className="label font-bold text-md">Remarks</label>
                    <input title="Consumer Name" placeholder="Conumer Name" className="input w-full" type="text" />
                </div>
                {/* Accomplished By */}
                <div>
                    <label className="label font-bold text-md"> Accomplished By</label>
                    <input type="text" title="Accomplished by" placeholder="Accomplished By" className="input w-full" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </fieldset>
    )
}

export default ChangeMeterForm