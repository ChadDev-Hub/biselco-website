"use server"

import React, {Suspense} from 'react'
import ComplaintsFeed from './components/complaintsFeed'
import { ComplaintsDashboardRouteButton} from '../common/buttons/complaints'
import CreateComplaints from './components/CreateComplaintsModal'
import FabIcon from '../common/Fab'
const ComplaintsPage = async () => {
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
        <header className="flex flex-col items-center text-center w-full space-y-6">
          <div className="space-y-2 ">
            <h1 className="text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-tight text-red-600">
              Complaints <span className="text-yellow-300">Portal</span>
            </h1>
            <p className="text-[clamp(0.875rem,2.5vw,1.125rem)] text-blue-800 ">
              Our Complaints Portal is a secure and user-friendly platform designed 
              to help you manage and track your complaints efficiently.
            </p>
          </div>

          {/* Feature Pills - Replaces the yellow underlined text */}
          <nav className="flex flex-wrap flex-col lg:flex-row justify-center gap-3">
            {["Post Complaints", "View History", "Real-Time Status"].map((item) => (
              <span
                key={item}
                className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium shadow-sm hover:border-indigo-300 transition-colors"
              >
                {item}
              </span>
            ))}
          </nav>
        </header>
          <Suspense fallback={<div>Loading...</div>}>
            <ComplaintsFeed/>
          </Suspense>
          <FabIcon>
            <div data-tip = "Create Complaint" className='tooltip tooltip-left'>
              <CreateComplaints/>
            </div>
            <div data-tip = "Navigate Dashboard" className='tooltip tooltip-left'>
              <ComplaintsDashboardRouteButton/>
            </div>
          </FabIcon>
      </main>
    </div>
  )
}
export default ComplaintsPage;