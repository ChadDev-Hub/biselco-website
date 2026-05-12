"use client";
import { use, useState, useEffect } from "react";
import { useWebsocket } from "@/app/utils/websocketprovider";
import Delete from "./deleteChangeMeter";
import { DeleteChangeMeter } from "@/app/actions/changeMeter";
import DownloadReport from "./download";
import { DownloadChangeMeterReport } from "@/app/actions/changeMeter";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/common/alert";

import { useSearchParams } from "next/navigation";
import ChangeMeteCards from "./changeMeterCards";
import ChangeMeterForm from "./changeMeterForm";

type PromiseType =
  | {
      status: number;
      data: Data;
    }
  | undefined;

type Data = {
  data: ChangeMeter[];
  total_page: number;
};

type ChangeMeter = {
  id: number;
  date_accomplished: string;
  account_no: string;
  consumer_name: string;
  location: string;
  pull_out_meter: string;
  pull_out_meter_reading: number;
  new_meter_serial_no: string;
  new_meter_brand: string;
  initial_reading: number;
  remarks?: string;
  accomplished_by: string;
  images: string[];
  geom: {
    type: string;
    coordinates: number[];
    srid: number;
  };
};
type Props = {
  data: Promise<PromiseType>;
};

const ChangeMeteContainer = ({ data }: Props) => {
  const changeMeter = use(data);
  const [changeMeterData, setChangeMeterData] = useState<ChangeMeter[] | []>(
    [],
  );
  const [selectedRow, setSelectedRow] = useState<Set<number>>(new Set());
  const router = useRouter();
  const { showAlert } = useAlert();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const [isActive, setisActive] = useState(() => {
    if (selectedRow.size > 0) return true;
    else return false;
  });
  useEffect(() => {
    switch (changeMeter?.status) {
      case 200:
        queueMicrotask(() => {
          setChangeMeterData(changeMeter.data.data);
        });
        break;
      default:
        break;
    }
  }, [changeMeter]);

  const { message } = useWebsocket();
  useEffect(() => {
    switch (message?.detail) {
      case "post_change_meter":
        if (Number(page) === 1 || page === null) {
          queueMicrotask(() => {
            setChangeMeterData((prev) => {
              const existingData = prev.filter(
                (item) => item.id !== message.data.change_meter_data.id,
              );
              return [message.data.change_meter_data, ...existingData].slice(
                0,
                9,
              );
            });
          });
        } else {
          showAlert("success", message.message);
        }
        break;
      case "deleted_change_meter":
        router.refresh();
        showAlert("success", message.data);
        break;
      default:
        break;
    }
  }, [message, router, showAlert, page]);

  useEffect(() => {
    if (selectedRow.size > 0) {
      queueMicrotask(() => setisActive(true));
    } else queueMicrotask(() => setisActive(false));
  }, [selectedRow]);

  const handleSelection = (item: number) => {
    setSelectedRow((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  const handleDelete = async () => {
    const res = await DeleteChangeMeter(selectedRow);
    if (res?.status === 200) {
      setSelectedRow(new Set());
      setChangeMeterData((prev) => prev.filter((item) => item.id !== res.data));
    }
  };

  const handleDownload = async (formData: object) => {
    const data = {
      ...formData,
      items: Array.from(selectedRow),
    };
    const res = await DownloadChangeMeterReport(data);
    if (res?.status === 200) {
      const blob = res.data;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "change_meter_report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSelectedRow(new Set());
    }
  };
  return (
    <>
      <div className=" w-full">
        {/* NAV BAR */}
        <div className="navbar w-full  px-2 flex justify-between glass mb-2 rounded-box">
          {/* TOOLS */}
          <div className="flex items-center gap-2">
            <div>
              <Delete
                is_active={isActive}
                show={true}
                handleDelete={handleDelete}
              />
            </div>
            <div>
              <DownloadReport
                isactive={isActive}
                show={true}
                download={handleDownload}
              />
            </div>
            <div>
              <ChangeMeterForm />
            </div>
            
          </div>
          {/*Search*/}
          <div className="shrink">
            
            <input
              placeholder="Find"
              type="text"
              className="input bg-base-300 drop-shadow-md drop-shadow-gray-500 rounded-full"
            />
          </div>
          
        </div>
        {selectedRow.size > 0 && <div className="badge mb-2 badge-outline badge-secondary text-xs font-bold">
              <span>Items: </span><span>{selectedRow.size === 0 ? "" : selectedRow.size }</span>
          </div>}
      </div>

      {/* Chage Meter Card */}
      <div className="grid grid-cols-1   sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2  place-items-center">
        {changeMeterData.map((item: ChangeMeter, index) => (
          <ChangeMeteCards
            key={index}
            id={item.id}
            selectedRow={selectedRow}
            handleSelection={handleSelection}
            image={item.images[0]}
            account_no={item.account_no}
            consumer_name={item.consumer_name}
            pullout_meter={item.pull_out_meter}
            newmeter_brand={item.new_meter_brand}
            newmeter_serial={item.new_meter_serial_no}
            location={item.location}
            lat={item.geom.coordinates[1]}
            lon={item.geom.coordinates[0]}
            accomplished_by={item.accomplished_by}
            date_accomplished={item.date_accomplished}
            srid={item.geom.srid}
            initial_reading={item.initial_reading}
            pullout_reading={item.pull_out_meter_reading}
          />
        ))}
      </div>
    </>
  );
};

export default ChangeMeteContainer;
