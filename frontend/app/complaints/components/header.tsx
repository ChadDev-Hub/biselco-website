"use client";
import {Roboto} from 'next/font/google'
const roboto = Roboto({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-fascinate",
});
const ComplaintHeader = () => {
  return (
    <header className="flex flex-col gap-2">
      <div className="space-y-4">
        <h1
          className={`${roboto.className} text-shadow-gray-600  text-shadow-md text-center text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-tight text-red-600`}
        >
          Concerns <span className="text-yellow-300">Portal</span>
        </h1>
        <p className="text-[clamp(0.875rem,2.5vw,1.125rem)] italic text-center text-blue-800 ">
          A secure and efficient platform for submitting, tracking, and
          resolving your service complaints. We ensure transparency,
          accountability, and real-time updates for every concern you report.
        </p>
      </div>
      <nav className="flex flex-wrap flex-col lg:flex-row items-center justify-center gap-3">
        {["Post Complaints", "View History", "Real-Time Status"].map((item) => (
          <span
            key={item}
            className="px-4 py-1.5 w-fit rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium shadow-sm hover:border-indigo-300 transition-colors"
          >
            {item}
          </span>
        ))}
      </nav>
      <div className="mt-4 glass  rounded-xl p-4 text-center space-y-2">
        <p className="text-sm font-semibold text-blue-800">
          📞 Need Immediate Assistance?
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 text-sm text-blue-900">
        
          <span className="font-bold">09176511859</span>
          <span className="hidden sm:block">|</span>
          <span className="font-bold">09176396436</span>
          <span className="hidden sm:block">|</span>
          <span className="font-bold">09107101909</span>
        </div>
      </div>
    </header>
  );
};

export default ComplaintHeader;
