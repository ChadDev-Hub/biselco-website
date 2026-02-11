import React, { useState } from 'react'
import BiselcoMap from '../Map'
import { PostComplaints } from '@/app/services/serverapi'



const ComplaintsForm = () => {
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);

    // INITIALIZE NEW FORM
    // HANDLE SUBMIT
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formdata = new FormData();
        const form = e.currentTarget;
        formdata.append('subject', form.subject.value as string);
        formdata.append('description', form.description.value as string);
        formdata.append('latitude', lat.toFixed(10));
        formdata.append('longitude', long.toFixed(10));
        const result = await PostComplaints(formdata);
        console.log(result)
        if (result.status === 201) {
            form.reset();
            const modal = document.getElementById('complaints-modal') as HTMLDialogElement;
            if (modal) {
                modal.close();
            };
        };
    };

    return (
        <form action="" onSubmit={handleSubmit} id='complaints-form' className='w-full lg:w-160 flex flex-col gap-4' >

            <label className="label">
                <span className="label-text text-shadow-2xs font-bold">Complaints</span>
            </label>

            <input
                name='subject'
                title='Complaint Sucject'
                required type="text"
                placeholder="Subject"
                className="input input-bordered rounded-full w-full" />
            <textarea 
            name='description' 
            title='Complaints Description' 
            placeholder='Your Complaints' 
            className='input min-h-50 rounded-md w-full'>
            </textarea>



            <BiselcoMap
                onSelectLocation={(lat, long) => {
                    setLat(lat);
                    setLong(long);
                }}
            />

            <button type='submit' className='btn btn-success rounded-full w-full px-5 mt-2.5'>Submit Complaints</button>
        </form>
    )
}

export default ComplaintsForm