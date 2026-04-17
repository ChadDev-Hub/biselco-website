"use client";
const ChartSkeleton = () => {
  return (
    <div className="glass rounded-2xl p-4 w-full h-90 animate-pulse">
      {/* Title */}
      <div className="h-4 w-32 bg-base-300 rounded mb-4"></div>

      {/* Fake chart circle */}
      <div className="flex items-center justify-center h-full">
        <div className="w-35 h-35 rounded-full border-8 border-base-300 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default ChartSkeleton;