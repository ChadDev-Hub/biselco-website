

import ChangeMeterForm from './components/changeMeterForm'
import Stats from './components/stats'
import DashBoardTable from '@/app/common/table'
import TableData from './components/tableData'
import TableHead from './components/tableHead'
import { GetChangeMeter } from '@/app/actions/changeMeter'
import { Suspense } from 'react'
import TableDataSkeleton from './components/tableDataSkeleton'
import { Fascinate } from 'next/font/google'
import TableFooter from './components/tableFooter'
import PageNationLoading from './components/pageNationSkeleton'
const facinate = Fascinate({ weight: "400", subsets: ["latin"] });
type Props = {
  searchParams: Promise<{
    page: number
  }>
}
const ChangeMeterFormPage = async ({ searchParams }: Props) => {
  const page = (await searchParams).page
  const data = GetChangeMeter(page);
  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4'>
        <section className='mt-3 flex justify-center'>
          <ChangeMeterForm />
        </section>
        <section className='flex  flex-col gap-4 mt-4'>
          <Stats />
          <fieldset className='fieldset h-full'>
            <legend className={`flieldset-legend text-3xl text-blue-800 text-shadow-md text-shadow-amber-600 ${facinate.className}`}>
              Change Meter Table
            </legend>
            
              <DashBoardTable >
              <TableHead />
              <Suspense fallback={<TableDataSkeleton />}>
                <TableData data={data} />
              </Suspense>
              <Suspense fallback={<PageNationLoading/>}>
                <TableFooter data={data} />
              </Suspense>
            </DashBoardTable>
          </fieldset>
        </section>
      </div>
    </>
  )
}

export default ChangeMeterFormPage;