"use client";
import StatisticsCharts from "./StatisticsCharts";
import Tabs from "./Tabs";

import{ useSearchParams } from "next/navigation";



type Props = {
  children: React.ReactNode;
}




const AgmaDashboardContainer = ({children }: Props) => {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") ?? "overview";
  
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Statistics", value: "stats" },
    { label: "Setup", value: "setup" },
  ];
  // Parameters


  // NEW PARAMETERS WHEN TAB IS CHANGED
  
  // ------------------------------------------------------------
  return (
    <div className="w-full h-full min-h-screen ">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
      
      />
      {children}
      {/* Tab Content */}
     
      {activeTab === "stats" && <StatisticsCharts />}
    </div>
  );
};

export default AgmaDashboardContainer;
