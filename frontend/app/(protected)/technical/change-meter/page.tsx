

import ChangeMeterForm from './components/changeMeterForm'
import Stats from './components/stats'
import DashBoardTable from '@/app/common/table'
import TableData from './components/tableData'
import TableHead from './components/tableHead'
import { GetChangeMeter } from '@/lib/serverFetch'
import { Suspense } from 'react'
import TableDataSkeleton from './components/tableDataSkeleton'
import TableFooter from './components/tableFooter'
import PageNationLoading from './components/pageNationSkeleton'
import StatsSkeleton from '@/app/common/statsSkeleton'
import { Archivo_Black } from 'next/font/google'


const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

type Props = {
  searchParams: Promise<{
    page: number
  }>
}
const ChangeMeterFormPage = async ({ searchParams }: Props) => {
  const page = (await searchParams).page
  const data = GetChangeMeter(page);
  const pageUrl = '/technical/change-meter/'
  const columns = ["ID", "DATE ACCOMPLISHED", "ACCOUNT NUMBER", "CONSUMER NAME", "LOCATION", "PULLOUT METER", "PULLOUT METER NUMBER", "NEW METER SERIAL NUMBER", "NEW METER BRAND", "INITIAL READING", "REMARKS", "ACCOMPLISHED BY"];
  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4'>
        <section className='mt-3 flex justify-center'>
          <ChangeMeterForm />
        </section>
        <section className='flex  flex-col gap-4 mt-4'>
          <fieldset className='fieldset rounded-box'>
      <legend className='fieldset-legend'>
        <h2 className={`text-3xl text-blue-800 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}>Stats</h2>
      </legend>
          <Suspense fallback={<StatsSkeleton numberofStats={3}/>}>
            <Stats data={data} />
          </Suspense>
              </fieldset>
          <fieldset className='fieldset h-full'>
            <legend className={`flieldset-legend text-3xl text-blue-800 text-shadow-md text-shadow-amber-600 ${archivoBlack .className}`}>
              Change Meter Table
            </legend>
              <DashBoardTable >
              <TableHead columns={columns} selectable={true} />
              <Suspense fallback={<TableDataSkeleton  row={9} col={12}/>}>
                <TableData data={data} />
              </Suspense>
              <Suspense fallback={<PageNationLoading />}>
                <TableFooter pageUrl={pageUrl} data={data} />
              </Suspense>
            </DashBoardTable>
          </fieldset>
        </section>
      </div>
    </>
  )
}

export default ChangeMeterFormPage;