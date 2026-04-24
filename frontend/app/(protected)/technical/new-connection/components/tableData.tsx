"use client"
import { use, useState, useEffect } from "react"
import ImageViewer from "@/app/common/imageViewer"
import Mapbutton from "@/app/complaints/dashboard/components/mapbutton"
import DownloadReport from '../../change-meter/components/download';
import Delete from "../../change-meter/components/deleteChangeMeter";
import { useWebsocket } from "@/app/utils/websocketprovider";
import { deleteNewConnection } from "@/app/actions/newConnectionMeter"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/common/alert";
import { DownloadNewConnectionReport } from "@/app/actions/newConnectionMeter";
type PromiseType = {
    status: number;
    data: data
}

type data = {
    data: NewConnectionData[]
}


type NewConnectionData = {
    id: number;
    date_accomplished: string;
    consumer_name: string;
    location: string;
    meter_serial_no: string;
    meter_brand: string;
    meter_sealed: string;
    initial_reading: number;
    multiplier: number;
    accomplished_by: string;
    remarks: string;
    images: string[];
    geom: {
        type: string;
        geometry: number[];
        srid: number;
    }
}

type Props = {
    data: Promise<PromiseType>
}

const TableData = ({ data }: Props) => {
    const newConnection = use(data)
    const [newConnectionData, setNewConnectionData] = useState<NewConnectionData[] | []>([])
    const [selectedRow, setSelectedRow] = useState<Set<number>>(new Set())
    const [showAction, setShowAction] = useState(() => {
        if (selectedRow.size > 0) return true
        else return false
    })
    const searchParams = useSearchParams()
    const page = searchParams.get("page")
    const router = useRouter()
    const {showAlert} = useAlert()

    useEffect(()=>{
        if (selectedRow.size > 0) {
            queueMicrotask(()=>{
                setShowAction(true);
            })
        }else{
            queueMicrotask(()=>{
                setShowAction(false);
            })
        }
    },[selectedRow])


    useEffect(() => {
        switch (newConnection?.status) {
            case 200:
                queueMicrotask(() => {
                    setNewConnectionData(newConnection.data.data)
                })
                break;
            default:
                break;
        }
    })

    // WEBSOCKET
    const {message} = useWebsocket()
    useEffect(()=>{
        switch (message?.detail) {
            case "new_connection_created":
                queueMicrotask(()=>{
                        router.refresh();
                })
                showAlert("success", message.data)
                break;
            case "new_connection_deleted":
                queueMicrotask(()=>{
                    router.refresh();
                })
                break;
            default:
                break;
        }
    },[message, router, showAlert])


    // SELECTION OF ROW
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


    // DELETE DATA
    const handleDelete = async () =>{
        const res = await deleteNewConnection(selectedRow, Number(page));
        if (res?.status === 200) {
            setSelectedRow(new Set())
        };
    };
    const handleDownload = async(formData: object) => {
        const data = {
            ...formData,
            items: Array.from(selectedRow),
        }
        const res = await DownloadNewConnectionReport(data);
        // DOWNLOAD REPORT IF 
        if (res?.status === 200) {
        const aref = document.createElement('a');
        aref.href = URL.createObjectURL(res.data);
        aref.download = "new_connection_report.xlsx";
        document.body.appendChild(aref);
        aref.click();
        aref.remove();}
    }
    return (
        <>


            <tbody className="text-shadow-transparent">
                {newConnectionData.map((item: NewConnectionData, index: number) =>
                    <tr key={index} className=' glass text-sm  whitespace-nowrap border border-dashed border-b-gray-600 hover:bg-base-100'>
                        <th title='' className='border-r z-10 border-dashed border-r-gray-600 '>
                            <input className="checkbox checkbox-xs checkbox-success hover:cursor-pointer "
                                checked={selectedRow.has(item.id)}
                                onChange={() => handleSelection(item.id)}
                                title='choose item' type="checkbox" />
                        </th>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.date_accomplished}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.consumer_name}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.location}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.meter_serial_no}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.meter_brand}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.meter_sealed}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.initial_reading}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.multiplier}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.accomplished_by}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600">{item.remarks}</td>
                        <td className="text-sm table-cell hover:bg-amber-200 hover:cursor-pointer border-r border-dashed border-r-gray-600 text-center">
                            {item.images.length > 0 ?
                                <ImageViewer image={item.images[0]} /> : "No Image"}
                        </td>
                        <td>
                            <Mapbutton
                                title="New Connection Meter Map"
                                location={
                                    {
                                        latitude: item.geom.geometry[1],
                                        longitude: item.geom.geometry[0],
                                        srid: item.geom.srid
                                    }
                                }
                            />
                        </td>
                    </tr>
                )}

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