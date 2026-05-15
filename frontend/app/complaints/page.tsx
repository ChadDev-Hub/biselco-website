import React, { Suspense} from 'react'
import { ComplaintsDashboardRouteButton } from '@/app/common/buttons/complaints'
import CreateComplaints from './components/CreateComplaintsModal'
import FabIcon from '@/app/common/Fab'
import { UserComplaints, ComplaintStatusName } from '@/lib/serverFetch'
import ComplaintsContainer from './components/complaintContainer'
import ComplaintsLoading from './dashboard/components/loading'
import ComplaintHeader from './components/header'
import ConcernCard from './components/modernConcernCard';

const ComplaintsPage = () => {
  const data = UserComplaints()
  const statusName = ComplaintStatusName()
  return (
    <div className="flex min-h-screen items-start w-full justify-center">
      <main className="
      container
      max-w-190
      p-3
      flex
      gap-4 
      flex-col 
      lg:items-center 
      pb-21">
        {/* Header */}
        <section>
          <ComplaintHeader />
        </section>

        {/* Feature Pills */}
        <section className='w-full flex justify-center'>
          <div data-tip="Submit Complaints" className='tooltip tooltip-bottom'>
            <CreateComplaints/>
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
        <ConcernCard/>
      </main>
    </div>
  )
}
export default ComplaintsPage;