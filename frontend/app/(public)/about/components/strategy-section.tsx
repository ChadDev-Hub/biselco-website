"use client";

import React from "react";

const StrategySection = () => {
  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
      <h2 className="text-2xl font-bold text-slate-950">
        Grid Expansion & Alternative Energy Strategy
      </h2>
      <p className="text-slate-600 leading-relaxed">
        The Sitio Electrification Program (SEP) and Barangay Line Enhancement Program (BLEP) of the National Government, electrification on un-energized sitios and barangays has been accelerated through line extension subsidies.  All Barangays in mainland Busuanga, Coron and Culion have been fully energized through line extensions except for some sitios. For Linapacan, only one Barangay in the Mainland is fully served through distribution line. 
      </p>
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        <div className="border-l-4 border-amber-500 pl-4 space-y-1">
          <h4 className="font-semibold text-slate-950">Off-Grid Microgrids</h4>
          <p className="text-sm text-slate-600">
            There are currently four (4) islands energized through micro-grid system, a program under NPC’S Village Electrification Program.
          </p>
        </div>
        <div className="border-l-4 border-blue-500 pl-4 space-y-1">
          <h4 className="font-semibold text-slate-950">
            PV Mainstreaming & Solar Solutions
          </h4>
          <p className="text-sm text-slate-600">
            The rest of the island barangays beyond reach of distribution lines are also considered energized but underserved, because they are only served by individual solar home system, under DOE’s PV Mainstreaming. 
          </p>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
