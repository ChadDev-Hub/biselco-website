import React, { Suspense, use } from 'react'
import Stats from './components/status'
import { GetAllComplaints, GetComplaintStats, GetTopComplaints } from '@/lib/serverFetch'
import ComplaintsContainer from './components/complaintsDashboardContainer'
import ComplaintDashBoardHeader from './components/header'
import DashBoardTable from '@/app/common/table'
import TableHead from '@/app/(protected)/technical/change-meter/components/tableHead'
import TableFooter from '@/app/(protected)/technical/change-meter/components/tableFooter'
import TableDataSkeleton from '@/app/(protected)/technical/change-meter/components/tableDataSkeleton'
import TableSearch from './components/tableSearch'
import PageNationLoading from '@/app/(protected)/technical/change-meter/components/pageNationSkeleton'
import TableSearchSkeleton from './components/tableSearchSkeleton'
import RadarChartSimple from '@/app/common/Radar'
import ChartSkeleton from '@/app/common/ChartSkeleton'
import { GetComplaintOvertime } from '../../../lib/serverFetch';
import SimpleAreaChart from '@/app/common/AreaChart'


const DashBoardPage = ({ searchParams }: { searchParams: Promise<{ page: number; q: string }> }) => {
  const params = use(searchParams);
  const complaintsData = GetAllComplaints(params.page, params.q);
  const pageUrl = '/complaints/dashboard';
  const statsData = GetComplaintStats();
  const topComplaints = GetTopComplaints();
  const overtimeData = GetComplaintOvertime();
  const columns = [
    'ID',
    'PROFILE',
    'FIRST NAME',
    'LAST NAME',
    'SUBMITTED AT',
    'SUBJECT',
    'DETAILS',
    'REFERENCE POLE',
    'MAP',
    'STATUS',
    'LATEST UPDATE',
    'STATUS HISTORY',
    'MESSAGES',
    'RESOLUTION TIME'
  ]
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
        <Suspense fallback={<div>Loading...</div>}>
          <Stats data={statsData} />
        </Suspense>

        <fieldset className='fieldset rounded-box'>
          <legend className={`fieldset-legend flex w-full`}>
            <h3 className='text-sm md:text-2xl text-shadow-md  font-bold  text-blue-800'>
              Real-Time Concerns Table
            </h3>
            <Suspense fallback={<TableSearchSkeleton />}>
              <TableSearch data={complaintsData} />
            </Suspense>
          </legend>
          <DashBoardTable>
            <TableHead columns={columns} selectable={false} />
            <Suspense fallback={
              <TableDataSkeleton row={8} col={14} />
            }>
              <ComplaintsContainer data={complaintsData} />
            </Suspense>
            <Suspense
              fallback={<PageNationLoading />}>
              <TableFooter data={complaintsData} pageUrl={pageUrl} />
            </Suspense>
          </DashBoardTable>
        </fieldset>

        <section className='w-full'>

          <div className='flex flex-col sm:flex-col md:flex-row gap-4 w-full'>
            <Suspense fallback={<ChartSkeleton />}>
              <RadarChartSimple prom={topComplaints} valueName='Count' title='Common Concerns' />
            </Suspense>

            <Suspense fallback={<ChartSkeleton />}>
              <SimpleAreaChart prom={overtimeData} title='Concerns Overtime'/>
            </Suspense>
          </div>


        </section>
      </main>
    </div>
  )
}

export default DashBoardPage;