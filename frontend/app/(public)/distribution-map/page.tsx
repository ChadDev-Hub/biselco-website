

import {GetPrimaryLines} from "../../../lib/distributionLine"
import { Suspense } from 'react';
import LoadingMap from "./components/LoadingMap";
import { GetTransformers } from "../../../lib/transformer";
import MapProvider from './components/MapProvider';
import PrimaryLineLayer from './components/PrimaryLineComponent.tsx/PrimaryLineLayer';
import TransformerLayer from './components/TransformerComponent/TransformerLayer';
const Page = () => {
    const primaryLines = GetPrimaryLines()
    const transformers = GetTransformers()
  return (
    <div className="h-screen w-screen">
      <MapProvider>
        <Suspense fallback={<LoadingMap/>}>
            <PrimaryLineLayer promise={primaryLines} />
        </Suspense>
        <Suspense fallback={<LoadingMap/>}>
            <TransformerLayer promise={transformers} />
        </Suspense>
    </MapProvider>

    </div>
    
  
        

    
  )
}

export default Page