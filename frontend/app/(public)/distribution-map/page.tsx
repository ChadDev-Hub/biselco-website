
import DistributionMap from "./components/DistributionMap"
import {GetPrimaryLines} from "../../../lib/distributionLine"
import { Suspense } from 'react';
import LoadingMap from "./components/LoadingMap";
const Page = () => {
    const primaryLines = GetPrimaryLines()
  return (
    <div>
        <Suspense fallback={<LoadingMap/>}>
            <DistributionMap primaryLinePromise={primaryLines} />
        </Suspense>
        
    </div>
    
  )
}

export default Page