"use client";
import React, { useState } from "react";

import { DownloadCloud } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAlert } from "@/app/context/alert";
import { DownloadAgmaTicket } from '../../../../../lib/private-api/actions/agma';

type props = {
  elementId: string;
};
const DownloadTicket = ({ elementId }: props) => {
  const currentPath = usePathname();
  const [isDownloading, setIsDownloading] = useState(false);
  const { showAlert } = useAlert();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await DownloadAgmaTicket(elementId, currentPath);
      const url = URL.createObjectURL(res ?? new Blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = "agma_ticket.png";
      link.click();
      showAlert("success", "Ticket Downloaded Successfully");
      setIsDownloading(false); 
    } catch {
      setIsDownloading(false);
    }
  };

  return (
    <button
      disabled={isDownloading}
      type="button"
      onClick={handleDownload}
      data-tip="Download Ticket"
      title="Download Ticket"
      className="btn btn-circle btn-md btn-info shadow tooltip tooltip-left"
    >
      {isDownloading ? (
        <span className="loading loading-spinner text-black"></span>
      ) : (
        <DownloadCloud size={20} className="text-black" />
      )}
    </button>
  );
};

export default DownloadTicket;
