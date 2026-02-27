"use client"
import React, { useState, useEffect, use } from 'react'
import DashBoardTable from '../../../common/table'
import MapButton from './mapbutton'
import ComplaintStatusButton from './statusButton'
import { useWebsocket } from '@/app/utils/websocketprovider'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Fascinate } from 'next/font/google'


const fascinate = Fascinate({weight: '400',
     subsets: ['latin'],
    variable: '--font-fascinate'},
    )

type PromiseType = {
    status?: number
    data: Complaint[]}

type Props = {
    data: Promise<PromiseType>;
}

type Complaint = {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    user_photo: string;
    subject: string;
    description: string;
    date_time_submitted: string;
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
    const [allComplaints, setallComplaints] = useState<Complaint[] | []>([]);

    // SET INITIAL DATA ON MOUNT
    useEffect(() => {
        if (complaintsIinitialData.status === 401) {
            redirect("/landing");
        }
        queueMicrotask(() =>
        setallComplaints(complaintsIinitialData.data));
    }, [complaintsIinitialData]);

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
    return (
        <><fieldset className='fieldset rounded-box'>
            <legend className={`fieldset-legend text-2xl text-shadow-md  font-bold  text-blue-800 ${fascinate.className}`}>Complaints Table</legend>
            <DashBoardTable>
                <thead className='text-md font-bold text-center text-yellow-400'>
                    <tr >
                        <th>id</th>
                        <td>Profile</td>
                        <td>First Name</td>
                        <td>Last Name</td>
                        <td className='min-w-50'>Submitted At</td>
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
                    {allComplaints.map((complaint, index) => (
                        <tr key={index}>
                            <th>{index}</th>
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
                            <td >{complaint.date_time_submitted}</td>
                            <td className='overflow-x-scroll'>{complaint.subject}</td>
                            <td className='flex h-20  overflow-x-scroll'>{complaint.description}</td>
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
        </fieldset>
            

        </>

    )
}
export default ComplaintsContainer;
