
"use client"

import {useRouter} from "next/navigation"
import {X} from "lucide-react"
const Return = () => {
    const router = useRouter();
    const handleReturn = () => router.push("/");
  return (
    <button onClick={handleReturn} className="btn btn-circle btn-lg  absolute top-3 right-3">
        <X className="size-15"/>
    </button>
  )
}

export default Return