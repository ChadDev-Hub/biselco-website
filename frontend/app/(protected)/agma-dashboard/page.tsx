import AgmaDashboardContainer from "./components/AgmaDashboardContainer";
import { GetAgmaStats } from "@/lib/serverFetch";
import StatsGrid from "./components/StatsGrid";
import Headers from "../technical/new-connection/components/header";
import { Suspense } from "react";
import StatsSkeleton from "@/app/common/statsSkeleton";
import StatsContainer from "@/app/common/Stats";
import OverViewSection from "./components/OverViewSection";
import SetupSection from "./components/SetupSection";
import { GetAgmaSetup, GetAgmaSchedules } from "../../../lib/serverFetch";
import Schedules from "./components/Schedules";
import SetupSkeleton from "./components/SetupSkeleton";
import StatisticsCharts from "./components/StatisticsCharts";
import {
  GetAgmaCountRegistered,
  GetAgmaRegisterByMunicipality,
} from "../../../lib/agma";
import CountRegistered from "./components/CountRegistered";
import ChartSkeleton from "../../common/ChartSkeleton";
import SpinNavigation from "../agma-spin-wheel/components/spin-navigation";
import { redirect } from "next/navigation";
import PulltoRefresh from "../../common/PulltoRefresh";
import RadarChartSimple from "@/app/common/Radar";


const AgmaDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { tab, page, year, barangay, search, municipality, is_verified } =
    await searchParams;
  const stats = GetAgmaStats();
  const AgmaEvent = GetAgmaSetup();
  const schedules = GetAgmaSchedules();
  const countRegistered = GetAgmaCountRegistered(municipality);
  const registerByMunicipality = GetAgmaRegisterByMunicipality();
  if (!tab) redirect("/agma-dashboard?tab=overview");
  return (
    <PulltoRefresh>
      <div className="w-full min-h-screen pb-20 place-items-center">
        {/* Headers */}
        <Headers
          title="AGMA Dashboard"
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
                  search={search}
                  municipality={municipality}
                  is_verified={is_verified}
                />
              )}
              {tab === "setup" && (
                <section className="w-full h-full">
                  <Suspense fallback={<SetupSkeleton />}>
                    <SetupSection initialData={AgmaEvent} />
                  </Suspense>
                  <Suspense fallback={<SetupSkeleton />}>
                    <Schedules promiseData={schedules} />
                  </Suspense>
                </section>
              )}
              {/* Dashboard Content */}
              {tab === "stats" && (
                <StatisticsCharts>
                  <Suspense fallback={<ChartSkeleton />}>
                    <CountRegistered promise={countRegistered} />
                  </Suspense>

                  {/* <Suspense fallback={<ChartSkeleton />}>
                    <RegisteredOverTime promise={registeredOverTime} />
                  </Suspense> */}

                  <Suspense fallback={<ChartSkeleton />}>
                    <RadarChartSimple prom={registerByMunicipality} title="Registered By Municipality" valueName="Registered" />
                  </Suspense>
                </StatisticsCharts>

              )}
            </AgmaDashboardContainer>
          </section>

          <SpinNavigation />
        </main>
      </div>
    </PulltoRefresh>
  );
};

export default AgmaDashboard;
