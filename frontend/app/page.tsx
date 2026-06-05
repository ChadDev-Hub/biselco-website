import HomePageHeader from './components/header';
import HomePageTools from './components/tools';
import InstallPrompt from './common/InstallPrompt';
import Events from "./(public)/landing/components/agmaeventContainer";
import {GetAgmaEvents} from "../lib/serverFetch";
import {Suspense} from 'react';
export default function CooperativeHome() {
  const agmaEvent = GetAgmaEvents();
  return (
    <div className="min-h-screen w-full bg-base-300 pb-20">
      <InstallPrompt />
      {/* Header */}
      <HomePageHeader />
      <main className="max-w-2xl mx-auto px-4 -mt-6">
        {/* Tools Grid */}
        <HomePageTools/>
        {/* Events */}
        <section className="w-full space-y-3 mt-10">
          <Suspense fallback={<div>Loading...</div>}>
            <Events event={agmaEvent}/>
          </Suspense>
          
        </section>
        
      </main>
    </div>
  );
}

