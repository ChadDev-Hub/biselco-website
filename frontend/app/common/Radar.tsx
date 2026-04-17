"use client"
import {  Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts';
import { use } from 'react';


type PromiseType = {
    status: number,
    data: object[]
}
type Props = {
    prom: Promise<PromiseType>;
    valueName: string;
    title: string
}


const RadarChartSimple = ({ prom, valueName, title }: Props) => {
    const data = use(prom);
    return (
        <div className='w-full h-full max-h-90  rounded-box drop-shadow-md shadow-md glass p-4 flex flex-col'>
            <h1 className='text-2xl font-bold text-blue-600 text-shadow-md text-shadow-amber-600'>{title}</h1>
             {data.data.length > 0 ? <div className="w-full h-fit sm:h-full md:h-full lg:h-full">
                <RadarChart
                    style={{width:"100%", height:"100%", maxHeight:"300px"}}
                    responsive
                    outerRadius="80%"
                    data={data.data}
                    
                >
                    <PolarGrid className='stroke-gray-600' />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 8, fill: 'black' }} />
                    <Tooltip cursor={false} />
                    <Radar name={valueName} dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
    
             </div> : 

             <div className='flex items-center justify-center h-full'>
                    <h1 className='text-2xl font-bold text-shadow-md text-shadow-amber-600 text-blue-600'>No Data Available</h1>
                </div>
             }
           
        </div>
        
    )
}
export default RadarChartSimple;