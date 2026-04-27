
import React from 'react'
import {GetTechnicalForms} from "@/lib/serverFetch"
import TechniclaFormLists from './components/optionsLists'
import { Suspense } from 'react'
import OptionListsSkeleton from './components/optionlistsSkeleton'
const TechnicalPage = () => {
  const technicalForms = GetTechnicalForms()
  return (
    <Suspense fallback={<OptionListsSkeleton forms={4} />}>
      <TechniclaFormLists initialData={technicalForms} />
    </Suspense>
  )
}

export default TechnicalPage;