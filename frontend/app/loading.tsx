"use client";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="w-full min-h-screen max-h-screen flex flex-col justify-center items-center ">
      <div className="rounded-full  relative">
        <div className="border-4 rounded-full w-[102%] h-[102%] -top-1.5 -left-0.4 animate-spin absolute border-x-amber-200 border-y-blue-700"></div>
        <Image
          preload
          loading="eager"
          src="/biselco-icon.png"
          alt="biselco-icon"
          width={80}
          height={80}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover p-0.5 object-center w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default Loading;
