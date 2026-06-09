"use client";
import Countdown from "react-countdown";

import { useRouter } from "next/navigation";
import {useState, useEffect} from 'react';
type Props = {
  targetDate: number;
  is_active: boolean;
};
const CountDown = ({ targetDate, is_active }: Props) => {
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter();
  useEffect(() => {
    if (isCompleted) {
      router.refresh();
      queueMicrotask(()=>setIsCompleted(false));
    }
  },[isCompleted, router])
  
  return (
    <Countdown
      date={targetDate}
      onComplete={
        () => {
          setIsCompleted(true)
        }
      }
      renderer={({ days, hours, minutes, seconds }) => {
        const formatedDate = [
          {
            label: "Days",
            value: days,
          },
          {
            label: "Hours",
            value: hours,
          },
          {
            label: "Minutes",
            value: minutes,
          },
          {
            label: "Seconds",
            value: seconds,
          },
        ];
        return (
          <div className="">
            <h1 className="text-black text-shadow-md   text-shadow-white  font-extrabold text-md">
              {is_active ? "Registration Ends in" : "Registration Starts in"}
            </h1>
            <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
              {formatedDate.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col w-10 glass p-2 rounded-box items-center"
                >
                  <span className="countdown font-mono font-bold text-white text-sm z-20">
                    <span
                      style={{ "--value": item.value } as React.CSSProperties}
                      aria-live="polite"
                    >
                      {item.value}
                    </span>
                  </span>
                  <span className="text-[8px] text-white">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
};

export default CountDown;
