import AgmaDashboardContainer from "./components/AgmaDashboardContainer";
import { GetAgmaStats } from "@/lib/serverFetch";
import StatsGrid from "./components/StatsGrid";
import Headers from "../technical/new-connection/components/header";
const AgmaDashboard = () => {
  const stats = GetAgmaStats();
  return (
    <div className="w-full  min-h-screen place-items-center">
      {/* Headers */}
      <Headers title="Agma Dashboard" subtitle="Welcome back! Here's AGMA Overview" />
      <main className="flex flex-col h-full max-w-4xl w-full items-center">
        {/* Stats Cards Grid */}
        <section className="p-2 w-full">
          <StatsGrid stats={stats} />
        </section>
        <section className="w-full ">
          <AgmaDashboardContainer />
        </section>
      </main>
    </div>
  );
};

export default AgmaDashboard;
