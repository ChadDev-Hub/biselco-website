"use client"
import React, { useState, useEffect, use } from 'react'
import DashBoardTable from '../../../common/table'
import MapButton from './mapbutton'
import ComplaintStatusButton from './statusButton'
import { useWebsocket } from '@/app/utils/websocketprovider'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Fascinate } from 'next/font/google'
import MessageDetailView from './messageDetailView'
import TableSearch from './tableSearch'
const fascinate = Fascinate({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-fascinate'
},
)

type PromiseType = {
    status?: number
    data: Complaint[]
}

type Props = {
    data: Promise<PromiseType>;
}

type Complaint = {
    id: number;
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
    latest_status?: string;
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
        switch (complaintsIinitialData.status) {
            case 404:
                redirect("/landing");
                break;
            case 401:
                redirect("/complaints")
            default:
                break;
        }
        queueMicrotask(() =>
            setallComplaints(complaintsIinitialData.data));
    }, [complaintsIinitialData]);
    const message = useWebsocket();
    console.log(allComplaints)
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
            case "deleted_complaints":
                queueMicrotask(() =>
                    setallComplaints((prev) => {
                        return prev.filter((complaint) => complaint.id !== message.data.id);
                    }));
                break;
            case "presence":
                queueMicrotask(() =>
                    setallComplaints((prev) => {
                        return prev.map((complaint) =>
                            complaint.user_id === message.data.user_id ? { ...complaint, ...message.data } : complaint
                        )
                    }))
                break;
            default:
                break;
        }
    }, [message])
    return (
        <><fieldset className='fieldset rounded-box'>
            <legend className={`fieldset-legend flex w-full`}>
                <h3 className={`text-sm md:text-2xl text-shadow-md  font-bold  text-blue-800 ${fascinate.className}`}>
                    Real-Time Complaints Table
                </h3>
                <TableSearch />
            </legend>
            <DashBoardTable>
                <thead className='text-md font-bold text-center text-yellow-400'>
                    <tr >
                        <th>id</th>
                        <td>Profile</td>
                        <td>First Name</td>
                        <td>Last Name</td>
                        <td className='min-w-50'>Submitted At</td>
                        <td className='min-w-60'>Subject</td>
                        <td>Description</td>
                        <td className='min-w-50'>Village</td>
                        <td>Municipalit</td>
                        <td>Location</td>
                        <td>Update Status</td>
                        <td>Current Status</td>
                    </tr>
                </thead>
                <tbody className='bg-base-100/45 backdrop-blur-2xl text-xs'>
                    {allComplaints.map((complaint: Complaint, index: number) => (
                        <tr key={index}>
                            <th className='z-10'>{index}</th>
                            <td>
                                <div className={`avatar avatar-${complaint.user_status}`}>
                                    <div className='w-8'>
                                        <Image
                                            src={complaint.user_photo ?? "https://img.daisyui.com/images/profile/demo/distracted1@192.webp"}
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
                            <td className='w-full'>{complaint.subject}</td>
                            <td className='flex justify-center  w-full'>
                                <MessageDetailView complaintDescription={complaint.description} />
                            </td>
                            <td>{complaint.village}</td>
                            <td>{complaint.municipality}</td>
                            <td align='center'>
                                <MapButton location={complaint.location} />
                            </td>
                            <td className='text-center'>
                                <ComplaintStatusButton
                                    status={complaint.status}
                                    complaints_id={complaint.id} />
                            </td>
                            <td className='animate-pulse text-red-700 drop-shadow-md drop-shadow-amber-900 font-bold'>{
                                complaint.latest_status
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
