"use client"
import React, { use, useState } from 'react'
import FormCard from './formCard'


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
    const [forms, setForms] = useState<TechnicalForms[] | [] | undefined>(() => {
        return formsData?.data
    });
    return (
        <>
            <div className='flex flex-wrap  gap-4 w-fit justify-self-start  items-center mx-4 sm:mx-4 md-mx-10 lg:mx-37'>
                    {forms?.map((form: TechnicalForms) =>
                    (
                        <div key={form.id}>
                            <FormCard cardTitle={form.form_name} cardDescription={form.form_description}>
                                <button type='button' className='btn neutral '>Submit Report</button>
                                <button type='button' className='btn btn-primary'>View Data</button>
                            </FormCard>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default TechniclaFormLists;