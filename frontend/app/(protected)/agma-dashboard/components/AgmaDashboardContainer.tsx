"use client";
import { useEffect, useState, use } from "react";
import MembersTable from "./MembersTicket";
import StatisticsCharts from "./StatisticsCharts";
import Tabs from "./Tabs";

import{useRouter } from "next/navigation";

type PromiseType = {
  status: number;
  data: {
    data: RegisteredType[];
  };
}

type Props = {
  tabData: Promise <PromiseType>;
}

type RegisteredType = {
  account_no: string;
  name: string;
  phone: string;
  image: string;
  signature: string;
  account_name: string;
  village: string;
  municipality: string;
  meter_no: string;
  meter_brand: string;
  date_registered: string;
  time_registered: string;
  year: string
};


const AgmaDashboardContainer = ({ tabData }: Props) => {
  const tabDatas = use(tabData);
  const [activeTab, setActiveTab] = useState("overview");
  const handleActiveTab = (tab: string) => setActiveTab(tab);
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Statistics", value: "stats" },
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
  const [agmaTickets, setAgmaTickets] = useState<RegisteredType[]>([]);
  useEffect(()=>{
    if(tabDatas.status === 200){
      queueMicrotask(() => (setAgmaTickets(tabDatas.data.data)));
    }
  },[tabDatas])
  return (
    <div className="w-full h-full min-h-screen ">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
      />
      {/* Tab Content */}
      {activeTab === "overview" && <MembersTable data={agmaTickets}   />}
      {activeTab === "stats" && <StatisticsCharts />}
    </div>
  );
};

export default AgmaDashboardContainer;
