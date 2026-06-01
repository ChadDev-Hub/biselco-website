
'use client'
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from "recharts"



const SimpleLineChart = () => {
    const data = [
    {
        "name": "2026-05-21",
        "coron": 5,
        "culion": 1
    },
    {
        "name": "2026-05-22",
        "coron": 6,
        "culion": null
    }
    ]
    const dataKey = ["coron", "culion"]
  return (
    <LineChart
      style={
        {
            width: "100%",
            height: "100%"
        }
      }
      data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip/>
        <Legend />
        {dataKey.map((item, index)=>(
            <Line key={index} type="monotone" dataKey={item} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}/>
        ))}
      </LineChart>

  )
}

export default SimpleLineChart