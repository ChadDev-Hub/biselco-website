"use client"

import React, { useState } from 'react'
import { UpdateComplaintStatus } from '@/app/services/serverapi';

type Props = {
    name?: string;
    id?: number;
    enabled?: boolean;
    setShowAlert: React.Dispatch<React.SetStateAction<Alerts | null>>
}

type AlertType = "error" | "success"
type Alerts = {
    type: AlertType,
    message: string,

}

const EnableButton = ({ id, name, enabled, setShowAlert }: Props) => {
    const [checked, setChecked] = useState(enabled);
    const handleUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const check = event.target.checked
        console.log(check)
        console.log(id, name)
        if (check) {
            if (!id || !name) return
            const res = await UpdateComplaintStatus(id, name)
            if (res.status === 401) {
                setChecked(false)
                setShowAlert({
                    type: "error",
                    message: res.detail
                })
            } else {
                setChecked(true)
            }
        }
    }

    return (
        <>
            <label className="toggle text-base-content toggle-lg ">
                <input type="checkbox" checked={checked} onChange={handleUpdate} />
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
        </>

    )
}

export default EnableButton