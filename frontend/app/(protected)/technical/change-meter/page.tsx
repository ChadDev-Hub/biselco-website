

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
import ChangeMeteCards from './components/changeMeterCards'

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
  const columns = [
    "ID",
    "DATE ACCOMPLISHED",
    "ACCOUNT NUMBER",
    "CONSUMER NAME",
    "LOCATION",
    "PULLOUT METER",
    "PULLOUT METER NUMBER",
    "NEW METER SERIAL NUMBER",
    "NEW METER BRAND",
    "INITIAL READING",
    "REMARKS",
    "ACCOMPLISHED BY",
    "IMAGES",
    "MAP"];
  return (
    <div className='flex flex-col gap-2'>
      <div className=''>
          <section className='mt-3   flex justify-center'>
            <ChangeMeterForm />
          </section>
        </div>
        <div className='p-2'>
          <section className='flex  flex-col gap-4'>
            <fieldset className='fieldset rounded-box'>
              <legend className={`fieldset-legend  text-lg text-blue-800 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}>Stats
              </legend>
              <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
                <Stats data={data} />
              </Suspense>
            </fieldset>

          </section>

        </div>
     
      <div className='h-full w-full'>
              <ChangeMeteCards data={data} />
      </div>
    </div>
  )
}

export default ChangeMeterFormPage;