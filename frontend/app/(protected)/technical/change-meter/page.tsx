
import React, { use } from 'react'
import ChangeMeterForm from './components/changeMeterForm'
import { queryConsumer } from '@/lib/serverFetch'
type Props = {
  searchParams: Promise<{ consumer?: string }>
}
const ChangeMeterFormPage = ({searchParams}: Props) => {
  const params = use(searchParams)
  const consumers = queryConsumer(params.consumer)
  return (
    <section className='flex flex-col w-full justify-center items-center p-2'>
      <ChangeMeterForm data={consumers}/>
    </section>
  )
}

export default ChangeMeterFormPage;