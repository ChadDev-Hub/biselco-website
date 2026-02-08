"use client"
import React, { useState } from 'react'
import ComplaintsCard from './complaintsCard'
type Props = {
    complaintsData:[]
    complaintsStatusName:[]
}

const ComplaintsContainer = (
    {
        complaintsData,
        complaintsStatusName
    }:Props
) => {
    const [complaints, setComplaints] = useState(complaintsData);
  return (
    <>
    {complaints.map((complaint: any) => (
        <ComplaintsCard 
        key={complaint.id} 
        subject={complaint.subject} 
        description={complaint.description}
        status={complaint.status}
        complaintsStatusName={complaintsStatusName}/>
    ))}
    </>
  )
}

export default ComplaintsContainer;