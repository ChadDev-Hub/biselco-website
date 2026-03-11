
"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce';




const TableSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [input, setInput] = useState(query);

    const [debouncedValue] = useDebounce(input, 500);

    useEffect(()=>{
        if (debouncedValue){
            router.replace(`/complaints/dashboard?q=${debouncedValue}`);
        }else{
            router.replace(`/complaints/dashboard`);
        }
    },[debouncedValue, router])


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
    <input value={input} onChange={handleChange} type="text" className='input input-bordered w-full max-w-xs' placeholder='Search'/>
  )
}

export default TableSearch