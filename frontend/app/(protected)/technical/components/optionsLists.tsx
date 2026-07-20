"use client"
import { use, useEffect, useState } from 'react'
import FormCard from './formCard'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
type Props = {
    initialData: Promise<PromiseType | undefined>
}


type PromiseType = {
    status: number;
    data: TechnicalForms[];
}
type TechnicalForms = {
    id: 1;
    form_name: string;
    form_description: string;
    form_inputs: string[];
}


const TechniclaFormLists = ({ initialData }: Props) => {
    const formsData = use(initialData)
    const [forms, setForms] = useState<TechnicalForms[] | [] | undefined>([]);
    const pathname = usePathname()
    useEffect(() => {
        queueMicrotask(() =>
        setForms(formsData?.data));
    },[formsData])
    
    return (
        <div className='flex flex-col pt-2 w-full justify-center items-center'>
            <div className='grid grid-cols-1 max-w-3xl place-items-center w-full sm:grid-cols-1 md:grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-2 place-content-center'>
                    {forms?.map((form: TechnicalForms) =>
                    (
                        <div key={form.id}>
                            <FormCard cardTitle={form.form_name} cardDescription={form.form_description}>
                                <Link href={`${pathname}/${form.form_name.replace(/\s/g, '-').toLowerCase()}`}
                                    className="btn btn-soft btn-sm"
                                >Submit Report</Link>
                            </FormCard>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default TechniclaFormLists;