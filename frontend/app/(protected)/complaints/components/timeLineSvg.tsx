"use client";
import {MailCheck, MonitorPause, Wrench, ClipboardCheck} from "lucide-react"
type Props = {
  status_name: string;
  statuslist: string[];
};

const TimeLineSvg = ({ status_name, statuslist }: Props) => {
  const activeColor = ` ${statuslist.includes(status_name) ? "text-blue-500 animate-pulse" : "text-gray-300"}`;
  const width = 18
  const height = 18
  switch (status_name) {
    case "Received":
      return (
        <MailCheck width={width} height={height} className={activeColor} />
      );
      break;
    case "Pending":
      return (
        <MonitorPause width={width} height={height} className={activeColor} />
      );
      break;
    case "Working":
      return (
        <Wrench width={width} height={height} className={activeColor} />
      );
      break;
    case "Complete":
      return (
        <ClipboardCheck width={width} height={height} className={activeColor} />
      );
    default:
      break;
  }
};
export default TimeLineSvg;
