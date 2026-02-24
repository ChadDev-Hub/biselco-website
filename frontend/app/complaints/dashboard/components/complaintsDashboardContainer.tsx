"use client"
import React, { useState, useEffect, use } from 'react'
import DashBoardTable from '../../../common/table'
import MapButton from './mapbutton'
import ComplaintStatusButton from './statusButton'
import { useWebsocket } from '@/app/utils/websocketprovider'
import Image from 'next/image'
import { redirect } from 'next/navigation'

type PromiseType = {
    status?: number
    data: Complaint[]}

type Props = {
    data: Promise<PromiseType>
}

type Complaint = {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    user_photo: string;
    subject: string;
    description: string;
    village: string;
    municipality: string;
    location: Location;
    status: status[];
    user_status?: string;

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
    const complaintsIinitialData = use(data)
    const [allComplaints, setallComplaints] = useState<Complaint[] | []>(()=>{
        if (complaintsIinitialData.status === 401) {
            redirect("/landing");
        }
        return complaintsIinitialData.data
    });

    const message = useWebsocket();
    useEffect(() => {
        if (!message) return
        switch (message.detail) {
            case "complaints":
                queueMicrotask(() =>
                setallComplaints((prev) => {
                    const existing_complaint = prev.filter((complaint) => complaint.id !== message.data.id);
                    return [message.data, ...existing_complaint];
                }));
                break;
            case "complaint_status":
                queueMicrotask(() =>
                setallComplaints((prev) => {
                     return prev.map((complaint) =>
                        complaint.id === message.data.id ? { ...complaint, ...message.data } : complaint
                    )
                }))
                break;
            case "deleted_complaint":
                queueMicrotask(() =>
                setallComplaints((prev) => {
                    return prev.filter((complaint) => complaint.id !== message.data.id);
                }));
                break;
            case "presence":
                queueMicrotask(() =>
                setallComplaints((prev) => {
                    return prev.map((complaint)=>
                        complaint.user_id === message.data.user_id ? {...complaint, ...message.data} : complaint
                    )
                }))
                break;
            default:
                break;
        }
    }, [message])
    console.log(allComplaints)
    return (
        <>
            <DashBoardTable>
                <thead className='text-md font-bold text-center text-yellow-400'>
                    <tr >
                        <th>id</th>
                        <th>Profile</th>
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
                            <td>
                                <div className={`avatar avatar-${complaint.user_status}`}>
                                    <div className='w-8'>
                                        <Image
                                            src={complaint.user_photo}
                                            alt="User Photo"
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                        />
                                    </div>
                                </div>
                            </td>
                            <td>{complaint.first_name}</td>
                            <td>{complaint.last_name}</td>
                            <td>{complaint.subject}</td>
                            <td>{complaint.description}</td>
                            <td>{complaint.village}</td>
                            <td>{complaint.municipality}</td>
                            <td className='text-center'>
                                <MapButton location={complaint.location} />
                            </td>
                            <td className='text-center'>
                                <ComplaintStatusButton
                                    user_id={complaint.user_id}
                                    status={complaint.status}
                                    complaints_id={complaint.id} />
                            </td>
                            <td className='animate-pulse text-green-500 font-bold'>{
                                complaint.status.find((stats) => stats.status_id === Math.max(...complaint.status.map((stats) => stats.status_id)))?.name
                            }</td>
                        </tr>
                    ))}
                </tbody>
            </DashBoardTable>

        </>

    )
}
export default ComplaintsContainer;
