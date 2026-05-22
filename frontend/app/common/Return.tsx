"use client"
import { useRouter } from "next/navigation";
import { ArrowLeftFromLine} from "lucide-react"

const Return = () => {
    const router = useRouter();
    const handleReturn = () => router.back();
  return (
    <button title="return" type="button" onClick={handleReturn} className="btn  btn-ghost scale-z-100 z-auto btn-md">
        <ArrowLeftFromLine size={18} className="text-black stroke-3"/>
    </button>
  )
}

export default Return