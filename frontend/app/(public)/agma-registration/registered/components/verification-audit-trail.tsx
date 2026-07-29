"use client";

import React, { useRef } from "react";
import { monitoringType } from "@/types/agma";
import { XCircle, History } from "lucide-react";
type Props = {
  data: monitoringType[] | undefined;
};

const VerificationAuditTrails = ({ data }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleOpen = () => dialogRef.current?.showModal();
  const handleClose = () => dialogRef.current?.close();

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        className="btn btn-md w-full place-content-start p-2"
      >
        <History className="w-6 h-6 text-blue-500" />
        <span className="text-[8px] text-blue-500">
          Verification Audit Trails
        </span>
      </button>
      <dialog ref={dialogRef} className="modal border ">
        <div className="modal-box relative h-fit  ">
        <div className=" bg-blue-600 z-10 h-10 rounded-b-2xl p-2">
            <h3 className="text-lg font-bold text-white">Verification Audit Trails</h3>
            <button
            onClick={handleClose}
            type="button"
            className="btn shadow btn-sm btn-error btn-circle absolute right-2 top-2"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>

        </div>
          
          <div className="w-full h-full  mt-6 max-h-[50vh] overflow-y-auto">
            <table className="table  ">
              <thead className="text-[9px] font-bold shadow sticky top-0 bg-base-100 z-10 text-center">
                <tr>
                  <th>Verification</th>
                  <th>Update By</th>
                  <th>Verified At</th>
                </tr>
                
              </thead>
              <tbody className="text-[9px] h-40 overflow-y-scroll text-center">
                  {data?.map((item, index) => (
                    <tr key={index} className="hover:bg-base-200">
                      <td>{item.comment}</td>
                      <td>
                        {item.user?.first_name} {item.user?.last_name}
                      </td>
                      <td>
                        {item.date} | {item.time}
                      </td>
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

export default VerificationAuditTrails;
