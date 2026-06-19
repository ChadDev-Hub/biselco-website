"use client";


import React from 'react'

interface EnergizationData {
  municipality: string;
  barangays: number;
  barangaysEnergized: number;
  barangayPct: string;
  sitios: string | number;
  sitiosEnergized: string | number;
  sitioPct: string;
}

interface ConnectionData {
  municipality: string;
  potential: number;
  actual: number;
  percentage: string;
}



const DataTableSection = () => {
    const energizationTable: EnergizationData[] = [
    { municipality: 'Coron', barangays: 23, barangaysEnergized: 23, barangayPct: '100%', sitios: 74, sitiosEnergized: 72, sitioPct: '97%' },
    { municipality: 'Busuanga', barangays: 14, barangaysEnergized: 14, barangayPct: '100%', sitios: 29, sitiosEnergized: 28, sitioPct: '96%' },
    { municipality: 'Culion', barangays: 14, barangaysEnergized: 14, barangayPct: '100%', sitios: 21, sitiosEnergized: 18, sitioPct: '86%' },
    { municipality: 'Linapacan', barangays: 10, barangaysEnergized: 10, barangayPct: '100%', sitios: 'N/A', sitiosEnergized: 'N/A', sitioPct: 'N/A' },
  ];

  // Status of Connection Data (as of Dec 31, 2021)
  const connectionTable: ConnectionData[] = [
    { municipality: 'Coron', potential: 14412, actual: 14202, percentage: '99%' },
    { municipality: 'Busuanga', potential: 7132, actual: 4658, percentage: '65%' },
    { municipality: 'Culion', potential: 5140, actual: 3678, percentage: '72%' },
    { municipality: 'Linapacan', potential: 4641, actual: 2191, percentage: '47%' },
  ];
  return (
    <section className="space-y-12">
          
          {/* Table 1: Level of Energization */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Level of Energization</h3>
              <p className="text-sm text-slate-500">Comprehensive overview of coverage metrics across barangays and lines (Dec 31, 2021)</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-4">Municipality</th>
                    <th className="p-4 text-center">Total Barangays</th>
                    <th className="p-4 text-center">Barangays Energized</th>
                    <th className="p-4 text-center">Brgy %</th>
                    <th className="p-4 text-center">Total Sitios</th>
                    <th className="p-4 text-center">Sitios Energized</th>
                    <th className="p-4 text-center">Sitio %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {energizationTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{row.municipality}</td>
                      <td className="p-4 text-center">{row.barangays}</td>
                      <td className="p-4 text-center">{row.barangaysEnergized}</td>
                      <td className="p-4 text-center font-semibold text-emerald-600">{row.barangayPct}</td>
                      <td className="p-4 text-center">{row.sitios}</td>
                      <td className="p-4 text-center">{row.sitiosEnergized}</td>
                      <td className="p-4 text-center text-slate-500">{row.sitioPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 italic px-2">
              * Note for Linapacan: All 10 barangays are accounted for. Brgy. San Miguel and Nangalao are served directly by NPC; 7 islands rely on alternative solar structures; Brgy. Decabaitot is energized through Shell-Malampaya.
            </p>
          </div>

          {/* Table 2: Status of Connection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Status of Connection</h3>
              <p className="text-sm text-slate-500">Current distribution vs potential households (Dec 31, 2021)</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-4">Municipality</th>
                    <th className="p-4 text-right">Potential Consumer Base</th>
                    <th className="p-4 text-right">Actual Active Connections</th>
                    <th className="p-4 text-right">Market Footprint (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {connectionTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{row.municipality}</td>
                      <td className="p-4 text-right">{row.potential.toLocaleString()}</td>
                      <td className="p-4 text-right">{row.actual.toLocaleString()}</td>
                      <td className="p-4 text-right font-semibold text-blue-600">{row.percentage}</td>
                    </tr>
                  ))}
                  {/* Totals Calculation Mapping Row */}
                  <tr className="bg-slate-50/70 font-bold text-slate-900 border-t-2 border-slate-200">
                    <td className="p-4">Total System Footprint</td>
                    <td className="p-4 text-right">31,325</td>
                    <td className="p-4 text-right">24,729</td>
                    <td className="p-4 text-right text-indigo-600">79%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>
  )
}

export default DataTableSection