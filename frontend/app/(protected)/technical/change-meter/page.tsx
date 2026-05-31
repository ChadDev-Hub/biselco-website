import Stats from "./components/stats";
import { GetChangeMeter } from "@/lib/serverFetch";
import { Suspense } from "react";
import StatsSkeleton from "@/app/common/statsSkeleton";
import ChangeMeterCardSkeleton from "./components/chageMeterCardsSkeleton";
import ChangeMeteContainer from "./components/changeMeterContainer";
import PageNationLoading from "./components/pageNationSkeleton";
import Pagination from "./components/pagination";
import Headers from "../new-connection/components/header";
import SearchComponent from "../../agma-dashboard/components/Search";
type Props = {
  searchParams: Promise<{
    page: number;
  }>;
};
const ChangeMeterFormPage = async ({ searchParams }: Props) => {
  const page = (await searchParams).page;
  const data = GetChangeMeter(page);
  return (
    <>
      <Headers title="Change Meter" />
      <main className="flex flex-col gap-2 w-full max-w-6xl ">
        <section className=" w-full justify-center flex ">
          <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
            <Stats data={data} />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ChangeMeterCardSkeleton />}>
            <ChangeMeteContainer
              searchComponent={
                <Suspense fallback={<div>loading</div>}>
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
    </>
  );
};

export default ChangeMeterFormPage;
