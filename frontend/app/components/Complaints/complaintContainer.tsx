"use client"
import React, { useEffect, useState } from 'react'
import ComplaintsCard from './complaintsCard'
import { useWebsocket } from '@/app/utils/websocketprovider'


type Props = {
    complaintsData:Complaints[];
    complaintsStatusName:[];
    serverurl?:string;
}

type Complaints = {
    id: number;
    user_id : number;
    first_name:string;
    last_name:string;
    subject: string;
    description: string;
    village: string; 
    municipality: string;
    location: {
        latitude: number;
        longitude: number;
        srid: number;
    }
    status: [];
}

const ComplaintsContainer = (
    {
        complaintsData,
        complaintsStatusName,
        serverurl
    }:Props
) => {
    const [complaints, setComplaints] = useState<Complaints[]>(complaintsData);
    const message = useWebsocket();
    console.log(message)
    useEffect(()=>{
        if (!message) return
        if (message.detail === "complaints") {
            const newComplaints = async() => {
                    setComplaints((prev) => {
                    const existing_complaint = prev.filter((complaint) => complaint.id !== message.data.id);                   
                    return [message.data, ...existing_complaint];});
            }
            newComplaints();
        }
    },[message]);
    const handleDelete = (id: number) => {
        const updatedComplaints = complaints.filter((complaint) => complaint.id !== id);
        setComplaints(updatedComplaints);
    };
  return (
    <section className='flex flex-col gap-4 w-full items-center'>
         {complaints.map((complaint: Complaints) => (
        <ComplaintsCard 
        key={complaint.id}
        id ={complaint.id}
        subject={complaint.subject} 
        description={complaint.description}
        status={complaint.status}
        complaintsStatusName={complaintsStatusName}
        serverurl={serverurl}
        deleteComplaint={handleDelete}/>
    ))}

    </section>
  )
}

export default ComplaintsContainer;