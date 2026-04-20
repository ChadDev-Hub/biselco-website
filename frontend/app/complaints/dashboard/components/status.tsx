"use client";

import { use, useEffect, useState } from "react";
import { useWebsocket } from "@/app/utils/websocketprovider";
import StatsCard from "./statsCard";


type PromiseType = {
  status: number;
  data: ComplaintStatsType[];
};
type Props = {
  data: Promise<PromiseType>;
};
type ComplaintStatsType = {
  id: number;
  title: string;
  value: number;
  description: string;
};
const Stats = ({ data }: Props) => {
  const stats = use(data);
  const [statsData, setStatsData] = useState<ComplaintStatsType[]>([]);
  useEffect(() => {
    queueMicrotask(() =>
      setStatsData(stats.data));
  }, [stats]);
  
  // WEBSOCKET
  const { message } = useWebsocket();
  useEffect(() => {
    switch (message?.detail) {
      
      case "complaints_stats":
        queueMicrotask(() => 
          setStatsData(message.data));
        break;
      default:
        break;
    }
  }, [message]);

  const SpecificSvg = (title: string) => {
    switch (title) {
      case "Daily Complaints":
        return (<svg
          height={35}
          width={35}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-51.2 -51.2 614.40 614.40"
          fill="currentColor">
          <g id="SVGRepo_bgCarrier"
          >
          </g>
          <g id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round">
          </g>
          <g id="SVGRepo_iconCarrier">
            <style type="text/css">
            </style>
            <g>
              <path
                d="M260.847,51.057C210.844,88.23,92.606,195.549,3.954,195.549c-5.836,0-3.486,4.232-3.486,4.232l77.458,32.376 l-47.118,46.646v77.175l251.153,104.964L512,233.189v-77.168L260.847,51.057z M68.485,204.425 c26.6-9.94,53.389-24.653,79.054-41.188c6.421-4.135,12.738-8.416,18.994-12.73c1.375-0.951,2.741-1.886,4.103-2.846 c6.063-4.232,12.036-8.506,17.889-12.802c0.681-0.499,1.335-0.991,2.016-1.491c5.68-4.192,11.234-8.377,16.676-12.528 c0.734-0.565,1.467-1.113,2.193-1.677c6.01-4.612,11.843-9.142,17.502-13.592l204.576,85.503 c-53.933,41.067-123.229,87.479-176.38,87.479c-3.797,0-7.498-0.25-11.012-0.75l-127.332-53.208l-21.933-9.158L68.485,204.425z M99.885,241.315L238.04,299.07c5.55,0.976,11.23,1.443,17.067,1.443c55.598,0,122.83-42.211,177.573-82.842L275.596,373.182 L58.384,282.415L99.885,241.315z M490.04,224.031L276.906,435.033l-224.138-93.67v-18.252l225.561,94.258L490.04,207.771V224.031z M490.04,194.783L276.209,406.486l-223.44-93.372v-19.445l225.71,94.323L490.04,178.546V194.783z">
              </path>
              <path
                d="M209.417,233.947c0.802,0.395,1.878,0.274,2.689-0.314l20.4-9.158c2.326-1.04,4.539-2.33,6.602-3.813 l65.672-47.532c0.806-0.589,0.81-1.242,0.008-1.644l-14.983-7.433c-0.939-0.468-2.012-0.678-3.217-0.612l-26.29,0.418 c-1.201,0.057-2.007,0.314-2.818,0.903l-16.7,12.085c-1.076,0.782-0.677,1.298,0.661,1.314l24.415-0.04l0.262,0.129l-46.065,33.344 l-26.68,12.746c-0.81,0.58-0.81,1.241-0.008,1.636L209.417,233.947z">
              </path>
            </g>
          </g>
        </svg>);
        break;
      case "Completion":
        return (
          <svg
            fill="currentColor"
            width={25}
            height={25}
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg">
            <g
              id="SVGRepo_bgCarrier"
            >
            </g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round">
            </g>
            <g id="SVGRepo_iconCarrier">
              <path d="M960 1807.059c-467.125 0-847.059-379.934-847.059-847.059 0-467.125 379.934-847.059 847.059-847.059 467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059M960 0C430.645 0 0 430.645 0 960s430.645 960 960 960 960-430.645 960-960S1489.355 0 960 0M854.344 1157.975 583.059 886.69l-79.85 79.85 351.135 351.133L1454.4 717.617l-79.85-79.85-520.206 520.208Z"
                fillRule="evenodd">
              </path>
            </g>
          </svg>
        );
        break;
      case "Total Complaints":
        return (
          <svg
            fill="currentColor"
            height={25}
            width={25}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 492.308 492.308" >
            <g id="SVGRepo_bgCarrier">
            </g>
            <g id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round">
            </g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <polygon points="201.519,290.813 201.519,191.659 181.827,191.659 181.827,290.813 82.673,290.813 82.673,310.505 181.827,310.505 181.827,409.649 201.519,409.649 201.519,310.505 300.673,310.505 300.673,290.813 ">
                  </polygon>
                </g>
              </g>
              <g>
                <g>
                  <path d="M109.077,0.053v108.971H0v383.231h383.346V383.293h108.962V0.053H109.077z M363.654,383.293v89.269H19.692V128.716h89.385 h254.577V383.293z M472.615,363.601h-89.269V109.024H128.769V19.745h343.846V363.601z">
                  </path>
                </g>
              </g>
            </g>
          </svg>
        );
        break;
      default:
        break;
    }
  }


  return (
    <div className="stats shadow">
      {statsData.map((m) => (
        <StatsCard
        key={m.id}
          label={m.title}
          value={m.value}
          svg={SpecificSvg(m.title)}
          description={m.description}
        />
      ))}
    </div>
  );
};

export default Stats;
