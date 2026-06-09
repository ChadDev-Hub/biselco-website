"use client";
import {Loader} from "lucide-react"
const LoadingIndicator = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center ">
     
        <Loader className="text-blue-500 delay-150 duration-1000 transition-all ease-in-out animate-spin mask-l-to-100% skeleton skeleton-text w-15 h-15"/>
      
    </div>
  );
};

export default LoadingIndicator;
