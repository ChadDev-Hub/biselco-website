"use client"
import React, { use, useEffect, useState } from 'react'
import ComplaintsCard from './complaintsCard'
import { useWebsocket } from '@/app/utils/websocketprovider'
import { redirect } from 'next/navigation'

type PromiseType = {
    status?: number;
    data: Complaints[];
}

type ComplaintStatusType = {
    status?: number;
    data: []
}

type Props = {
    complaintsData: Promise<PromiseType>;
    complaintsStatusName: Promise<ComplaintStatusType>;
    serverurl?: string;
}

type Complaints = {
    id: number;
    first_name: string;
    last_name: string;
    user_photo: string;
    subject: string;
    description: string;
    date_time_submitted: string;
    village: string;
    municipality: string;
    location:location,
    status: [];
    latest_status?: string;
    user_status?: string;
}

type location = {
    latitude: number;
    longitude: number;
    srid: number;
}

const ComplaintsContainer = (
    {
        complaintsData,
        complaintsStatusName,
        serverurl
    }: Props
) => {
    // DATA INITIALIZATION, STREAMING AND STATE MANAGEMENT
    const complaintsInitialData = use(complaintsData)
    const complaintsStatusNameInitialData = use(complaintsStatusName)
    const [complaints, setComplaints] = useState<Complaints[] | []>([]);
    useEffect(() => {
        switch (complaintsInitialData.status) {
            case 401:
                redirect("/landing")
                break;
            case 403:
                redirect("/landing")
                break;
            case 200:
                queueMicrotask(() =>
                    setComplaints(complaintsInitialData.data));
                break;  
            default:
                break;
        }
    }, [complaintsInitialData])

    // WEBSOCKET
    const message = useWebsocket();
    useEffect(() => {
        if (!message) return
        switch (message.detail) {
            case "complaints":
                queueMicrotask(() =>
                    setComplaints((prev) => {
                        const existing_complaint = prev.filter((complaint) => complaint.id !== message.data.id);
                        return [message.data, ...existing_complaint]
                    })
                )
                break;
            case "complaint_status":
                queueMicrotask(() =>
                    setComplaints((prev) => {
                        return prev.map((complaint) =>
                            complaint.id === message.data.id ? { ...complaint, ...message.data } : complaint
                        )
                    }))
                break;
            case "deleted_complaints":
                queueMicrotask(() =>
                    setComplaints((prev) => {
                        return prev.filter((complaint) => complaint.id !== message.data.id)
                    }))
                break;
            default:
                break;
        }
    }, [message]);
    const handleDelete = (id: number) => {
        const updatedComplaints = complaints.filter((complaint) => complaint.id !== id);
        setComplaints(updatedComplaints);
    };

    return (
        <section className='flex flex-col gap-4 w-full items-center'>
            {complaints.map((complaint: Complaints) => (
                <ComplaintsCard
                    key={complaint.id}
                    id={complaint.id}
                    subject={complaint.subject}
                    description={complaint.description}
                    status={complaint.status}
                    date_time_submitted={complaint.date_time_submitted}
                    complaintsStatusName={complaintsStatusNameInitialData.data}
                    serverurl={serverurl}
                    deleteComplaint={handleDelete} />
            ))}
        </section>
    )
}

export default ComplaintsContainer;