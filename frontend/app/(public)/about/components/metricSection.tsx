"use client";

import React from "react";

const MetricSection = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
        <p className="text-3xl font-bold text-blue-600">30,000+</p>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Active Consumers
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
        <p className="text-3xl font-bold text-blue-600">245 km</p>
        <p className="text-sm font-medium text-slate-500 mt-1">
          13.2kV and 13.8kV Distribution Line
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
        <p className="text-3xl font-bold text-blue-600">100%</p>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Barangay Energization
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
        <p className="text-3xl font-bold text-blue-600">69</p>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Dedicated Employees
        </p>
      </div>
    </section>
  );
};

export default MetricSection;
