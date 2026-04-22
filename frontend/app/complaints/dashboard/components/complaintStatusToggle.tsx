"use client"

import React, { useEffect, useState } from 'react'
import { UpdateComplaintStatus, DeleteComplaintStatus } from '@/app/actions/complaint'
import { useAlert } from '@/app/common/alert'
type Props = {
    status_id?: number
    name?: string;
    complaint_id?: number;
    enabled?: boolean;
}



const EnableButton = ({ status_id, complaint_id, name, enabled }: Props) => {
    const [checked, setChecked] = useState(enabled);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        setChecked(enabled)
    }, [enabled])

    // HAND TOGGLE UPDATE OF COMPLAINT STATUS
    const handleUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!complaint_id || !name) return
        if (!complaint_id || !name || !status_id) return
        const check = event.target.checked
        
        setChecked(check)
        setLoading(true)
        try {
            switch (check) {
                case true:
                    
                    const update = await UpdateComplaintStatus(complaint_id, name)
                    if (update?.status === 401) {
                        setChecked(false)
                        showAlert('error', update.data.detail)
                    } else {
                        showAlert('success', update?.data.detail)
                    }
                    break;
                case false:
                    
                    const del = await DeleteComplaintStatus(complaint_id, name, status_id)
                    if (del?.status === 401) {
                        setChecked(true)
                        showAlert('error', del.data.detail)

                    } else {
                        setChecked(false)
                        showAlert('success', del?.data.detail)
                    }
                    break;
                default:
                    break;
            }

        } finally {
            setLoading(false)
        }

    }

    return (
        <>
            <label className={`
                ${loading ? "loading text-start loading-dots loading-xs" : "toggle text-base-content toggle-lg"}
            ${checked ? "toggle-primary border-primary border-2" : "toggle-secondary border-error border-2"}`}>
                <input className={`${loading ? "hidden" : "block"}`} disabled={name?.includes("Received")} type="checkbox" checked={checked} onChange={handleUpdate} />
                <svg className={`${loading ? "hidden" : "block"}`} aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                    fill="green"
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