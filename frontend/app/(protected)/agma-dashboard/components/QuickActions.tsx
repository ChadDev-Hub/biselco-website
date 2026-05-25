import React from "react";

const QuickActions: React.FC = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="btn btn-primary btn-lg w-full gap-2">
        <span>➕</span> Add New AGMA
      </button>
      <button className="btn btn-secondary btn-lg w-full gap-2">
        <span>📊</span> Export Report
      </button>
      <button className="btn btn-outline btn-lg w-full gap-2">
        <span>⚙️</span> Settings
      </button>
    </div>
  );
};

export default QuickActions;
