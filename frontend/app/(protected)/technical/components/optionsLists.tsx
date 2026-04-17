"use client"
import React, { use, useEffect, useState } from 'react'
import FormCard from './formCard'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/utils/authProvider'
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
    const router = useRouter()
    const currentPath = usePathname()
    const formsData = use(initialData)
    const [forms, setForms] = useState<TechnicalForms[] | [] | undefined>([]);
    const {user} = useAuth();

    useEffect(() => {
        queueMicrotask(() =>
        setForms(formsData?.data));
    },[formsData])
    

    // HANDLE NAVIGATIONS
    const handleNavigation = (formNavigate:string) => {
        const destinationPath = formNavigate.replace(" ", "-").toLowerCase()
        const userRoles = user?.roles.map((r)=>r.name);
        if(!userRoles?.includes("admin")) return;   
        router.push(`${currentPath}/${destinationPath}`);
    };
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  gap-4 w-fit justify-center  items-center mx-4 sm:mx-4 md-mx-20 lg:mx-35'>
                    {forms?.map((form: TechnicalForms) =>
                    (
                        <div key={form.id}>
                            <FormCard cardTitle={form.form_name} cardDescription={form.form_description}>
                                <button onClick={()=>handleNavigation(form.form_name)} type='button' className='btn neutral '>Submit Report</button>
                            </FormCard>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default TechniclaFormLists;