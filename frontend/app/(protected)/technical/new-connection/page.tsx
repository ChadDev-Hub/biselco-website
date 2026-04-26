
import NewConnectionForm from "./components/NewConnectionForm";
import DashBoardTable from "@/app/common/table";
import TableData from "./components/tableData";
import TableHead from "../change-meter/components/tableHead";
import TableFooter from "../change-meter/components/tableFooter";
import { GetNewConnection } from "@/lib/serverFetch";
import TableDataSkeleton from "../change-meter/components/tableDataSkeleton";
import PageNationLoading from "../change-meter/components/pageNationSkeleton";
import { Suspense } from "react";
import { GetNewConnectionStats } from "@/lib/serverFetch";
import Stats from "./components/newConnectionStats";
import { Archivo_Black } from "next/font/google";

type Props = {
  searchParams: Promise<{
    [key: string]: string | number | string[] | undefined
  }>
}

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });
const NewConnectionPage = async ({searchParams}:Props) => {
    
    const page = (await searchParams).page
    const newconData = GetNewConnection(Number(page));
    const pageUrl = '/technical/new-connection'
    const columns = [
        "DATE ACCOMPLISHED",
        "CONSUMER NAME",
        "LOCATION",
        "METER SERIAL NUMBER",
        "METER BRAND",
        "METER SEALED",
        "INITIAL READING",
        "MULTIPLIER",
        "ACCOMPLISHED BY",
        "REMARKS",
        "IMAGES",
        "Map"
    ]
    const stats = GetNewConnectionStats();
    return (
        
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                        <NewConnectionForm />    
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <fieldset className="fieldset">
                            <legend className={`text-3xl text-blue-800 text-shadow-md text-shadow-amber-600  ${archivoBlack.className}`}>Stats</legend>
                            <Stats data={stats} />
                        </fieldset>
                        
                    </div>
                    <div>
                        <DashBoardTable>
                        
                        <TableHead columns={columns} selectable={true} />
                        <Suspense fallback={<TableDataSkeleton row={12} col={columns.length} />}>
                                <TableData data={newconData}/>
                        </Suspense>
                        <Suspense fallback={<PageNationLoading />}>
                            <TableFooter pageUrl={pageUrl} data={newconData} />
                        </Suspense>
                        
                    </DashBoardTable>

                    </div>
                    
                </div>
            </div>

      
    )
}

export default NewConnectionPage;