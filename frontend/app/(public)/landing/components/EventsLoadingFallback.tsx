'use client';

import { motion } from 'framer-motion';

export default function EventsLoadingFallback() {
  return (
    <motion.div
      className="text-center py-8"
      animate={{ opacity: [0.5, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
    >
      <div className="grid place-self-center gap-28 grid-row w-full max-w-2xl bg-base-100 rounded-box p-4 shadow border border-slate-200">
        <div >
          <div className="skeleton w-[80%] h-12 rounded-full border border-slate-300">

          </div>
        </div>
        <div className="grid grid-cols-2">
           <div className="place-content-center place-items-center space-y-2">
              <div className="skeleton w-60 h-7 rounded-full border border-slate-300">

              </div>
              <div className="skeleton w-30 h-6 rounded-full border border-slate-300">

              </div>
              <div className="skeleton w-50 h-5 rounded-full border border-slate-300">

              </div>
              <div className="skeleton w-50 h-5 rounded-full border border-slate-300 place-self-start">

              </div>
              <div className="flex place-self-start">
                  {Array.from({length: 4}).map((_, index) => (
                    <div key={index} className="skeleton w-10 h-10 rounded-box border border-slate-300 mr-2">
                    </div>
                  ))}
              </div>
           </div>

           <div className="flex items-start justify-center">
             <div className="skeleton w-30 h-30  rounded-full border border-slate-300">

             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
