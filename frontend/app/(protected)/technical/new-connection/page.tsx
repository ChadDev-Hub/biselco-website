
import NewConnectionDataContainer from "./components/newConnectionData";
import { GetNewConnection } from "@/lib/serverFetch";
import ChangeMeterCardSkeleton from "../change-meter/components/chageMeterCardsSkeleton";
import Pagination from "../change-meter/components/pagination";
import PageNationLoading from "../change-meter/components/pageNationSkeleton";
import { Suspense } from "react";
import { GetNewConnectionStats } from "@/lib/serverFetch";
import Stats from "./components/newConnectionStats";
import StatsSkeleton from "@/app/common/statsSkeleton";
import Headers from './components/header';
type Props = {
    searchParams: Promise<{
        [key: string]: string | number | string[] | undefined
    }>
}


const NewConnectionPage = async ({ searchParams }: Props) => {

    const page = (await searchParams).page
    const newconData = GetNewConnection(Number(page));
   
    const stats = GetNewConnectionStats();
    return (
        <>
        <Headers title="New Connection"/>
            <div className="flex flex-col gap-2">

                <section className="flex justify-center">

                    <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
                        <Stats data={stats} />
                    </Suspense>


                </section>


                <section>
                    <Suspense fallback={<ChangeMeterCardSkeleton />}>
                        <NewConnectionDataContainer data={newconData} />
                    </Suspense>

                </section>

                <section className="w-full flex items-center justify-center">
                    <Suspense fallback={<PageNationLoading />}>
                        <Pagination data={newconData} />
                    </Suspense>
                </section>


            </div>
        </>




    )
}

export default NewConnectionPage;