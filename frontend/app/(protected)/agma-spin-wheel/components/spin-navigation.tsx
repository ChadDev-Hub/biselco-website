'use client';
import {LoaderPinwheel} from "lucide-react"
import Link from "next/link";

const SpinNavigation = () => {
  return (
    <div className="fab fixed right-8 bottom-20 z-50">
        <Link href="/agma-spin-wheel?spin_time=5" data-tip="Spin The Wheel" className="btn btn-primary btn-circle tooltip tooltip-left">
            <LoaderPinwheel className="animate-spin" />
        </Link>
    </div>
  ) 
}

export default SpinNavigation; 