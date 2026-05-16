import HomePageHeader from './components/header';
import HomePageTools from './components/tools';



export default function CooperativeHome() {
  return (
    <div className="min-h-screen bg-base-300 pb-20">
      {/* Header */}
      <HomePageHeader />
      <main className="max-w-2xl mx-auto px-4 -mt-6">

        {/* Tools Grid */}
        <HomePageTools/>
      </main>
    </div>
  );
}

