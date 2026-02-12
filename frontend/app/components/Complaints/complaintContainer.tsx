"use client"
import React, { useEffect, useState } from 'react'
import ComplaintsCard from './complaintsCard'


type Props = {
    complaintsData:Complaints[];
    complaintsStatusName:[];
    serverurl?:string;
}

type Complaints = {
    id: number;
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

    const [complaints, setComplaints] = useState(complaintsData);
    useEffect(()=>{
        const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKETURL
        const socket = new WebSocket(`${socketUrl}/socket/ws`);
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.detail === "complaints") {
                setComplaints((prev)=> [message.data,...prev]);
            }
        };
        return () => {
            socket.close();
        };
    },[]);

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