"use client";

import { useState } from "react";

import MembersTable from "./MembersTicket";
import RecentActivities from "./RecentActivities";
import StatisticsCharts from "./StatisticsCharts";
import QuickActions from "./QuickActions";

const AgmaDashboardContainer = () => {
  const [activeTab, setActiveTab] = useState("overview");

  

  const agmaMembers = [
    { id: 1, name: "Addis AGMA", location: "Addis Ababa", members: 250, status: "Active" as const, joinDate: "2023-01-15" },
    { id: 2, name: "Dire Dawa AGMA", location: "Dire Dawa", members: 180, status: "Active" as const, joinDate: "2023-02-20" },
    { id: 3, name: "Adama AGMA", location: "Adama", members: 145, status: "Active" as const, joinDate: "2023-03-10" },
    { id: 4, name: "Hawassa AGMA", location: "Hawassa", members: 120, status: "Pending" as const, joinDate: "2024-01-05" },
    { id: 5, name: "Mekelle AGMA", location: "Mekelle", members: 95, status: "Active" as const, joinDate: "2023-05-12" },
  ];

  const recentActivities = [
    { id: 1, activity: "New member joined", agma: "Addis AGMA", date: "2 hours ago", type: "member" as const },
    { id: 2, activity: "Connection request approved", agma: "Dire Dawa AGMA", date: "5 hours ago", type: "connection" as const },
    { id: 3, activity: "Task completed", agma: "Adama AGMA", date: "1 day ago", type: "task" as const },
    { id: 4, activity: "New complaint filed", agma: "Hawassa AGMA", date: "2 days ago", type: "complaint" as const },
    { id: 5, activity: "Document uploaded", agma: "Mekelle AGMA", date: "3 days ago", type: "document" as const },
  ];

  return (
    <div className="w-full h-full min-h-screen ">

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6 bg-white rounded-lg p-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`tab tab-lg ${activeTab === "overview" ? "tab-active" : ""}`}
        >
          Members Overview
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`tab tab-lg ${activeTab === "activities" ? "tab-active" : ""}`}
        >
          Recent Activities
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`tab tab-lg ${activeTab === "stats" ? "tab-active" : ""}`}
        >
          Statistics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <MembersTable members={agmaMembers} />}
      {activeTab === "activities" && <RecentActivities activities={recentActivities} />}
      {activeTab === "stats" && <StatisticsCharts />}

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default AgmaDashboardContainer;
