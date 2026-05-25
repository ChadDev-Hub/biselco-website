import AgmaDashboardContainer from "./components/AgmaDashboardContainer";
import { GetAgmaStats } from "@/lib/serverFetch";
import StatsGrid from "./components/StatsGrid";
import Headers from "../technical/new-connection/components/header";
import { GetAgmaTicketAll } from "@/lib/serverFetch";
import Pagination from "../technical/change-meter/components/pagination";
import { Suspense } from "react";
const AgmaDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const stats = GetAgmaStats();
  const tabs = (await searchParams).tab;
  const page = (await searchParams).page;
  let tabDatas: ReturnType<typeof GetAgmaTicketAll>;

  switch (tabs) {
    case "overview":
      console.log(page)
      tabDatas = GetAgmaTicketAll(page);
      break;
    default:
      tabDatas = GetAgmaTicketAll(page); // or throw, or fallback
  }
  return (
    <div className="w-full  min-h-screen place-items-center">
      {/* Headers */}
      <Headers
        title="Agma Dashboard"
        subtitle="Welcome back! Here's AGMA Overview"
      />
      <main className="flex flex-col h-full max-w-4xl w-full items-center">
        {/* Stats Cards Grid */}
        <section className="p-2 sm:px-2 md:px-2 lg:px-0 w-full">
          <StatsGrid stats={stats} />
        </section>
        <section className="w-full ">
          <AgmaDashboardContainer tabData={tabDatas} />
        </section>
        {tabs === "overview" && 
        <section className="my-6">
          <Suspense>
            <Pagination data={tabDatas}/>
          </Suspense>
        </section>}
      </main>
    </div>
  );
};

export default AgmaDashboard;
