
"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce';

const TableSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [input, setInput] = useState(query);


    const [debounce] = useDebounce((value:string)=>{
        router.replace(`/complaints/dashboard?q=${value}`);
    },500);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
        debounce(value);
    }

    useEffect(() => {
        if(!query) return
    },[query])
  return (
    <input value={input} onChange={handleChange} type="text" className='input input-bordered w-full max-w-xs' placeholder='Search'/>
  )
}

export default TableSearch