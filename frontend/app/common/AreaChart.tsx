"use client";

import { use } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


type PromiseType = {
    status: number;
    data: object[];
}
type Props = {
    prom: Promise<PromiseType>
    title: string
}

const SimpleAreaChart = ({ prom, title }: Props) => {
    const data = use(prom);
    return (
        <div className='w-full h-full max-h-90 rounded-box rop-shadow-md shadow-md glass p-4 flex flex-col'>

            <h1 className='text-2xl font-bold text-blue-600 text-shadow-md text-shadow-amber-600'>
                {title}
            </h1>

            {data.data.length > 0 ? <div className="w-full h-fit sm:h-100 md:h-100">

                <AreaChart
                    style={{ width: "100%", height: "100%", maxHeight: "300px" }}
                    data={data.data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    onContextMenu={(_, e) => e.preventDefault()}
                    responsive
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    

                    <XAxis dataKey="name" width="auto"  tick={{ fontSize: 8, fill: 'black', angle: -45}} />

                    <YAxis width="auto" tick={{ fontSize: 8, fill: 'black' }} />
                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                    />
                </AreaChart>
            </div> :
                 <div className='flex items-center justify-center h-full'>
                    <h1 className='text-2xl font-bold text-shadow-md text-shadow-amber-600 text-blue-600'>No Data Available</h1>
                </div>}
        </div>
    )
}

export default SimpleAreaChart;