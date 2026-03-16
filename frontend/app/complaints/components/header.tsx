"use client"


import { Fascinate } from 'next/font/google'
const facinate = Fascinate({ weight: '400', subsets: ['latin'], variable: '--font-fascinate' })
const ComplaintHeader = () => {
    return (
        <header className='flex flex-col gap-2'>
          <div className="space-y-4">
            <h1 className={`${facinate.className} text-center text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-tight text-red-600`}>
              Concerns <span className="text-yellow-300">Portal</span>
            </h1>
            <p className="text-[clamp(0.875rem,2.5vw,1.125rem)] text-blue-800 ">
              Our Complaints Portal is a secure and user-friendly platform designed
              to help you manage and track your complaints efficiently.
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
        </header>
    )
}

export default ComplaintHeader