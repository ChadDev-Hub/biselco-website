"use client"
import React, { useState } from 'react'
import ComplaintsCard from './complaintsCard'
type Props = {
    complaintsData:[]
}

const ComplaintsContainer = (
    {complaintsData}:Props
) => {
    const [complaints, setComplaints] = useState(complaintsData);

  return (
    <>
    {complaints.map((complaint: any) => (
        <ComplaintsCard key={complaint.id} subject={complaint.subject} description={complaint.description}/>
    ))}
    </>
  )
}

export default ComplaintsContainer;