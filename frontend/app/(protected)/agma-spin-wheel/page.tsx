import Roulette from "./components/roullete";
import { GetRaffleInitialEntries } from "../../../lib/agma";
import RouletteSound from "./components/rouletSound";
import Header from "./components/header";
import Tools from './components/toolsFab';
import SpinTimer from "./components/spinTimer";
import FullScreen from "./components/fullScreen";
import RefreshButton from "./components/refresh";
const Page = () => {
  const initialRaffleEntries = GetRaffleInitialEntries();
  return (
    <RouletteSound>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans p-6 overflow-hidden relative">

        <FullScreen/>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header Container */}
        <Header/>

        <Roulette promise={initialRaffleEntries} />
        <Tools>
          <div>
            <SpinTimer/>
          </div>
          <div>
            <RefreshButton/>
          </div>
        </Tools>
      </div>
      
    </RouletteSound>
  );
};

export default Page;
