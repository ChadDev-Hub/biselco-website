import React, { Suspense} from 'react'
import { ComplaintsDashboardRouteButton } from '@/app/common/buttons/complaints'
import CreateComplaints from './components/CreateComplaintsModal'
import FabIcon from '@/app/common/Fab'
import { UserComplaints, ComplaintStatusName } from '@/lib/serverFetch'
import ComplaintsContainer from './components/complaintContainer'

import ComplaintHeader from './components/header'
import ModernConcernCardSkeleton from './components/modernConcernCardSkeleton';


const ComplaintsPage = () => {
  const data = UserComplaints()
  const statusName = ComplaintStatusName()
  return (
    <div className="min-h-screen w-full ">
      {/* Header */}
        <section className="bg-blue-700 rounded-b-4xl">
          <ComplaintHeader />
        </section>
      <main className="
      w-full
      py-2
      flex
      gap-4 
      flex-col
      justify-center 
      lg:items-center 
      pb-21">
        

        {/* Feature Pills */}
        <section className='w-full flex justify-center'>
          <div data-tip="Submit Complaints" className='tooltip tooltip-bottom'>
            <CreateComplaints/>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-2">
          <Suspense fallback={<ModernConcernCardSkeleton />}>
          <ComplaintsContainer complaintsData={data} complaintsStatusName={statusName} />
        </Suspense>

        </section>
        

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