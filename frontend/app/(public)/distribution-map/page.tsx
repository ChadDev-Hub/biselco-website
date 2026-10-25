
import { Suspense } from "react";
import LoadingIndicator from "./components/LoadingIndicator";
import MapProvider from "./components/MapProvider";
import TransformerLoader from "./components/TransformerComponent/TransformerLoader";
import PrimaryLineLoader from "./components/PrimaryLineComponent/primaryLineLoader";
export const dynamic = "force-dynamic";

const Page = () => {
  
  return (
    <div className="h-full w-full">
      <MapProvider>
        <Suspense fallback={<LoadingIndicator />}>
          <PrimaryLineLoader />
        </Suspense>
        <Suspense fallback={<LoadingIndicator />}>
         <TransformerLoader />
        </Suspense>
      </MapProvider>
    </div>
  );
};

export default Page;
