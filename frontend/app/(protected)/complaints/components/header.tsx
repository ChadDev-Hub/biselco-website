"use client";
import {Roboto} from 'next/font/google'
import {Phone} from "lucide-react"
const roboto = Roboto({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-fascinate",
});
const ComplaintHeader = () => {
  return (
    <header className="flex flex-col gap-2 p-2">
      <div >
        <h1
          className={`${roboto.className}  text-shadow-md text-center text-5xl font-extrabold tracking-tight text-white`}
        >
          Concerns <span className="text-yellow-300">Portal</span>
        </h1>
      </div>
      <div className="rounded-xl text-center space-y-2">
        <p className=" text-xs flex gap-2 items-center justify-center font-semibold ">
          <span>
            <Phone className="fill-yellow-300 text-white drop-shadow-md drop-shadow-gray-500" />
          </span> <span className="text-white">Need Immediate Assistance?</span>
        </p>
        <div className="flex flex-row justify-center gap-2  text-xs text-white">
          <span className="font-bold">09176511859</span>
          <span className="block">|</span>
          <span className="font-bold">09176396436</span>
          <span className="block">|</span>
          <span className="font-bold">09107101909</span>
        </div>
      </div>
    </header>
  );
};

export default ComplaintHeader;
