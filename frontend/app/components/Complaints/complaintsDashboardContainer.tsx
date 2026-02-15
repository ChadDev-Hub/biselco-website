"use client"
import React, { useState, useEffect } from 'react'
import DashBoardTable from '../table'
import MapButton from './mapbutton'
import ComplaintStatusButton from './statusButton'
import AlertComponent from '../alert'
import { time } from 'console'
type Props = {
    data: Complaint[]
}

type Complaint = {
    id: number;
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
    name: string;
    description: string;
    date: string;
    time: string;
}


type AlertType = "error" | "success"
type Alerts = {
    type: AlertType,
    message: string,

}

const ComplaintsContainer = ({
    data
}: Props) => {
    const [complaints, setComplaints] = useState<Complaint[]>(data);
    const [showAlert, setShowAlert] = useState<Alerts | null>(null);
    useEffect(() => {
        if (!showAlert) return
        const timeout = setTimeout(() => {
                setShowAlert(null)
            }, 3000)
        return () => clearTimeout(timeout)
    }, [showAlert])
    return (
        <>
        {showAlert && <AlertComponent
        alertstyle={showAlert?.type}
        message={showAlert?.message}/>}
        <DashBoardTable>
            <thead className='text-md font-bold text-center text-yellow-400'>
                <tr >
                    <th>id</th>
                    <td>Subject</td>
                    <td>Description</td>
                    <td>Village</td>
                    <td>Municipalit</td>
                    <td>Location</td>
                    <td>Status</td>
                </tr>
            </thead>
            <tbody className='bg-base-100/45 backdrop-blur-2xl text-xs'>
                {complaints.map((complaint) => (
                    <tr key={complaint.id}>
                        <th>{complaint.id}</th>
                        <td>{complaint.subject}</td>
                        <td>{complaint.description}</td>
                        <td>{complaint.village}</td>
                        <td>{complaint.municipality}</td>
                        <td>
                            <MapButton location={complaint.location}/>
                        </td>
                        <td>
                            <ComplaintStatusButton 
                            status={complaint.status}
                            complaints_id={complaint.id}
                            setShowAlert={setShowAlert}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </DashBoardTable>
        
        </>
        
    )
}
export default ComplaintsContainer
