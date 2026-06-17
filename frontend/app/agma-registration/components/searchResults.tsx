"use client";

import React, { useState, useEffect,} from "react";
import { useDebounce } from "use-debounce";
import { useAuth } from "@/app/utils/authProvider";
import { queryConsumer } from "../../../lib/consumer-meter";
import {Consumer} from "@/types/consumer-meter";
import {UseFormSetValue} from "react-hook-form";
import {FormType} from "@/types/agma";

type Props = {
  input: string;
  setValue?:UseFormSetValue<FormType>

};

const SearchResults = ({ input, setValue}: Props) => {
  const { user } = useAuth();
  const [results, setResults] = useState<Consumer[] | []>([]);
  const [debounceValue] = useDebounce(input, 500);
  const [isLoading, setIsLoading] = useState(false);
  const listClassName="hover:bg-base-300 cursor-pointer border border-slate-300 border-dashed text-sm z-50"
  useEffect(()=>{
    if(!user) return
    if(!user.roles.map(role=>role.name).includes("admin")) return
    if(!debounceValue){
        queueMicrotask(() =>{ 
            setIsLoading(false)
            setResults([])
            if(setValue) setValue("name","");
        });
        
    }
    if(debounceValue){
        queueMicrotask(() => setIsLoading(true));
        const fetch  = async() => {
            const res = await queryConsumer(debounceValue);
            if(res.status === 200){
                setIsLoading(false);
                setResults(res.data);
            }
        }
        fetch();
    }
  },[debounceValue,user, setValue])

  if(isLoading) return <div className={`${listClassName} w-full`}>Loading...</div>

  const handleSection = (account_no:string, account_name:string) => {
    if(setValue){
        setValue("account_no", account_no);
        setValue("name", account_name);
    }
  }
  return (
    <>
    {results.length > 0 ? 
        <ul className="dropdown-content max-h-96 overflow-y-scroll  w-full  p-2 shadow bg-base-100 rounded-box z-50">
            {results.map((consumer:Consumer, index:number)=>(
                <li  onPointerDown={()=>handleSection(consumer.account_no, consumer.account_name)} className={listClassName} key={index}>
                    <span>{consumer.account_no} | {consumer.account_name} | {consumer.village}</span>
                </li>
            ))}
        </ul> : null
    }
    </>
  );
};

export default SearchResults;
