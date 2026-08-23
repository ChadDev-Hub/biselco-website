"use client";
import CardComponent from "@/app/common/card";
import { CircleGauge, Loader, ArrowBigRightDash } from "lucide-react";
import dynamic from "next/dynamic";

const Mapbutton = dynamic(
  () => import("@/app/(protected)/complaints/dashboard/components/mapbutton"),
  {
    ssr: false,
    loading: () => <Loader className="animate-spin text-primary" />,
  },
);

const ImageViewer = dynamic(() => import("./imageViewr"), {
  ssr: false,
  loading: () => <Loader className="animate-spin text-primary" />,
});

type Props = {
  selectedRow: Set<number>;
  id: number;
  handleSelection: (id: number) => void;
  image: string;
  account_no: string;
  consumer_name: string;
  pullout_meter: string;
  newmeter_brand: string;
  newmeter_serial: string;
  meter_sealed?: string;
  location: string;
  lat: number;
  lon: number;
  srid: number;
  date_accomplished: string;
  accomplished_by: string;
  initial_reading: number;
  pullout_reading: number;
  remarks?: string;
};

const ChangeMeteCards = ({
  selectedRow,
  id,
  handleSelection,
  image,
  consumer_name,
  account_no,
  pullout_meter,
  newmeter_brand,
  newmeter_serial,
  location,
  lat,
  lon,
  srid,
  date_accomplished,
  accomplished_by,
  initial_reading,
  pullout_reading,
  meter_sealed,
  remarks,
}: Props) => {
  return (
    <CardComponent
      className={`w-full flex flex-col justify-center items-center  ${selectedRow.has(id) ? "border border-blue-600" : "border border-gray-100 border-t-emerald-500 border-t-2"} hover:cursor-pointer bg-base-100 shadow-md shadow-gray-700 rounded-box h-full`}
    >
      <div className="p-2 w-full relative flex flex-col gap-2">
        <input
          onChange={() => handleSelection(id)}
          className={`checkbox checkbox-md rounded-box absolute top-2 right-2 border-blue-200 ${selectedRow.has(id) ? "checked:bg-blue-400" : "checked:bg-blue-400"}`}
          checked={selectedRow.has(id)}
          title="choose item"
          type="checkbox"
        />
        <div className="flex  gap-3 w-full h-18">
          <figure className="relative w-1/3">
            <ImageViewer image={image} />
          </figure>
          <div className="w-full">
            <h2 className="text-sm">ACCOUNT NO:</h2>
            <h2 className="text-xs font-bold">{account_no}</h2>
            <h3 className="text-xs">{consumer_name}</h3>
          </div>
        </div>

        <div className="card-body py-4 px-0 flex flex-col">
          <div className="drop-shadow-md bg-base-200  w-full p-4 rounded-box  glass">
            <div className="badge bg-xs text-xs bg-linear-to-tr from-blue-100 to-blue-400  badge-sm absolute  top-2 right-2">
              CM
            </div>
            <h2 className="card-title text-sm">Meter Information</h2>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="w-full">
                <label className="label text-[10px]">Old Meter</label>
                <h2 className="font-bold text-[9px]">
                  {pullout_meter.split("|")[1]}
                </h2>
                <label className="label text-[10px]">Meter Number</label>
                <h2 className="font-bold text-[9px]">
                  {pullout_meter.split("|")[0]}
                </h2>
                <label className="label text-[10px]">Pullout Reading</label>
                <h2 className="font-bold text-[9px]">{pullout_reading}</h2>
              </div>
              <div className="flex items-center justify-center">
                <ArrowBigRightDash className="text-2xl fill-blue-300" />
              </div>
              <div>
                <label className="label text-[10px]">New Meter</label>
                <h2 className="font-bold text-[9px]">{newmeter_brand}</h2>
                <label className="label text-[10px]">Serial Number</label>
                <h2 className="font-bold text-[9px]">{newmeter_serial}</h2>
                <label className="label text-[10px]">Meter Seal</label>
                <h2 className="font-bold text-[9px]">{meter_sealed}</h2>
                <label className="label text-[10px]">Initial Reading</label>
                <h2 className="font-bold text-[9px]">{initial_reading}</h2>
              </div>
            </div>
            <div className="bg-base-300 p-2 rounded-box flex flex-col">
              <label className="text-[10px] label">Remarks:</label>
              <h2 className="text-[8px] font-bold self-center">{remarks}</h2>
            </div>
          </div>
          <div className="">
            <h1 className="flex items-center text-sm font-bold">
              <Mapbutton
                title="Change Meter Location"
                location={{
                  latitude: lat,
                  longitude: lon,
                  srid: srid,
                }}
                marker={
                  <CircleGauge className="text-2xl fill-orange-500 font-bold shadow  text-blue-500 size-5 animate-bounce" />
                }
                markerLabel={consumer_name}
              />
              <span>{location}</span>
            </h1>

            <div className="grid grid-cols-2 p-2">
              {/* DATE ACCOMPLISHED */}
              <div>
                <h1 className="text-xs">Date accomplished</h1>
                <h2 className="text-sm font-bold">{date_accomplished}</h2>
              </div>
              {/* ACCOMPLISHED BY */}
              <div>
                <h1 className="text-xs">Accomplished by:</h1>
                <h2 className="text-sm font-bold">{accomplished_by}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardComponent>
  );
};

export default ChangeMeteCards;
