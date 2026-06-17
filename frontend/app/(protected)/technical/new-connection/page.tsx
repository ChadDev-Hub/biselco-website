import NewConnectionDataContainer from "./components/newConnectionData";
import { GetNewConnection } from "@/lib/new-connection";
import ChangeMeterCardSkeleton from "../change-meter/components/chageMeterCardsSkeleton";
import Pagination from "../change-meter/components/pagination";
import PageNationLoading from "../change-meter/components/pageNationSkeleton";
import { Suspense } from "react";
import { GetNewConnectionStats } from "@/lib/serverFetch";
import Stats from "./components/newConnectionStats";
import StatsSkeleton from "@/app/common/statsSkeleton";
import Headers from "./components/header";
import SearchComponent from "../../agma-dashboard/components/Search";
import SearchSkeleton from "../../../common/SearchSkeleton";
type Props = {
  searchParams: Promise<{
    [key: string]: string | number | string[] | undefined;
  }>;
};

const NewConnectionPage = async ({ searchParams }: Props) => {
  const page = (await searchParams).page;
  const search = (await searchParams).search;
  const newconData = GetNewConnection(Number(page), search);

  const stats = GetNewConnectionStats();
  return (
    <div className="min-h-screen w-full">
      <Headers title="New Connection" />
      <main className="flex flex-col gap-2">
        <section className="flex justify-center">
          <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
            <Stats data={stats} />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ChangeMeterCardSkeleton />}>
            <NewConnectionDataContainer
              data={newconData}
              searchComponent={
                <Suspense fallback={<SearchSkeleton />}>
                  <SearchComponent promise={newconData} />
                </Suspense>
              }
            />
          </Suspense>
        </section>

        <section className="w-full flex items-center justify-center">
          <Suspense fallback={<PageNationLoading />}>
            <Pagination data={newconData} />
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default NewConnectionPage;
