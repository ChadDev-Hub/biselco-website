"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  TooltipContentProps,
} from "recharts";

type Props<T> = {
  data?: T[];
  dataKey?: DataKey[];
  xaxisStyle?: {
    fontSize?: number;
    angle?: number;
    fontWeight?: number | string;
  }
  yaxisStyle?: {
    fontSize?: number;
    angle?: number;
    fontWeight?: number | string;
  }
  customToolTip?: (props: TooltipContentProps) => React.ReactNode
};
type DataKey = {
  label: string;
  color: string;
};

const SimpleLineChart = <T,>({ data, dataKey, xaxisStyle, yaxisStyle, customToolTip }: Props<T>) => {

  return (
        <LineChart
          style={{
            width:"100%",
            height:"100%",
            maxHeight: "300px",
            aspectRatio: 1.618,
          }}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: xaxisStyle?.fontSize, fill: 'black', angle: xaxisStyle?.angle }} />
          <YAxis tick={{ fontSize: yaxisStyle?.fontSize, fill: 'black', angle: yaxisStyle?.angle }} />
          <Tooltip content={customToolTip} />
          <Legend
            style={{
              width: "100%",
            }}
          />
          {dataKey?.map((item, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={item.label}
              stroke={item.color}
            />
          ))}
        </LineChart>
    
  
  );
};

export default SimpleLineChart;
