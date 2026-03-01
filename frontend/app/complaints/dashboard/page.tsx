import React, {Suspense, use} from 'react'
import Stats from '@/app/common/status'
import { GetAllComplaints } from '@/lib/serverFetch'
import ComplaintsContainer from './components/complaintsDashboardContainer'
import TableSearch from './components/tableSearch'
import ComplaintDashBoardHeader from './components/header'
const DashBoardPage = ({searchParams}:{searchParams: Promise <{ [key: string]: string}>}) => {
  const params = use(searchParams)
  const complaintsData = GetAllComplaints(params.q)
  return (
    <div className="flex min-h-screen  items-start w-full justify-center bg-zinc-50 font-sans  bg-linear-to-bl from-blue-600 to-yellow-600">
      <main className="
      container
      max-w-300
      p-3
      flex
      gap-4 
      flex-col
      justify-start
      lg:items-center 
      mt-20
      xs:mt-20
      sm:mt-20 
      md:mt-20
      lg:mt-20 
      pb-21">
        <ComplaintDashBoardHeader/>
        <Stats/>
        <div className='flex w-full flex-col justify-center items-center'>
          <TableSearch/>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <ComplaintsContainer data={complaintsData} />
        </Suspense>
        </main>
    </div>
  )
}

export default DashBoardPage;