import PageHeader from "./components/header";
import HomePageTools from "./components/tools";
import InstallPrompt from "../../common/InstallPrompt";
import Events from "../../(public)/landing/components/agmaeventContainer";
import { GetAgmaEvents } from "@/lib/public-api/events";
import { Suspense } from "react";
import EventLoadingFallback from "../../(public)/landing/components/EventsLoadingFallback";
import PullToRefresh from "../../common/PulltoRefresh";

export default function CooperativeHome() {
  const agmaEvent = GetAgmaEvents();
  return (
    <PullToRefresh>
      <div className="w-full px-2">
        <InstallPrompt />
        {/* Header */}
        <PageHeader title={{
          title: "Welcome to",
          subtitle: "Busuanga Island Electric Cooperative, Inc."}
        } />
        <main className="max-w-2xl  mx-auto px-4 -mt-6">
          {/* Tools Grid */}
          <Suspense fallback={<div>Loading...</div>}>
            <HomePageTools />
          </Suspense>
          {/* Events */}
          <section className="w-full space-y-3 mt-10">
            <Suspense fallback={<EventLoadingFallback />}>
              <Events event={agmaEvent} />
            </Suspense>
          </section>
        </main>
      </div>
    </PullToRefresh>
  );
}
