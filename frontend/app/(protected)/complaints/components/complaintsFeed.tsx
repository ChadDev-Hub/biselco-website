"use server"
import React from 'react'
import { UserComplaints, ComplaintStatusName } from '@/lib/serverFetch'
import ComplaintsContainer from './complaintContainer'
type Props = {}

const ComplaintsFeed = async (props: Props) => {
    const data = await UserComplaints()
    const status = await ComplaintStatusName()
  return (
    <ComplaintsContainer
            complaintsData={data.data}
            complaintsStatusName={status.data} />
  )
}

export default ComplaintsFeed