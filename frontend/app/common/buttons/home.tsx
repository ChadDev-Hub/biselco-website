"use client"

import {Home} from 'lucide-react'
import Link from 'next/link'

type Props = {
    isActive: boolean;

    onClick?: () => void
}

const HomeRouteButton = ({isActive, onClick}: Props) => {

    return (

        <Link href="/home" aria-label="close sidebar" type="button" onClick={onClick} className={`is-drawer-close:tooltip place-content-center md:btn md:btn-circle md:btn-ghost md:place-content-stretch  is-drawer-open:px-4 is-drawer-close:tooltip-right place-items-center rounded-full w-full ${isActive && "glass"} $`} data-tip="Homepage">
            {/* Home icon */}
            <Home className={`size-5 ${isActive && "text-blue-500 drop-shadow-lg drop-shadow-blue-300" }`}/>
            <span className={`is-drawer-close:hidden hidden md:block ${isActive && "text-blue-500 dock-active"}`}>Homepage</span>
        </Link>

    )
}

export {HomeRouteButton}