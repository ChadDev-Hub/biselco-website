import { Suspense } from 'react';
import LineConstructionLoader from './components/line-contruction/llineConstructionLoader';
import LoadingIndicator from '@/app/common/progress/LoadingIndicator';



const Page = async () => {
  return (
    <div>
        <Suspense fallback={<LoadingIndicator />}>
            <LineConstructionLoader />
        </Suspense>
    </div>
  )
}

export default Page