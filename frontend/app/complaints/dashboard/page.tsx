import React, { Suspense, use } from 'react'
import Stats from './components/status'
import { GetAllComplaints } from '@/lib/serverFetch'
import ComplaintsContainer from './components/complaintsDashboardContainer'
import ComplaintDashBoardHeader from './components/header'
import DashBoardTable from '@/app/common/table'
import TableHead from '@/app/(protected)/technical/change-meter/components/tableHead'
import TableFooter from '@/app/(protected)/technical/change-meter/components/tableFooter'
import TableDataSkeleton from '@/app/(protected)/technical/change-meter/components/tableDataSkeleton'
import TableSearch from './components/tableSearch'
import PageNationLoading from '@/app/(protected)/technical/change-meter/components/pageNationSkeleton'

import TableSearchSkeleton from './components/tableSearchSkeleton'
const DashBoardPage = ({ searchParams }: { searchParams: Promise<{ page: number; q: string }> }) => {
  const params = use(searchParams)
  const complaintsData = GetAllComplaints(params.page, params.q)
  const pageUrl = '/complaints/dashboard'
  const columns = [
    'ID',
    'PROFILE',
    'FIRST NAME',
    'LAST NAME',
    'SUBMITTED AT',
    'SUBJECT',
    'DETAILS',
    'VILLAGE',
    'MUNICIPALITY',
    'MAP',
    'STATUS',
    'LATEST UPDATE']
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
        <ComplaintDashBoardHeader />
         <Stats />
       
        
        <fieldset className='fieldset rounded-box'>
          <legend className={`fieldset-legend flex w-full`}>
            <h3 className={`text-sm md:text-2xl text-shadow-md  font-bold  text-blue-800 `}>
              Real-Time Complaints Table
            </h3>
            <Suspense fallback={<TableSearchSkeleton/>}>
              <TableSearch data={complaintsData} />
            </Suspense>
          </legend>
          <DashBoardTable>
            <TableHead columns={columns} selectable={false} />
            <Suspense fallback={
              <TableDataSkeleton />
            }>
              <ComplaintsContainer data={complaintsData} />
            </Suspense>
            <Suspense fallback={<PageNationLoading />}>
              <TableFooter data={complaintsData} pageUrl={pageUrl} />
            </Suspense>
          </DashBoardTable>
        </fieldset>
      </main>
    </div>
  )
}

export default DashBoardPage;