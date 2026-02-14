"use client"

import React, { useState} from 'react'


type Props = {
    func?: (id:number, name:string, activated:boolean) => void
    name?:string;
    id?:number;
    enabled?:boolean
}
const EnableButton = ({func, id, enabled, name}: Props) => {
    const [checked, setChecked] = useState(enabled);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (func === undefined) return
        if (id === undefined) return
        if (name === undefined) return
        func(id, name, checked?false:true)
        setChecked(!checked)

    }
    
    return (
        <label className="toggle text-base-content toggle-lg ">
            <input type="checkbox" checked={checked} onChange={handleChange}/>
            <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g  
                    width={15}
                    height={15}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth={4}
                    fill="none"
                    stroke="currentColor"
                >
                    <path d="M20 6 9 17l-5-5"></path>
                </g>
            </svg>
            <svg
                width={15}
                height={15}
                aria-label="disabled"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
            </svg>
        </label>
    )
}

export default EnableButton