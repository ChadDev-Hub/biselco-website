import AgmaDashboardContainer from "./components/AgmaDashboardContainer";
import { GetAgmaStats } from "@/lib/serverFetch";
import StatsGrid from "./components/StatsGrid";
import Headers from "../technical/new-connection/components/header";
import { Suspense } from "react";
import StatsSkeleton from "@/app/common/statsSkeleton";
import StatsContainer from "@/app/common/Stats";
import OverViewSection from "./components/OverViewSection";
import SetupSection from "./components/SetupSection";
import { GetAgmaEvents } from '../../../lib/serverFetch';

const AgmaDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const stats = GetAgmaStats();
  const AgmaEvent = GetAgmaEvents();
  const { tab, page, year, barangay } = await searchParams;
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
          <Suspense
            fallback={
              <StatsContainer className="">
                <StatsSkeleton numberofStats={4} />
              </StatsContainer>
            }
          >
            <StatsGrid stats={stats} />
          </Suspense>
        </section>
        <section className="w-full ">
          <AgmaDashboardContainer key={`tab-${tab}`}>
            {tab === "overview" && (
              <OverViewSection
                page={page}
                year={year}
                barangay={barangay}
              />
            )}
          {tab === "setup" && <SetupSection initialData={AgmaEvent} />}
            {/* Dashboard Content */}
          </AgmaDashboardContainer>
        </section>
      </main>
    </div>
  );
};

export default AgmaDashboard;
