

import {GetPrimaryLines} from "../../../lib/distributionLine"
import { Suspense } from 'react';
import LoadingIndicator from "./components/LoadingIndicator";
import { GetTransformers } from "../../../lib/transformer";
import MapProvider from './components/MapProvider';
import PrimaryLineLayer from './components/PrimaryLineComponent.tsx/PrimaryLineLayer';
import TransformerLayer from './components/TransformerComponent/TransformerLayer';


const Page = () => {
    const primaryLines = GetPrimaryLines()
    const transformers = GetTransformers()
  return (
    <div className="h-screen w-full">
      <MapProvider>
        <Suspense fallback={<LoadingIndicator/>}>
            <TransformerLayer promise={transformers} />
        </Suspense>
        <Suspense fallback={<LoadingIndicator/>}>
            <PrimaryLineLayer promise={primaryLines} />
        </Suspense>
    </MapProvider>

    </div>
    
  
        

    
  )
}

export default Page