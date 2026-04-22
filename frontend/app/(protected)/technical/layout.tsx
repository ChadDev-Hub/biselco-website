


import React from 'react'

type Props = {
    children: React.ReactNode
}

const TechnicalPageLayout = async({children}: Props) => {
  return (
    <div className='flex flex-col items-center bg-zinc-50  justify-start w-full bg-linear-to-bl from-blue-600 to-yellow-600 min-h-screen '>
        <main className='container mt-20 mb-20 pb-4 h-full mx-2'>
            {children}
        </main>
    </div>
  )
}

export default TechnicalPageLayout;