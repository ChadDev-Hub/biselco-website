"use client";
import { useEffect, useState,  } from "react";
import StatisticsCharts from "./StatisticsCharts";
import Tabs from "./Tabs";

import{useRouter } from "next/navigation";



type Props = {
  children: React.ReactNode;
}




const AgmaDashboardContainer = ({children }: Props) => {
  const [activeTab, setActiveTab] = useState("overview");
  const handleActiveTab = (tab: string) => setActiveTab(tab);
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Statistics", value: "stats" },
    { label: "Setup", value: "setup" },
  ];
  // Parameters
  const router = useRouter();
  
  // NEW PARAMETERS WHEN TAB IS CHANGED
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    router.replace(`?${params.toString()}`);
  },[activeTab,router]);

  // ------------------------------------------------------------
  return (
    <div className="w-full h-full min-h-screen ">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
      />
      {children}
      {/* Tab Content */}
     
      {activeTab === "stats" && <StatisticsCharts />}
    </div>
  );
};

export default AgmaDashboardContainer;
