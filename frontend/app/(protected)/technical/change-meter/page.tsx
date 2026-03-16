
import React, { use } from 'react'
import ChangeMeterForm from './components/changeMeterForm'
import { queryConsumer } from '@/lib/serverFetch'
type Props = {
  searchParams: Promise<{ consumerSearch?: string }>
}
const ChangeMeterFormPage = ({searchParams}: Props) => {
  const params = use(searchParams)
  const consumers = queryConsumer(params.consumerSearch)
  const data = use(consumers)
  console.log(data)
  return (
    <section className='flex flex-col w-full justify-center items-center p-2'>
      <ChangeMeterForm data={data}/>
    </section>
  )
}

export default ChangeMeterFormPage;