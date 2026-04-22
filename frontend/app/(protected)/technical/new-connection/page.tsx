
import NewConnectionForm from "./components/NewConnectionForm";
import DashBoardTable from "@/app/common/table";
import TableData from "./components/tableData";
import TableHead from "../change-meter/components/tableHead";
import TableFooter from "../change-meter/components/tableFooter";
import { GetNewConnection } from "@/lib/serverFetch";
import TableDataSkeleton from "../change-meter/components/tableDataSkeleton";
import PageNationLoading from "../change-meter/components/pageNationSkeleton";
import { Suspense } from "react";



type Props = {
  searchParams: Promise<{
    [key: string]: string | number | string[] | undefined
  }>
}
const NewConnectionPage = async ({searchParams}:Props) => {
    
    const page = (await searchParams).page
    console.log(page)
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
    return (
        
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <NewConnectionForm />
                </div>

                <div >
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

      
    )
}

export default NewConnectionPage;