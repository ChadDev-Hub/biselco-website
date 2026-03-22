
"use client"
import { use, useState, useEffect } from 'react'
import { useWebsocket } from '@/app/utils/websocketprovider'
import TableFooter from './tableFooter'
import Delete from './deleteChangeMeter'
import { DeleteChangeMeter } from '@/app/actions/changeMeter'
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
  initial_reading: number;
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
  const [selectedRow, setSelectedRow] = useState<Set<number>>(new Set())
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(()=>{
    if (selectedRow.size > 0) return true
    else return false
  })
  useEffect(() => {
    switch (changeMeter?.status) {
      case 200:
        queueMicrotask(() => {
          setChangeMeterData(changeMeter.data.data);
          setTotalPage(changeMeter.data.total_page);
          setLoading(false);
        })
        break;
      default:
        break;
    }
  }, [changeMeter])

  const message = useWebsocket()
  useEffect(() => {
    switch (message?.detail) {
      case "post_change_meter":
        queueMicrotask(() => {
          setChangeMeterData(message.data)
          setTotalPage(message.total_page)
        })
        break;
      case "deleted_change_meter":
        queueMicrotask(() => {
          setChangeMeterData(message.data)
          setTotalPage(message.total_page)
        })
        break;
        
      default:
        break;
    }
  }, [message])

  useEffect(() => {
    if (selectedRow.size > 0) setShowDelete(true)
    else setShowDelete(false)
  }, [selectedRow])

  const handleSelection = (item: number) => {
    setSelectedRow(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item)
      }
      return newSet;
    })
  }

  const handleDelete = async() => {
    const res = await DeleteChangeMeter(selectedRow)
    if (res?.status === 200) {
      setSelectedRow(new Set())
      setChangeMeterData((prev) => prev.filter((item) => item.id !== res.data))
    }
  }

  return (
    <>
      <tbody className='font-stretch-extra-condensed'>
        {changeMeterData.map((item: ChangeMeter, index: number) => (
          <tr className='glass whitespace-nowrap' key={index}>
            <th title='' className='border-r border-dashed border-r-gray-600'>
              <input checked={selectedRow.has(item.id)} onChange={() => handleSelection(item.id)} title='choose item' type="checkbox" />
            </th>
            <td className='p-2 glass'>{index}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.date_accomplished}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.account_no}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.consumer_name}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.location}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.pull_out_meter}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.pull_out_meter_reading}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.new_meter_serial_no}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.new_meter_brand}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.initial_reading}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.remarks}</td>
            <td className='border-r border-dashed border-r-gray-600'>{item.accomplished_by}</td>
          </tr>
        ))}
        
      </tbody>
      <TableFooter data={totalPage} loading={loading}  setLoading={setLoading}>
        <Delete show={showDelete} handleDelete = {handleDelete}/>
        </TableFooter>
    </>
  )
}

export default TableData