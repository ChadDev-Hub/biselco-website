"use client"
import { use, useState, useEffect } from 'react'
import { useWebsocket } from '@/app/utils/websocketprovider'
import Delete from './deleteChangeMeter'
import { DeleteChangeMeter } from '@/app/actions/changeMeter'
import DownloadReport from './download'
import { DownloadChangeMeterReport } from '@/app/actions/changeMeter'
import ImageViewer from '@/app/common/imageViewer'
import { useRouter } from 'next/navigation'
import { useAlert } from '@/app/common/alert'
import Mapbutton from '@/app/complaints/dashboard/components/mapbutton'
import { useSearchParams } from 'next/navigation'
import CardComponent from '@/app/common/card'
import Image from 'next/image';
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
    remarks?: string;
    accomplished_by: string;
    images: string[];
    geom: {
        type: string
        coordinates: number[]
        srid: number
    }
}
type Props = {
    data: Promise<PromiseType>
}

const ChangeMeteCards = ({ data }: Props) => {
    const changeMeter = use(data)
    const [changeMeterData, setChangeMeterData] = useState<ChangeMeter[] | []>([]);
    const [selectedRow, setSelectedRow] = useState<Set<number>>(new Set());
    const router = useRouter();
    const { showAlert } = useAlert();
    const searchParams = useSearchParams()
    const page = searchParams.get("page")
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

    const { message } = useWebsocket()
    useEffect(() => {
        switch (message?.detail) {
            case "post_change_meter":
                if (Number(page) === 1 || page === null) {
                    queueMicrotask(() => {
                        setChangeMeterData((prev) => {
                            const existingData = prev.filter((item) => item.id !== message.data.change_meter_data.id)
                            return [message.data.change_meter_data, ...existingData].slice(0, 9)
                        })
                    })
                } else {
                    showAlert("success", message.message);
                }
                break;
            case "deleted_change_meter":
                router.refresh();
                showAlert("success", message.data)
                break;
            default:
                break;
        }
    }, [message, router, showAlert, page])

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
            <div className='sticky left-2 flex gap-2'>
                <Delete show={showAction} handleDelete={handleDelete} />
                <DownloadReport show={showAction} download={handleDownload} />
            </div>
            <div className='grid grid-cols-1 px-2  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2  place-items-center'>
                {changeMeterData.map((item: ChangeMeter, index) => (
                    <CardComponent className={`w-full max-h-80  flex flex-col justify-center items-center  ${selectedRow.has(item.id) ? "border border-blue-600" : "border border-blue-400"} hover:cursor-pointer bg-radial from-gray-100  to-gray-500  shadow-md shadow-gray-700 rounded-box  `} key={index}>
                        <div className='p-2 w-full relative flex flex-col gap-2'>
                            <input onChange={() => handleSelection(item.id)} className={`checkbox checkbox-md rounded-box absolute top-2 right-2 border-blue-200 ${selectedRow.has(item.id) ? "checked:bg-blue-400" : "checked:bg-blue-400"}`} checked={selectedRow.has(item.id)} title='choose item' type="checkbox" />
                            <div className='flex gap-3 h-20 w-full'>
                                <figure className='relative w-1/3'>
                                    <Image
                                        fill
                                        src={item.images[0]}
                                        className="object-fill border-2 border-white  rounded-box p-0.5 object-center w-full"
                                        sizes="100%"
                                        alt='change meter image' />
                                </figure>
                                <div className='w-full h-full'>
                                    <h2 className='text-md'>ACCOUNT NO:</h2>
                                    <h2 className='text-sm font-bold'>{item.account_no}</h2>
                                    <h3 className='text-sm'>{item.consumer_name}</h3>
                                </div>

                            </div>

                            <div className='card-body  p-0 flex flex-col'>
                                <div className='drop-shadow-md shadow-gray-600 h-full w-full p-4 rounded-box  glass'>
                                    <div className="badge bg-xs text-xs bg-linear-to-tr from-blue-100 to-blue-400  badge-sm absolute  top-2 right-2">CM</div>
                                    <h2 className='card-title text-md'>
                                        Meter Information
                                    </h2>
                                    <div className='grid grid-cols-3'>
                                        <div>
                                            <h1 className='text-xs'>Old Meter</h1>
                                            <h2 className='text-xs font-bold'>{item.pull_out_meter.split("|")[1]}</h2>
                                            <h2 className='text-xs'>Meter Number</h2>
                                            <h3 className='text-xs font-bold'>{item.pull_out_meter.split("|")[0]}</h3>
                                        </div>
                                        <div className='flex items-center justify-center'>
                                            <svg width={25} height={25} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                        </div>
                                        <div>
                                            <h1 className='text-xs'>New Meter</h1>
                                            <h2 className='text-xs font-bold'>{item.new_meter_brand}</h2>
                                            <h2 className='text-xs'>Serial Number</h2>
                                            <h3 className='text-xs font-bold'>{item.new_meter_serial_no}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <h1 className='flex items-center text-sm font-bold'>
                                        <Mapbutton
                                            title='Change Meter Location'
                                            location={
                                                {
                                                    latitude: item.geom.coordinates[1],
                                                    longitude: item.geom.coordinates[0],
                                                    srid: item.geom.srid
                                                }
                                            }
                                        />
                                        <span>{item.location}</span>
                                    </h1>

                                    <div className='grid grid-cols-2 p-2'>
                                        {/* DATE ACCOMPLISHED */}
                                        <div>
                                            <h1 className='text-xs'>Date accomplished</h1>
                                            <h2 className='text-sm font-bold'>{item.date_accomplished}</h2>
                                        </div>
                                        {/* ACCOMPLISHED BY */}
                                        <div>
                                            <h1 className='text-xs'>Accomplished by:</h1>
                                            <h2 className='text-sm font-bold'>{item.accomplished_by}</h2>
                                        </div>

                                    </div>


                                </div>


                            </div>
                        </div>

                    </CardComponent>
                ))}
            </div>
        </>

    )
}

export default ChangeMeteCards;