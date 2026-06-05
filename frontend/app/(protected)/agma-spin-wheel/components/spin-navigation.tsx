'use client';
import {LoaderPinwheel} from "lucide-react"
import Link from "next/link";

const SpinNavigation = () => {
  return (
    <div className="fab sticky right-1 bottom-8">
        <Link href="/agma-spin-wheel" className="btn btn-primary btn-circle">
            <LoaderPinwheel className="animate-spin" />
        </Link>
    </div>
  )
}

export default SpinNavigation; 