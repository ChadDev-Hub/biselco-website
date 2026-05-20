"use client";
import { useRef } from "react";
import Image from "next/image";
import { Timeline } from "lucide-react";
type Props = {
  data: StatusHistory[];
};

type StatusHistory = {
  id: number;
  first_name: string;
  last_name: string;
  comments: string;
  timestamped: string;
  user_photo: string;
};
const StatusHistoryModal = ({ data }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const handleOpen = () => {
    modalRef.current?.showModal();
  };
  const handleClose = () => {
    modalRef.current?.close();
  };
  const statusIndicator = (status: string) => {
    if (status.includes("Update")) {
      return "status status-success";
    } else {
      return "status status-error";
    }
  };
  return (
    <>
      <button
        title="Status History"
        type="button"
        onClick={handleOpen}
        data-tip="Status History"
        className="btn tooltip w-20 tooltip-top rounded-box flex flex-col items-center justify-center p-1 shadow-md border-gray-300"
      >
        <Timeline className="text-emerald-500" />
        <label className="text-[0.5rem] text-emerald-500">Status History</label>
      </button>
      <dialog ref={modalRef} className="modal modal-bottom">
        <div className="modal-box max-w-2xl mx-auto">
          <div className="flex items-start justify-end w-full absolute top-1 -left-1">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-circle btn-sm btn-error"
            >
              X
            </button>
          </div>

          <h4 className="text-sm font-bold">Status History</h4>
          <div className="max-h-60 overflow-x-auto overflow-y-scroll">
            <table className="table table-xs">
              <thead className="text-xs font-bold z-20 text-center">
                <tr>
                  <td>Status Change</td>
                  <td>Updated By</td>
                  <td>Date & Time</td>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="text-[0.6rem] whitespace-nowrap">
                    <td className="items-center">
                      <span
                        className={`${statusIndicator(item.comments)} text-xs`}
                      ></span>{" "}
                      {item.comments}
                    </td>
                    <td className="flex items-center justify-center">
                      <div
                        title={item.first_name + " " + item.last_name}
                        className="avatar avatar-placeholder tooltip hover:cursor-pointer tooltip-accent tooltip-bottom"
                        data-tip={item.first_name + " " + item.last_name}
                      >
                        <Image
                          loading="lazy"
                          width={20}
                          height={20}
                          src={item.user_photo}
                          alt="Profile Picture"
                          className="avatar rounded-full"
                        />
                      </div>
                    </td>
                    <td>{item.timestamped}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default StatusHistoryModal;
