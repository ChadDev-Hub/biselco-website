"use client";
import Mapbutton from "@/app/complaints/dashboard/components/mapbutton";
import CardComponent from "@/app/common/card";
import ImageViewer from "../../change-meter/components/imageViewr";


type Props = {
  selectedRow: Set<number>;
  id: number;
  handleSelection: (id: number) => void;
  image: string;
  consumer_name: string;
  newmeter_brand: string;
  newmeter_serial: string;
  location: string;
  lat: number;
  lon: number;
  srid: number;
  date_accomplished: string;
  accomplished_by: string;
  initial_reading: number;
};

const NewConnectionCard = ({
  selectedRow,
  id,
  handleSelection,
  image,
  consumer_name,
  newmeter_brand,
  newmeter_serial,
  location,
  lat,
  lon,
  srid,
  date_accomplished,
  accomplished_by,
  initial_reading,
}: Props) => {
  return (
    <CardComponent
      className={`w-full flex flex-col justify-center items-center  ${selectedRow.has(id) ? "border border-blue-600" : "border border-blue-400"} hover:cursor-pointer bg-radial from-gray-100  to-gray-500  shadow-md shadow-gray-700 rounded-box  `}
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
          <ImageViewer image={image}/>
          
          </figure>
          <div className="w-full">
            <h2 className="text-sm">CONSUMER NAME:</h2>
            <h3 className="text-xs font-semibold">{consumer_name}</h3>
          </div>
        </div>

        <div className="card-body py-4 px-0 flex flex-col">
          <div className="drop-shadow-md shadow-gray-600  w-full p-4 rounded-box  glass">
            <div className="badge bg-xs text-xs bg-linear-to-tr from-blue-100 to-blue-400  badge-sm absolute  top-2 right-2">
              NC
            </div>
            <h2 className="card-title text-sm">Meter Information</h2>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div>
                <label className="text-xs label">New Meter</label>
                <h2 className="text-xs font-bold">{newmeter_brand}</h2>
                <label className="text-xs label">Serial Number</label>
                <h2 className="text-xs font-bold">{newmeter_serial}</h2>
                <label className="label text-xs">Initial Reading</label>
                <h2 className="font-bold text-xs">{initial_reading}</h2>
              </div>
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

export default NewConnectionCard;
