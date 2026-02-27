
import React from 'react'
import { getTechnicalForms } from '@/app/actions/form_lists'
import TechniclaFormLists from './components/optionsLists'
import { Suspense } from 'react'

const TechnicalPage = () => {
  const technicalForms = getTechnicalForms()
  return (
    <div className='flex flex-col items-center  justify-start w-full     h-screen '>
        <main className='container mt-20 h-full mx-2'>
            <Suspense fallback={<div>Loading...</div>}>
                <TechniclaFormLists initialData={technicalForms} />
            </Suspense>
        </main>
    </div>
  )
}

export default TechnicalPage