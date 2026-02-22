"use client"

import React, { useState } from 'react'
import { UpdateComplaintStatus, DeleteComplaintStatus  } from '@/app/actions/complaint'

type Props = {
    user_id: number;
    name?: string;
    id?: number;
    enabled?: boolean;
}

type AlertType = "error" | "success"
type Alerts = {
    type: AlertType,
    message: string,

}

const EnableButton = ({ id, name, enabled, user_id }: Props) => {
    const [checked, setChecked] = useState(enabled);
    const handleUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const check = event.target.checked
        if (check) {
            if (!id || !name) return
            const res = await UpdateComplaintStatus(id, name, user_id)
            if (res?.status === 401) {
                setChecked(false)
            } else {
                setChecked(true)
            }
        } 
        if (!check) {
            if (!id || !name) return
            const res = await DeleteComplaintStatus(id,name, user_id)
            if (res?.status === 401) {
                setChecked(true)
            } else {
                setChecked(false)
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