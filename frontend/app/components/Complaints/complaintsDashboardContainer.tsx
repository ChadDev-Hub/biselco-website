"use client"
import React from 'react'
import DashBoardTable from '../table'
import MapButton from './mapbutton'
import ComplaintStatusButton from './statusButton'
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
const ComplaintsContainer = ({
    data
}: Props) => {
    return (
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
                {data.map((complaint) => (
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
                            complaints_id={complaint.id}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </DashBoardTable>
    )
}

export default ComplaintsContainer
