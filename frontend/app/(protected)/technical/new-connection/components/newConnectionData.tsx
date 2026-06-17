"use client"
import { use, useState, useEffect } from "react"
import NewConnectionCard from "./newConnectionCard";
import { useWebsocket } from "@/app/utils/websocketprovider";
import { deleteNewConnection } from "@/app/actions/newConnectionMeter"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/common/alert";
import { DownloadNewConnectionReport } from "@/app/actions/newConnectionMeter";
import Delete from "../../change-meter/components/deleteChangeMeter";
import DownloadReport from "../../change-meter/components/download";
import NewConnectionForm from "./NewConnectionForm";
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
        coordinates: number[];
        srid: number;
    }
}

type Props = {
    data: Promise<PromiseType>
    searchComponent: React.ReactNode;
}

const NewConnectionDataContainer = ({ data, searchComponent }: Props) => {
    const newConnection = use(data)
    const [newConnectionData, setNewConnectionData] = useState<NewConnectionData[] | []>([])
    const [selectedRow, setSelectedRow] = useState<Set<number>>(new Set())
    const searchParams = useSearchParams()
    const [isActive, setisActive] = useState(false)
    const page = searchParams.get("page")
    const router = useRouter()
    const { showAlert } = useAlert()


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
    }, [newConnection])


    useEffect(() => {
        if (selectedRow.size > 0) {
            queueMicrotask(() => setisActive(true));
        } else queueMicrotask(() => setisActive(false));
    }, [selectedRow]);

    // WEBSOCKET
    const { message } = useWebsocket()
    useEffect(() => {
        switch (message?.detail) {
            case "new_connection_created":
                if (Number(page) === 1 || page === null) {
                    queueMicrotask(() => {
                        setNewConnectionData((prev) => {
                            const existingData = prev.filter((item) => item.id !== message.data.new_connection.id);
                            const newData = [message.data.new_connection, ...existingData].slice(0, 9);
                            return newData
                        })
                    })

                }
                else {
                    showAlert("success", message.message)
                }

                break;
            case "new_connection_deleted":
                queueMicrotask(() => {
                    router.refresh();
                })
                break;
            default:
                break;
        }
    }, [message, router, showAlert, page])



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
    const handleDelete = async () => {
        const res = await deleteNewConnection(selectedRow, Number(page));
        if (res?.status === 200) {
            setSelectedRow(new Set())
        };
    };
    const handleDownload = async (formData: object) => {
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
            aref.remove();
        }
    }
    return (
        <>
            <div className="w-full flex justify-center px-2">
                {/* NAV BAR */}
                <div className="navbar max-w-2xl items-center  bg-base-100 border-gray-100 shadow-md w-full  px-2 flex justify-between glass mb-2 rounded-box">
                    {/* TOOLS */}
                    <div className="flex items-center gap-2">
                        <div>
                            <Delete
                                is_active={isActive}
                                show={true}
                                handleDelete={handleDelete}
                            />
                        </div>
                        <div>
                            <DownloadReport
                                isactive={isActive}
                                show={true}
                                download={handleDownload}
                            />
                        </div>

                        <div>
                            <NewConnectionForm />
                        </div>
                        {selectedRow.size > 0 && <div className="badge badge-outline badge-secondary text-xs font-bold">
                            <span >Items: </span><span>{selectedRow.size === 0 ? "" : selectedRow.size}</span>
                        </div>}

                    </div>
                    {/*Search*/}
                    <div>

                        {searchComponent}
                    </div>

                </div>

            </div>
            {/* NEW CONNECTION CARD */}
            <div className="flex justify-center">
                <div className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 place-items-center">
                    {newConnectionData.map((item: NewConnectionData, index) => (
                        <NewConnectionCard
                            key={index}
                            consumer_name={item.consumer_name}
                            newmeter_brand={item.meter_brand}
                            newmeter_serial={item.meter_serial_no}
                            location={item.location}
                            lat={item.geom.coordinates[1]}
                            lon={item.geom.coordinates[0]}
                            srid={item.geom.srid}
                            date_accomplished={item.date_accomplished}
                            selectedRow={selectedRow}
                            id={item.id}
                            handleSelection={handleSelection}
                            accomplished_by={item.accomplished_by}
                            initial_reading={item.initial_reading}
                            image={item.images[0]}
                        />
                    ))}

                </div>

            </div>


        </>

    )
}

export default NewConnectionDataContainer;