"use client"
import React, { useState, useEffect, use } from 'react'

import MapButton from './mapbutton'
import ComplaintStatusButton from './statusButton'
import { useWebsocket } from '@/app/utils/websocketprovider'
import Image from 'next/image'
import { redirect, useSearchParams } from 'next/navigation'
import { useAlert } from '@/app/common/alert'
import MessageDetailView from './messageDetailView'
import { useRouter } from 'next/navigation'





type PromiseType = {
    status?: number
    data: ComplaintsListData
}

type ComplaintsListData ={
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
    const searchParms = useSearchParams();
    const page = Number(searchParms.get("page")) ?? 1;
    const router = useRouter();
    const [activeComplaintsId, setactiveComplaintsId] = useState<number | null>(null)
    const handleSelectedComplaintsId =(complaintsId:number)=>{
        setactiveComplaintsId(complaintsId)
    }

    const {showAlert} = useAlert()
   
    // SET INITIAL DATA ON MOUNT
    useEffect(() => {
        switch (complaintsIinitialData.status) {
            case 404:
                redirect("/landing");
                break;
            case 401:
                redirect("/complaints")
                break;
            case 200:
                queueMicrotask(() =>
                    setallComplaints(complaintsIinitialData.data.data));
                break;
            default:
                break;
        }

    }, [complaintsIinitialData]);
    
    const message = useWebsocket();
    useEffect(() => {
        if (!message) return
        switch (message.detail) {
            case "complaints_admin":
                    console.log(page)
                    if (page !== 1 && page !== 0){
                        showAlert("success", "New Concerns Submitted")
                        return;
                    }
                    else{
                        queueMicrotask(()=>{
                            setallComplaints((prev) => {
                                const existingComplaints = prev.filter((complaint) => complaint.id !== message.data.id);
                                return [message.data, ...existingComplaints].slice(0,10);
                            });
                        })
                    }
                break;
            case "complaint_status":
                queueMicrotask(() =>
                    setallComplaints((prev) => {
                        return prev.map((complaint: Complaint) =>
                            complaint.id === message.data.id ? { ...complaint, ...message.data } : complaint
                        )
                    }))
                break;
            case "deleted_complaints":
                    showAlert("success", "Complaint Deleted")
                    router.refresh();
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
    }, [message,router, showAlert, page]);
    return (

                <tbody className='bg-base-100/45 backdrop-blur-2xl text-xs'>
                    {allComplaints.map((complaint: Complaint, index:number) => (
                        <tr key={complaint.id}>
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
                                <MapButton municipality={complaint.municipality} village={complaint.village} location={complaint.location} />
                            </td>
                            <td className='text-center'>
                                <ComplaintStatusButton
                                    status={allComplaints.find((complaint) => complaint.id === activeComplaintsId)?.status ?? []}
                                    complaints_id={complaint.id}
                                    onOpen={handleSelectedComplaintsId}/>
                            </td>
                            <td className='animate-pulse text-red-700 drop-shadow-md drop-shadow-amber-900 font-bold'>{
                                complaint.latest_status
                            }</td>
                        </tr>
                    ))}
                </tbody>

    )
}
export default ComplaintsContainer;
