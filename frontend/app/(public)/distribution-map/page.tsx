
import DistributionMap from "./components/DistributionMap"
import {GetPrimaryLines} from "../../../lib/distributionLine"
import { Suspense } from 'react';

const Page = () => {
    const primaryLines = GetPrimaryLines()
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
            <DistributionMap primaryLinePromise={primaryLines} />
        </Suspense>
        
    </div>
    
  )
}

export default Page