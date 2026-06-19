"use client";

const BriefHistorySection = () => {
  return (
    <section className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-slate-950 flex items-center gap-2 border-b pb-2 border-slate-200">
          Our Brief History
        </h2>
        <p className="leading-relaxed text-slate-600">
          Busuanga Island Electric Cooperative Inc. (BISELCO) was organized in
          1979 initially serving the municipalities of Coron and Busuanga only.
          On June 27, 1979 it was formally registered as the 112th Cooperative
          in the country and one of the Island Cooperatives funded by the German
          Government. The poblacion of Coron was energized on May 18, 1983 using
          a second hand 75 kW generator borrowed from Camarines Norte Electric
          Cooperative, Inc. BISELCO was granted a fifty years franchise by the
          National Electrification Administration (NEA) on August 15, 1984.
          Initially, BISELCO served 29 consumers in the poblacion of Coron. From
          those initial number of consumers, BISELCO, as of December 2021 is now
          serving actual consumers of 24,600 in the four (4) municipalities of
          the Calamianes Group of Islands: Busuanga, Coron, Culion and Linapacan
          through a 13.2kv distribution line spanning 245 circuit kilometers.
          To-date the municipalities of Busuanga and Coron are interconnected
          through the 13.2kV distribution system of BISELCO, while Culion and
          Linapacan had its own distribution system in the island.
        </p>
        <p className="leading-relaxed text-slate-600">
          It was on November 16, 1999, a financial crisis put BISELCO under the
          supervision of Palawan Electric Cooperative (PALECO) and on 2007
          BISELCO operated on its own under the supervision of GM Ruth L. Fortes
          as the OIC and eventually became the General Manager.
        </p>
      </div>

      {/* Governance / Corporate Structure Side Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Corporate Leadership
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          BISELCO is composed of six (6) districts represented by six (6) Board
          of Directors and a General Manager with sixty-nine (69) employees.
          There are four (4) areas on which each has its own sub-offices namely;
          Busuanga, Culion and Linapacan.
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-600">
          <p>
            <strong>Management:</strong>
            <br />
            <span>Mrs. Ruth L. Fortes (General Manager)</span>{" "}
          </p>
          <p>
            <strong>Board Dynamics:</strong> 5 Active Seats{" "}
          </p>
          <p>
            <strong>Sub-Offices:</strong> Busuanga, Culion, & Linapacan
          </p>
        </div>
      </div>
    </section>
  );
};

export default BriefHistorySection;
