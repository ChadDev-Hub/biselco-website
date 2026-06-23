"use client"

import React, {useState, use, useEffect} from 'react'
import {useDebouncedCallback} from 'use-debounce';
import { useSearchParams, useRouter } from 'next/navigation';
import {Search, Loader} from "lucide-react"

type PromiseType = {
  status: number;
}
type Props = {
  promise: Promise<PromiseType>;
}

const SearchComponent = ({promise}:Props) => {
    const router = useRouter();
    const status = use(promise)
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false)
    
    const debouced = useDebouncedCallback((value)=>{
        const params = new URLSearchParams(searchParams.toString());
        if(value !== "") {params.set("search", value)}
        else params.delete("search");
        router.push(`?${params.toString()}`, { scroll: false });
        setLoading(true);
    }, 500);
    useEffect(()=>{
      const setLoadingTOfalse = () => {
        if(status.status === 200) setLoading(false);}
      setLoadingTOfalse();
    },[status])
  return (
  
        <label className="input input-sm rounded-full w-fit  shadow-sm bg-base-200">
          {loading ? <Loader className="animate-spin  bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text"/>:<Search/>}
          <input
          title="Search"
          type="text"
          onChange={(e) => debouced(e.target.value)}
          placeholder="Search"
          className="w-full"
        />
        </label>
        
    
  )
}

export default SearchComponent;