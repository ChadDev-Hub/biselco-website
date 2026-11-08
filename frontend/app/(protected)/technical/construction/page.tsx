import { Suspense } from 'react';
import LineConstructionLoader from './components/line-contruction/llineConstructionLoader';
import LoadingIndicator from '@/app/common/progress/LoadingIndicator';
import MapProvider from '@/app/context/MapProvider';



const Page = async () => {
  return (
      
      <MapProvider>
        <Suspense fallback={<LoadingIndicator />}>
            <LineConstructionLoader />
        </Suspense>
      </MapProvider>
  
  )
}

export default Page