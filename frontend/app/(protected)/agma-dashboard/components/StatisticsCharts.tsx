import React from "react";
import CardComponent from "@/app/common/card";

const StatisticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <CardComponent className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Member Distribution</h2>
        <div className="h-64 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg">
          <p className="text-gray-600">Chart placeholder - Connect your data source</p>
        </div>
      </CardComponent>

      <CardComponent className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Trends</h2>
        <div className="h-64 flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-50 rounded-lg">
          <p className="text-gray-600">Chart placeholder - Connect your data source</p>
        </div>
      </CardComponent>
    </div>
  );
};

export default StatisticsCharts;
