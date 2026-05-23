"use client"

import {Home} from 'lucide-react'
import Link from 'next/link'

type Props = {
    isActive: boolean;
    orientation?: string
}

const HomeRouteButton = ({isActive, orientation}: Props) => {
    return (

        <Link href="/" type="button" className={`is-drawer-close:tooltip is-drawer-close:tooltip-right items-center w-full ${orientation}`} data-tip="Homepage">
            {/* Home icon */}
            <Home className={`size-5 ${isActive ? "text-blue-500 drop-shadow-lg drop-shadow-blue-300" : ""}`}/>
            <span className={`is-drawer-close:hidden dock-label ${isActive ? "text-blue-500 " : ""}`}>Homepage</span>
        
        </Link>

    )
}

export {HomeRouteButton}