
import React from 'react'
import { getTechnicalForms } from '@/app/actions/form_lists'
import TechniclaFormLists from './components/optionsLists'
import { Suspense } from 'react'

const TechnicalPage = () => {
  const technicalForms = getTechnicalForms()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TechniclaFormLists initialData={technicalForms} />
    </Suspense>
  )
}

export default TechnicalPage;