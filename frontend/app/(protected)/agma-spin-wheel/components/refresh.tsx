"use client"


import { useRouter } from 'next/navigation'
import {RefreshCcwDot} from "lucide-react"
const RefreshButton = () => {
    const router = useRouter();
    const refreshPage = () => {
        router.refresh();
    }
  return (
    <button type="button" title="Refresh" onClick={refreshPage} className="btn btn-circle btn-lg  bg-linear-to-r from-blue-400 via-purple-400 to-pink-400" >
        <RefreshCcwDot className="w-6 h-6 text-white" />
    </button>
  )
}

export default RefreshButton