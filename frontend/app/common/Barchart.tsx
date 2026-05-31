"use client";

import { BarChart, XAxis, YAxis, Tooltip, Bar, BarShapeProps, CartesianGrid, TooltipContentProps } from "recharts";

type Data = {
  name?: string;
  value?: number;
};

type Props = {
  data?: Data[];
  xaxisStyle?: {
    fontSize?: number;
    angle?: number;
    fontWeight?: number | string;
  }
  yaxisStyle?: {
    fontSize?: number;
    angle?: number;
  },
  customTooltip?: (props: TooltipContentProps) => React.ReactNode
};



const SimpleBarchart = ({ data, xaxisStyle, yaxisStyle, customTooltip}: Props) => {
    const colors = ["#60a5fa", // soft blue (primary modern blue)
  "#3b82f6", // strong blue (your current primary)
  "#93c5fd", // light sky blue (UI-friendly accent)
  "#1d4ed8",];
  const customBar = (props: BarShapeProps) => {
    const { x, y, width, height, index } = props;
    const color = colors[index! % colors.length];
    return <rect x={x} y={y} width={width} height={height} fill={color} />;
  };

  return (
    <BarChart
      style={{
        width: "100%",
        height: "100%",
        maxWidth: "700px",
        maxHeight: "300px",
        aspectRatio: 1.618,
      }}
      data={data}
      responsive
      margin={{
        top: 2,
        right: 0,
        left: 0,
        bottom: 2,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis fontSize={xaxisStyle?.fontSize} fontWeight={xaxisStyle?.fontWeight} angle={xaxisStyle?.angle}  dataKey="name" />
      <YAxis fontSize={yaxisStyle?.fontSize} angle={yaxisStyle?.angle} />
      <Tooltip content={customTooltip} />
      <Bar dataKey="value" fill="color" shape={customBar} />
    </BarChart>
  );
};

export default SimpleBarchart;
