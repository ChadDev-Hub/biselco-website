"use client";
import {FileDown} from "lucide-react"
import {use} from "react"
import { DownloadAgmaTicketToPdf } from '../../../../lib/private-api/actions/agma';
import { usePathname } from 'next/navigation';
import {useSearchParams} from "next/navigation"

type PromiseType = {
  status: number
}

type Props = {
  promise: Promise<PromiseType>
}

const DownloadAction = ({ promise }: Props) => {
    use(promise);
    const current_path = usePathname();
    const params = useSearchParams();
    const tab = params.get("tab");
    
    const handleClick = async() => {
       const res = await DownloadAgmaTicketToPdf("#agma-ticket", `${current_path}?tab=${tab}`);
       
       const url = URL.createObjectURL(res.data);
       const a = document.createElement("a");
       a.href = url;
       a.download = "agma-ticket.pdf";
       a.click();
    }
  return (  
  <button onClick={handleClick} className="btn btn-sm btn-circle ">
    <FileDown className="size-5 text-black" />
  </button>
  
);
};

export default DownloadAction;
