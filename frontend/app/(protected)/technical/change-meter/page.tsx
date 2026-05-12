
import Stats from './components/stats'
import { GetChangeMeter } from '@/lib/serverFetch'
import { Suspense } from 'react'
import StatsSkeleton from '@/app/common/statsSkeleton'
import { Archivo_Black } from 'next/font/google'
import ChangeMeterCardSkeleton from './components/chageMeterCardsSkeleton'
import ChangeMeteContainer from './components/changeMeterContainer';
import PageNationLoading from './components/pageNationSkeleton'
import Pagination from './components/pagination';

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"], display: "swap" });

type Props = {
  searchParams: Promise<{
    page: number
  }>
}
const ChangeMeterFormPage = async ({ searchParams }: Props) => {
  const page = (await searchParams).page
  const data = GetChangeMeter(page);
  const pageUrl = '/technical/change-meter/'
  return (
    <div className='flex flex-col gap-2 '>
        
          <section className='px-2'>
            <fieldset className='fieldset'>
              <legend className={` text-lg text-blue-800 text-shadow-md text-shadow-amber-600 ${archivoBlack.className}`}>Change Meter
              </legend>
              <Suspense fallback={<StatsSkeleton numberofStats={3} />}>
                <Stats data={data} />
              </Suspense>
            </fieldset>
          </section>

     
      <section className='px-2'>
         <Suspense fallback={<ChangeMeterCardSkeleton/>}>
             <ChangeMeteContainer data={data} />
        </Suspense>
      </section>
       

      <section className="w-full flex justify-center">
        <Suspense fallback={<PageNationLoading />}>
          <Pagination data={data} pageUrl={pageUrl}/>
        </Suspense>
        
      </section>
    </div>
  )
}

export default ChangeMeterFormPage;