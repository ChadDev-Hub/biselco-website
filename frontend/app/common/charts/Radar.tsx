"use client"
import {  Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';
import { use, useState, useEffect } from 'react';
import {useWebsocket} from '@/app/utils/websocketprovider';

type PromiseType = {
    status: number,
    data?: Data[]
    error?: string
}
type Props = {
    prom: Promise<PromiseType>;
    valueName: string;
    title: string
}

type Data = {
    name: string;
    value?: number;
}

const RadarChartSimple = ({ prom, valueName, title }: Props) => {
    const inialData = use(prom);
    const [data, setData] = useState<Data[] | []>([]);
    useEffect(()=>{
        const setIntialData = async () => {
            setData(inialData.data || []);
        }
        setIntialData();
    }, [inialData]);

    const {message} = useWebsocket();
    useEffect(()=>{
        if (message?.detail === "new_registered"){
            const update = async () => {
                setData(message.registered_per_municipality ?? []);
            }
            update();
        }
    },[message]);

    return (
        <div className='w-full h-full max-h-90  rounded-box drop-shadow-md shadow-md glass p-4 flex flex-col'>
            <h1 className='text-md font-bold  text-shadow-md '>{title}</h1>
             {data.length > 0 ? <div className="w-full h-fit sm:h-full md:h-full lg:h-full">
                <RadarChart
                    style={{width:"100%", height:"100%", maxHeight:"300px"}}
                    responsive
                    outerRadius="80%"
                    data={data}
                    
                >
                    <PolarGrid className='stroke-gray-600' />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fill: 'black' }} />
                    <Tooltip cursor={false} />
                    <Radar name={valueName} dataKey="value" stroke="#0055DA" fill="#4274D9" fillOpacity={0.6} />
                </RadarChart>
    
             </div> : 

             <div className='flex items-center justify-center h-full'>
                    <h1 className='text-md font-bold text-shadow-md '>No Data Available</h1>
                </div>
             }
        </div>
        
    )
}
export default RadarChartSimple;