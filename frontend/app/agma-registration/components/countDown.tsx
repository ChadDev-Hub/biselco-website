"use client";
import Countdown from "react-countdown";

type Props = {
  targetDate: number;
};
const CountDown = ({ targetDate }: Props) => {
  return (
    <Countdown
      date={targetDate}
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
            <div className="z-10 absolute top-[25%] left-[5%] ">
            <h1 className="text-black text-shadow-md  text-shadow-white  font-extrabold text-2xl">Registration Ends in</h1>
            <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            {formatedDate.map((item, index) => 
            <div key={index} className="flex flex-col glass w-15 p-2 rounded-box items-center">
              <span className="countdown font-mono font-bold text-white text-3xl">
                <span
                  style={{ "--value": item.value } as React.CSSProperties}
                  aria-live="polite"
                >
                  {item.value}
                </span>
              </span>
              <span className="text-xs text-white">{item.label}</span>
            </div>)}
          </div>
            
            </div>
          
        );
      }}
    />
  );
};

export default CountDown;
