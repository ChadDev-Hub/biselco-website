import ChangeMeterStats from "./components/stats";
import { Suspense } from "react";
import StatsSkeleton from "@/app/common/statsSkeleton";
import ChangeMeterCardSkeleton from "./components/chageMeterCardsSkeleton";
import ChangeMeteContainer from "./components/changeMeterContainer";
import PageNationLoading from "./components/pageNationSkeleton";
import Pagination from "./components/pagination";
import Headers from "../new-connection/components/header";
import SearchComponent from "../../agma-dashboard/components/Search";
import SearchSkeleton from "../../../common/SearchSkeleton";
import {GetChangeMeter} from "@/lib/private-api/server-side/change-meter";
type Props = {
  searchParams: Promise<{
    page: number;
    search: string;
  }>;
};
const ChangeMeterFormPage = async ({ searchParams }: Props) => {
  const {page, search } = (await searchParams);
  const data = GetChangeMeter(page, search);
  return (
    <div className="min-h-screen w-full space-y-2 bg-base-300 pb-20">
      <Headers title="Change Meter" />
      <main className="max-w-6xl mx-auto px-4 flex flex-col gap-3">
        <section className=" w-full justify-center flex ">
          <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
            <ChangeMeterStats data={data} />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ChangeMeterCardSkeleton />}>
            <ChangeMeteContainer
              searchComponent={
                <Suspense fallback={<SearchSkeleton/>}>
                  <SearchComponent promise={data} />
                </Suspense>
              }
              data={data}
            />
          </Suspense>
        </section>

        <section className="w-full flex justify-center">
          <Suspense fallback={<PageNationLoading />}>
            <Pagination data={data} />
          </Suspense>
        </section>
      </main>
    </div>
  );
};

export default ChangeMeterFormPage;
