
import NewConnectionDataContainer from "./components/newConnectionData";
import { GetNewConnection } from "@/lib/serverFetch";
import ChangeMeterCardSkeleton from "../change-meter/components/chageMeterCardsSkeleton";
import Pagination from "../change-meter/components/pagination";
import PageNationLoading from "../change-meter/components/pageNationSkeleton";
import { Suspense } from "react";
import { GetNewConnectionStats } from "@/lib/serverFetch";
import Stats from "./components/newConnectionStats";
import { Archivo_Black } from "next/font/google";
import StatsSkeleton from "@/app/common/statsSkeleton";

type Props = {
    searchParams: Promise<{
        [key: string]: string | number | string[] | undefined
    }>
}

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });
const NewConnectionPage = async ({ searchParams }: Props) => {

    const page = (await searchParams).page
    const newconData = GetNewConnection(Number(page));
    const pageUrl = '/technical/new-connection'
    const stats = GetNewConnectionStats();
    return (

        <div className="flex flex-col gap-2">

            <section className="px-2">
                <fieldset className="fieldset">
                    <legend className={`text-lg text-blue-800 text-shadow-md text-shadow-amber-600  ${archivoBlack.className}`}>New Connection</legend>
                    <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
                    <Stats data={stats} />
                    </Suspense>
                </fieldset>

            </section>


            <section className="px-2">
                <Suspense fallback={<ChangeMeterCardSkeleton />}>
                    <NewConnectionDataContainer data={newconData} />
                </Suspense>

            </section>

            <section className="w-full flex items-center justify-center">
                <Suspense fallback={<PageNationLoading />}>
                    <Pagination data={newconData} pageUrl={pageUrl} />
                </Suspense>
            </section>


        </div>



    )
}

export default NewConnectionPage;