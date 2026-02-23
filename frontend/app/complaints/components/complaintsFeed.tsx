"use server"
import React from 'react'
import { UserComplaints, ComplaintStatusName } from '@/lib/serverFetch'
import ComplaintsContainer from './complaintContainer'
import { redirect } from 'next/navigation'

const ComplaintsFeed = async () => {
    const data = await UserComplaints()
    if (data.status === 401){
        redirect("/landing")
    }
    const status = await ComplaintStatusName()
  return (
    <ComplaintsContainer
            complaintsData={data.data}
            complaintsStatusName={status.data} />
  )
}

export default ComplaintsFeed