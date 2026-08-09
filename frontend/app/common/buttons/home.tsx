"use client"

import {Home} from 'lucide-react'
import Link from 'next/link'

type Props = {
    isActive: boolean;
    orientation?: string
    onClick?: () => void
}

const HomeRouteButton = ({isActive, orientation, onClick}: Props) => {

    return (

        <Link href="/home" type="button" onClick={onClick} className={`is-drawer-close:tooltip is-drawer-close:tooltip-right items-center w-full ${isActive ? "bg-base-300" : ""} ${orientation}`} data-tip="Homepage">
            {/* Home icon */}
            <Home className={`size-5 ${isActive ? "text-blue-500 drop-shadow-lg drop-shadow-blue-300" : ""}`}/>
            <span className={`is-drawer-close:hidden dock-label ${isActive ? "text-blue-500 dock-active" : ""}`}>Homepage</span>
        
        </Link>

    )
}

export {HomeRouteButton}