"use server"
import React from 'react'
import ComplaintsContainer from './complaintsDashboardContainer'
import { GetAllComplaints } from '@/lib/serverFetch'
const DashBoardFeed = async() => {
    const res = await GetAllComplaints()
    return (
        <ComplaintsContainer data={res.data} />
    )
}

export default DashBoardFeed