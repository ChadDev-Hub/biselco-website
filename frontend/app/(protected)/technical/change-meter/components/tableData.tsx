
"use client"
import { use, useState, useEffect } from 'react'
type PromiseType = {
  status: number;
  data: Data;
} | undefined

type Data = {
  data: ChangeMeter[];
  total_page: number;
}

type ChangeMeter = {
  id: number;
  date_accomplished: string;
  account_no: string;
  consumer_name: string;
  location: string;
  pull_out_meter: string;
  pull_out_meter_reading: number;
  new_meter_serial_no: string;
  new_meter_brand: string;
  inital_reading: number;
  remarks: string;
  accomplished_by: string;
  geom: {
    type: string
    coordinates: number[]
  }
}
type Props = {
  data: Promise<PromiseType>
}
const TableData = ({ data }: Props) => {
  const changeMeter = use(data)
  const [changeMeterData, setChangeMeterData] = useState<ChangeMeter[] | []>([])
  useEffect(() => {
    switch (changeMeter?.status) {
      case 200:
        queueMicrotask(() =>
          setChangeMeterData(changeMeter.data.data))
        break;
      default:
        break;
    }
  }, [changeMeter])
  return (
    <tbody className='font-stretch-extra-condensed'>
      {changeMeterData.map((item: ChangeMeter, index: number) => (
        <tr className='glass whitespace-nowrap' key={index}>
          <th className='p-2 glass'>{index}</th>
          <td className='border-r border-dashed border-r-gray-600'>{item.date_accomplished}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.account_no}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.consumer_name}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.location}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.pull_out_meter}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.pull_out_meter_reading}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.new_meter_serial_no}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.new_meter_brand}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.inital_reading}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.remarks}</td>
          <td className='border-r border-dashed border-r-gray-600'>{item.accomplished_by}</td>
        </tr>
      ))}
    </tbody>
  )
}

export default TableData