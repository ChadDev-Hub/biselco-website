
"use client"
import React, { useEffect, useState , use} from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce';


type PromiseType = {
    status: number;
    data: object;
}

type Props = {
    data: Promise<PromiseType>
}


const TableSearch = ({data}:Props) => {
    const complaintsData = use(data);
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '';
    const [input, setInput] = useState(query);
    const [debouncedValue] = useDebounce(input, 500);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        queueMicrotask(()=>{
            setLoading(false);
        })
    },[complaintsData])

   useEffect(() => {
    if (debouncedValue === query) return;

    const params = new URLSearchParams();

    if (debouncedValue) {
        params.set("q", debouncedValue);
    }

    if (page && page !== "1") {
        params.set("page", page);
    }

    const url = `/complaints/dashboard?${params.toString()}`;

    router.replace(url, { scroll: false });
    queueMicrotask(() => setLoading(true));

}, [debouncedValue, router, query, page]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
    }
    
    useEffect(()=>{
        if(query){
            queueMicrotask(()=>{
                setInput(query);
            });  
        };
    },[query])
  return (
    <div className='flex justify-center items-center gap-2'>
        {loading && <span className='loading text-primary loading-spinner'></span>}
        <input value={input} onChange={handleChange} type="text" className='input input-bordered w-full max-w-xs' placeholder='Search'/>
    </div>
    
  )
}
export default TableSearch