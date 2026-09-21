import FlowContainer from "./components/flow-container";
import { use, Suspense } from "react";
import { GetConnectedConsumers } from "@/lib/transformer";

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
    <div className="flex w-full min-h-screen">
      <aside className="h-20 border-b bg-base-300">
        <h1>Connected Consumers</h1>
      </aside>
      <main className="flex-1 min-h-0 ">
        <Suspense fallback={<div>Loading...</div>}>
          <FlowContainer promise={result} />
        </Suspense>
        <div>

        </div>
      </main>
    </div>
  );
};

export default ConnectedConsumer;
