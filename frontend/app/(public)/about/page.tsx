

import Header from './components/header'
import Main from './components/main';
import BriefHistorySection from './components/brief-history-section';
import StrategySection from './components/strategy-section';
import Return from '@/app/common/Return'
import Footer from './components/footer';
const Page = () => {
  return (
    <article className="min-h-screen text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      <Return/>
        {/* HEADER SECTION */}
        <Header />
        <Main>
            {/* BRIEF HISTORY SECTION */}
            <BriefHistorySection/>
            {/* STRATEGY SECTION */}
            <StrategySection/>
            {/* DATA TABLE */}
          
        </Main>
        <Footer/>
    </article>
  )
}

export default Page