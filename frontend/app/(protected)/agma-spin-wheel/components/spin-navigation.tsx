'use client';
import {LoaderPinwheel} from "lucide-react"
import Link from "next/link";

const SpinNavigation = () => {
  return (
    <div className="fab fixed right-8 bottom-20 z-50">
        <Link href="/agma-spin-wheel" className="btn btn-primary btn-circle">
            <LoaderPinwheel className="animate-spin" />
        </Link>
    </div>
  )
}

export default SpinNavigation; 