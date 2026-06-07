import Roulette from "./components/roullete"
import { GetRaffleInitialEntries } from '../../../lib/agma';
import RouletteSound from './components/rouletSound';


const Page = () => {
  const initialRaffleEntries = GetRaffleInitialEntries();
  return (
    <RouletteSound>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans p-6 overflow-hidden relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />


      {/* Header Container */}
      <div className="text-center z-10 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent sm:text-5xl">
         BISELCO Giveaway Roulette
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-sm mx-auto">
          Spin to WIN exclusive Biselco Rewards🎉.
        </p>
      </div>
  
      <Roulette promise={initialRaffleEntries} />
    </div>

    </RouletteSound>
    
  )
}

export default Page