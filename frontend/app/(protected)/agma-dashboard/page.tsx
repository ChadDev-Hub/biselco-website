import AgmaDashboardContainer from "./components/AgmaDashboardContainer";
import { GetAgmaStats } from "@/lib/serverFetch";
import StatsGrid from "./components/StatsGrid";
import Headers from "../technical/new-connection/components/header";
import { GetAgmaTicketAll } from "@/lib/serverFetch";
import Pagination from "../technical/change-meter/components/pagination";
import { Suspense } from "react";
import MembersTable from "./components/MembersTicket";
import NavbarTools from "./components/Tools";
import Filter from "./components/Filter";
import { GetAgmaFilters } from '../../../lib/serverFetch';

const AgmaDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const stats = GetAgmaStats();
  const filters = GetAgmaFilters();
  const {tab, page, year, barangay} = (await searchParams)
  let tabDatas: ReturnType<typeof GetAgmaTicketAll>;
  switch (tab) {
    case "overview":
      tabDatas = GetAgmaTicketAll(page, year, barangay);
      break;
    default:
      tabDatas = GetAgmaTicketAll(page, year, barangay); // or throw, or fallback
  }
  return (
    <div className="w-full  min-h-screen pb-20 place-items-center">
      {/* Headers */}
      <Headers
        title="Agma Dashboard"
        subtitle="Welcome back! Here's AGMA Overview"
      />
      <main className="flex flex-col h-full max-w-4xl w-full items-center">
        {/* Stats Cards Grid */}
        <section className="p-2 sm:px-2 md:px-2 lg:px-0 w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <StatsGrid stats={stats} />
          </Suspense>
        </section>
        <section className="w-full ">
          <AgmaDashboardContainer>
            {tab === "overview" && (
              <NavbarTools>
                <Filter data={filters}/>
              </NavbarTools>
            )}
            {/* Dashboard Content */}

              {tab === "overview"

              && (
                <Suspense
                  key={`${year}-${page}-${tab}`}
                  fallback={<div>Loading...</div>}
                >
                  <MembersTable data={tabDatas} />
                  {/* <MembersTable  data={tabDatas} /> */}
                </Suspense>
              )}
          </AgmaDashboardContainer>
        </section>
        {tab === "overview" && (
          <section className="my-6">
            <Suspense>
              <Pagination data={tabDatas} />
            </Suspense>
          </section>
        )}
      </main>
    </div>
  );
};

export default AgmaDashboard;
