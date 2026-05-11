


import Stats from './components/stats'

import { GetChangeMeter } from '@/lib/serverFetch'
import { Suspense } from 'react'

import TableFooter from './components/tableFooter'

import StatsSkeleton from '@/app/common/statsSkeleton'
import { Archivo_Black } from 'next/font/google'

import ChangeMeteContainer from './components/changeMeterContainer';
import { div } from 'framer-motion/client';
import Pagination from './components/pagination';

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
        <div className='p-2'>
          <section className='flex  flex-col gap-4'>
            <fieldset className='fieldset rounded-box'>
              <legend className={`fieldset-legend  text-lg text-blue-800 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}>Change Meter
              </legend>
              <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
                <Stats data={data} />
              </Suspense>
            </fieldset>

          </section>

        </div>
     
      <div className='h-full w-full'>
        <Suspense fallback={<div>Loading</div>}>
             <ChangeMeteContainer data={data} />
        </Suspense>
             
      </div>
      <div className="w-full flex justify-center">
        <Pagination data={data} pageUrl={pageUrl}/>
      </div>
    </div>
  )
}

export default ChangeMeterFormPage;