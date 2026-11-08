
"use client";
import {Download} from 'lucide-react'



const DownloadReport = () => {
  return (
    <button className="btn btn-primary">
        <Download className="w-4 h-4" />
        Download Report
    </button>
  )
}

export default DownloadReport