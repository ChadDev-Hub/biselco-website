"use client";
import { useRef } from "react";
import EnableButton from "./complaintStatusToggle";
import { NotebookPen } from "lucide-react";

type Props = {
  currentStatus?: number;
  status: status[];
  complaints_id: number;
  onOpen: (complaint_id: number) => void;
};
type status = {
  id: number;
  complaint_id: number;
  name: string;
  description: string;
  date: string;
  time: string;
};

type StatsType = {
  id: number;
  name: string;
};

const ComplaintStatusButton = ({
  currentStatus,
  status,
  complaints_id,
  onOpen,
}: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const complaintStatusName = [
    {
      id: 1,
      name: "Received",
    },
    { id: 2, name: "Pending" },
    {
      id: 3,
      name: "Working",
    },
    { id: 4, name: "Complete" },
  ];

  const handleOpen = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
      onOpen(complaints_id);
    }
  };
  const handleClose = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };
  return (
    <>
      <button
        aria-label="modal-button"
        title="Update Status"
        data-tip="Update Status"
        type="button"
        className="btn tooltip w-20 tooltip-top rounded-box flex flex-col items-center justify-center p-1 shadow-md border-gray-300 "
        onClick={handleOpen}
      >
        <NotebookPen width={30} height={30} className="text-blue-500" />
        <span className="text-[0.5rem] text-blue-500">Update Status</span>
      </button>
      <dialog ref={modalRef} className="modal modal-bottom">
        <div className="modal-box max-w-3xl mx-auto">
          <div className="flex items-start justify-end w-full absolute top-1 -left-1">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-circle btn-error btn-sm"
            >X</button>
          </div>
          <h1 className="text-sm font-bold text-blue-500 absolute top-3">
            Complaint Status
          </h1>
          <div className="overflow-x-auto mt-4">
            <ul
              tabIndex={-1}
              className="dropdown-content text-xs menu bg-base-100 rounded-box w-full  shadow-sm"
            >
              {complaintStatusName.map((item: StatsType, index: number) => (
                <li
                  key={index}
                  className="space-y-2 flex flex-row space-x-2 justify-between w-full"
                >
                  <span>{item.name}</span>
                  {status.find((stats: status) => stats.name === item.name) ? (
                    <span key={index}>
                      {
                        status.find((stats: status) => stats.name === item.name)
                          ?.date
                      }{" "}
                      •{" "}
                      {
                        status.find((stats: status) => stats.name === item.name)
                          ?.time
                      }
                    </span>
                  ) : (
                    <span
                      key={index}
                      className="loading loading-dots loading-sm"
                    />
                  )}
                  <EnableButton
                    current_status_id={currentStatus}
                    status_id={item.id}
                    complaint_id={complaints_id}
                    enabled={
                      status.find((stats: status) => stats.name == item.name)
                        ? true
                        : false
                    }
                    name={item.name}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default ComplaintStatusButton;
