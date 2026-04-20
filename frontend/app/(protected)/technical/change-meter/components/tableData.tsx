
"use client"
import { use, useState, useEffect } from 'react'
import { useWebsocket } from '@/app/utils/websocketprovider'
import Delete from './deleteChangeMeter'
import { DeleteChangeMeter } from '@/app/actions/changeMeter'
import DownloadReport from './download'
import { DownloadChangeMeterReport } from '@/app/actions/changeMeter'
import ImageViewer from '@/app/common/imageViewer'


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
  images: {
    id: number;
    image: string;
  }[];
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

  const [showAction, setShowAction] = useState(() => {
    if (selectedRow.size > 0) return true
    else return false
  })
  useEffect(() => {
    switch (changeMeter?.status) {
      case 200:
        queueMicrotask(() => {
          setChangeMeterData(changeMeter.data.data);
        })
        break;
      default:
        break;
    }
  }, [changeMeter])

  const {message} = useWebsocket()
  useEffect(() => {
    switch (message?.detail) {
      case "post_change_meter":
        queueMicrotask(() => {
          setChangeMeterData((prev)=>{
            const existing = prev.filter((item) => item.id !== message.data.id)
            return [message.data,...existing]})
        })
        break;
      case "deleted_change_meter":
        queueMicrotask(() => {
          setChangeMeterData((prev)=> prev.filter((item) => message.data.includes(item.id) === false))
        })
        break;
      default:
        break;
    }
  }, [message])

  useEffect(() => {
    if (selectedRow.size > 0) {
      queueMicrotask(() => setShowAction(true))
    }
    else
      queueMicrotask(() => setShowAction(false))
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

  const handleDelete = async () => {
    const res = await DeleteChangeMeter(selectedRow)
    if (res?.status === 200) {
      setSelectedRow(new Set())
      setChangeMeterData((prev) => prev.filter((item) => item.id !== res.data))
    }
  }

  const handleDownload = async (formData: object) => {
    const data = {
      ...formData,
      items: Array.from(selectedRow),
    };
    const res = await DownloadChangeMeterReport(data)
    if (res?.status === 200) {
      const blob = res.data;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = "change_meter_report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSelectedRow(new Set())
    }
  }
  return (
    <>
      <tbody className='font-stretch-extra-condensed'>
        {changeMeterData.map((item: ChangeMeter, index: number) => (
          <tr className='glass whitespace-nowrap' key={index}>
            <th title='' className='border-r z-10 border-dashed border-r-gray-600'>
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
            <td className='border-r flex text-center items-center jusitify-center border-dashed border-r-gray-600'>
              {item.images.length > 0 ? <ImageViewer image={item.images[0].image} /> : "No Image"}
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        {showAction &&
          <tr>
            <th colSpan={13}>
              <div className='sticky left-2 flex gap-2'>
                <Delete show={showAction} handleDelete={handleDelete} />
                <DownloadReport show={showAction} download={handleDownload} />
              </div>
            </th>
          </tr>}
      </tfoot>

    </>
  )
}

export default TableData