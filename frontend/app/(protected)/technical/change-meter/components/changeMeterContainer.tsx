"use client";
import { use, useState, useEffect } from "react";
import { useWebsocket } from "@/app/context/websocketprovider";
import Delete from "./deleteChangeMeter";
import { DeleteChangeMeter } from "@/lib/private-api/actions/change-meter";
import DownloadReport from "./download";
import { DownloadChangeMeterReport } from "@/lib/private-api/actions/change-meter";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/context/alert";
import {ApiError} from "@/types/api-error";
import { useSearchParams } from "next/navigation";
import ChangeMeteCards from "./changeMeterCards";
import ChangeMeterForm from "./changeMeterForm";
import {ChangeMeterResponseLists, ChangeMeterType} from "@/types/change-meter";



type PromiseType =
  {
    status: number;
    data: ChangeMeterResponseLists
  }


type Props = {
  data: Promise<PromiseType>;
  searchComponent: React.ReactNode;
};

const ChangeMeteContainer = ({ data, searchComponent }: Props) => {
  const changeMeter = use(data);
  const [changeMeterData, setChangeMeterData] = useState<ChangeMeterType[] | []>(
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

  const { message, clearMessage } = useWebsocket();
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
        showAlert("success", message.message);
        clearMessage();
        break;
      default:
        break;
    }
  }, [message, router, showAlert, page, clearMessage]);

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
    try {
      const res = await DeleteChangeMeter(selectedRow);
      
      setSelectedRow(new Set());
      setChangeMeterData((prev) => prev.filter((item) => !res.has(item.id)));
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            router.replace("/");
            showAlert("error", error.message);
            break;
          case 403:
            router.replace("/home");
            showAlert("error", error.message);
            break;
          default:
            showAlert("error", error.message);
            break;
        }
      }
    }}


  const handleDownload = async (formData: object) => {
    const data = {
      ...formData,
      items: Array.from(selectedRow),
    };
    try {
      const blob = await DownloadChangeMeterReport(data);
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url
      a.download = "change_meter_report.xlsx";
      document.body.appendChild(a);
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setSelectedRow(new Set())
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            router.replace("/");
            showAlert("error", error.message);
            break;
          case 403:
            router.replace("/home");
            showAlert("error", error.message);
            break;
          default:
            showAlert("error", error.message);
            break;
        }
      }
    }
  };
  return (
    <>
      <div className="w-full justify-center flex px-2 ">
        {/* NAV BAR */}
        <div className="navbar max-w-2xl items-center   bg-base-100 border-gray-100 shadow-md w-full  px-2  flex justify-between glass mb-2 rounded-box">
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

            {selectedRow.size > 0 &&
              <div className="badge  badge-outline badge-info  text-xs font-bold">
                <span>Items: </span><span>{selectedRow.size === 0 ? "" : selectedRow.size}</span>
              </div>}

          </div>
          {/*Search*/}
          {searchComponent}

        </div>

      </div>

      {/* Chage Meter Card */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 w-full max-w-7xl  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2  place-items-center">
          {changeMeterData.map((item: ChangeMeterType, index) => (
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
              lat={item.geom.latitude}
              lon={item.geom.longitude}
              accomplished_by={item.accomplished_by}
              date_accomplished={item.date_accomplished}
              srid={item.geom.srid}
              initial_reading={item.initial_reading}
              pullout_reading={item.pull_out_meter_reading}
            />
          ))}
        </div>
      </div>

    </>
  );
};

export default ChangeMeteContainer;
