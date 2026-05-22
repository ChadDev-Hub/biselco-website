import HomePageHeader from './components/header';
import HomePageTools from './components/tools';
import InstallPrompt from './common/InstallPrompt';



export default function CooperativeHome() {
  return (
    <div className="min-h-screen bg-base-300 pb-20">
      <InstallPrompt />
      {/* Header */}
      <HomePageHeader />
      <main className="max-w-2xl mx-auto px-4 -mt-6">
        {/* Tools Grid */}
        <HomePageTools/>
        {/* Events */}
        <section className="w-full space-y-3 mt-10">
          <h1 className="font-bold text-lg">Events</h1>
        </section>
        
      </main>
    </div>
  );
}

