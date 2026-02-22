"use client"
import React, { useState, useEffect } from 'react'
import DashBoardTable from '../../../common/table'
import MapButton from './mapbutton'
import ComplaintStatusButton from './statusButton'
import { useWebsocket } from '@/app/utils/websocketprovider'

type Props = {
    data: Complaint[]
}

type Complaint = {
    id: number;
    user_id : number;
    first_name:string;
    last_name:string;
    subject: string;
    description: string;
    village: string;
    municipality: string;
    location: Location;
    status: status[]
}

type Location = {
    latitude: number;
    longitude: number;
    srid: number;
}

type status = {
    id: number;
    complaint_id: number;
    status_id: number;
    name: string;
    description: string;
    date: string;
    time: string;
}




const ComplaintsContainer = ({
    data
}: Props) => {
    const [allComplaints, setallComplaints] = useState<Complaint[]>(data);
    const message = useWebsocket();
    useEffect(() => {
        if (!message) return
        if (message.detail === "complaint_status") {
            queueMicrotask(() => {
                setallComplaints((prev) => {
                    return prev.map((complaint) => 
                        complaint.id === message.data.id? {...complaint, ...message.data} : complaint
                    )
                });
            });
        }
        if (message.detail === "complaints") {
            queueMicrotask(() => {
                setallComplaints((prev) => {
                    const existing_complaint = prev.filter((complaint) => complaint.id !== message.data.id);
                    return [message.data, ...existing_complaint];
                });
            });
        }
    }, [message])
    return (
        <>
            <DashBoardTable>
                <thead className='text-md font-bold text-center text-yellow-400'>
                    <tr >
                        <th>id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <td>Subject</td>
                        <td>Description</td>
                        <td>Village</td>
                        <td>Municipalit</td>
                        <td>Location</td>
                        <td>Update Status</td>
                        <td>Current Status</td>
                    </tr>
                </thead>
                <tbody className='bg-base-100/45 backdrop-blur-2xl text-xs'>
                    {allComplaints.map((complaint) => (
                        <tr key={complaint.id}>
                            <th>{complaint.id}</th>
                            <td>{complaint.first_name}</td>
                            <td>{complaint.last_name}</td>
                            <td>{complaint.subject}</td>
                            <td>{complaint.description}</td>
                            <td>{complaint.village}</td>
                            <td>{complaint.municipality}</td>
                            <td>
                                <MapButton location={complaint.location} />
                            </td>
                            <td>
                                <ComplaintStatusButton
                                    user_id={complaint.user_id}
                                    status={complaint.status}
                                    complaints_id={complaint.id} />
                            </td>
                            <td className='animate-pulse text-green-500 font-bold'>{
                            complaint.status.find((stats)=> stats.status_id === Math.max(...complaint.status.map((stats)=> stats.status_id)))?.name
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </DashBoardTable>

        </>

    )
}
export default ComplaintsContainer;
