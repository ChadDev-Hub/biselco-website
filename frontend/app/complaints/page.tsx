import React, { Suspense, use } from 'react'
import { ComplaintsDashboardRouteButton } from '@/app/common/buttons/complaints'
import CreateComplaints from './components/CreateComplaintsModal'
import FabIcon from '@/app/common/Fab'
import { UserComplaints, ComplaintStatusName } from '@/lib/serverFetch'
import ComplaintsContainer from './components/complaintContainer'
import ComplaintsLoading from './loading'
import MeterComplaints from './components/meterComplaintsForm'
import { queryConsumer } from '@/lib/serverFetch' 
import ComplaintHeader from './components/header'
type Props = {
  searchParams: Promise<{ consumer?: string }>
}
const ComplaintsPage = ({ searchParams }: Props) => {
  const params = use(searchParams)
  const data = UserComplaints()
  const statusName = ComplaintStatusName()
  const consumers = queryConsumer(params.consumer)

  return (
    <div className="flex min-h-screen items-start w-full justify-center bg-zinc-50 font-sans  bg-linear-to-bl from-blue-600 to-yellow-600">
      <main className="
      container
      max-w-190
      p-3
      flex
      gap-4 
      flex-col 
      lg:items-center 
      mt-20
      xs:mt-20
      sm:mt-20 
      md:mt-20
      lg:mt-20 
      pb-21">
        {/* Header */}
        <section>
            <ComplaintHeader />
        </section>
          
          {/* Feature Pills - Replaces the yellow underlined text */}  
        <section className='w-full flex justify-center'>
          <div data-tip="Submit Complaints" className='tooltip tooltip-bottom'>
            <CreateComplaints
            meterComplaints={<MeterComplaints data={consumers} />}
            >
              
            </CreateComplaints>
          </div>
        </section>
        <Suspense fallback={<ComplaintsLoading />}>
          <ComplaintsContainer complaintsData={data} complaintsStatusName={statusName} />
        </Suspense>
        <FabIcon>
          <div data-tip="Navigate Dashboard" className='tooltip tooltip-left'>
            <ComplaintsDashboardRouteButton />
          </div>
        </FabIcon>
      </main>
    </div>
  )
}
export default ComplaintsPage;