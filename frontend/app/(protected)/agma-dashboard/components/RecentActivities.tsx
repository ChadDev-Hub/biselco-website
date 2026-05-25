import React from "react";
import CardComponent from "@/app/common/card";

type Activity = {
  id: number;
  activity: string;
  agma: string;
  date: string;
  type: "member" | "connection" | "task" | "complaint" | "document";
};

type Props = {
  activities: Activity[];
};

const RecentActivities: React.FC<Props> = ({ activities }) => {
  const getBadgeColor = (type: Activity["type"]) => {
    switch (type) {
      case "member":
        return "badge-info";
      case "connection":
        return "badge-success";
      case "task":
        return "badge-primary";
      case "complaint":
        return "badge-warning";
      case "document":
        return "badge-secondary";
      default:
        return "badge-default";
    }
  };

  return (
    <CardComponent className="p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className={`badge ${getBadgeColor(activity.type)}`}>{activity.type}</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{activity.activity}</p>
              <p className="text-sm text-gray-600">{activity.agma}</p>
            </div>
            <p className="text-sm text-gray-500">{activity.date}</p>
          </div>
        ))}
      </div>
    </CardComponent>
  );
};

export default RecentActivities;
