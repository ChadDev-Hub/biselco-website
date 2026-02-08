"use server"

import React from 'react'
import { UserComplaints } from '../services/serverapi'
import ComplaintsContainer from '../components/Complaints/complaintContainer'
import { ComplaintStatusName } from '../services/serverapi'
import FabIcon from '../components/Fab'
const ComplaintsPage = async() => {
    const complaints = await UserComplaints();
    const complaintsStatusName = await ComplaintStatusName();
  return (
    <div className="flex min-h-screen items-center w-full justify-center bg-zinc-50 font-sans  bg-linear-to-bl from-blue-600 to-yellow-600">
      <main className="

      flex
      
      gap-4 
      flex-col 
      items-stretch 
      lg:items-center 
      mt-20
      xs:mt-20
      sm:mt-20 
      md:mt-20
      lg:mt-20 
      pb-20">
        <ComplaintsContainer complaintsData={complaints} complaintsStatusName={complaintsStatusName}/>
        <FabIcon/>
      </main>
    </div>
  )
}
export default ComplaintsPage;