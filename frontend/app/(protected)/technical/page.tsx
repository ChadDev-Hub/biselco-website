
import {GetTechnicalForm} from '@/lib/private-api/server-side/technical';
import TechniclaFormLists from './components/optionsLists'
import { Suspense } from 'react'
import OptionListsSkeleton from './components/optionlistsSkeleton'
export const dynamic = 'force-dynamic';
const TechnicalPage = () => {
  const technicalForms = GetTechnicalForm()
  return (
    <Suspense fallback={<OptionListsSkeleton forms={4} />}>
      <TechniclaFormLists initialData={technicalForms} />
    </Suspense>
  )
}

export default TechnicalPage;