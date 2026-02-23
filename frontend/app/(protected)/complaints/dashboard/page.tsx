"use server"
import React, {Suspense} from 'react'
import Stats from '@/app/common/status'

import DashBoardFeed from './components/complaintDashBoadFeed'

const DashBoardPage = async() => {
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
        <h1>Dashboard</h1>
        <Stats/>
        <Suspense fallback={<div>Loading...</div>}>
          <DashBoardFeed/>
        </Suspense>
        </main>
    </div>
  )
}

export default DashBoardPage;