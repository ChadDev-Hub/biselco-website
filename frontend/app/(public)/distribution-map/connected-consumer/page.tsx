import FlowContainer from "./components/flow-container";
import { use, Suspense } from "react";
import { GetConnectedConsumers } from "@/lib/transformer";
import { ReactFlowProvider } from "@xyflow/react";
import Aside from "./components/aside";
import Return from "../../privacy-policy/components/return";

type Props = {
  searchParams: Promise<searchParamsType>;
};
type searchParamsType = {
  dt: string;
};

const ConnectedConsumer = ({ searchParams }: Props) => {
  const params = use(searchParams);
  const dt = params.dt;
  const result = GetConnectedConsumers(dt);
  return (
    <ReactFlowProvider>
      <div className="flex w-full min-h-screen relative">
        <Return />
        {/* <Suspense fallback={<div>Loading...</div>}>
          <Aside promise={result} />
        </Suspense> */}
        <main className="flex-1 min-h-0 ">
          <Suspense
            fallback={
              <div className="w-full h-full z-100 justify-center items-center">
                <span className="loading loading-ring loading-xl"></span>
              </div>
            }
          >
            <FlowContainer promise={result} />
          </Suspense>
          <div></div>
        </main>
      </div>
    </ReactFlowProvider>
  );
};

export default ConnectedConsumer;
