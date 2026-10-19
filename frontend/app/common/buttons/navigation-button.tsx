
"use client"


import Link from 'next/link'
import {usePathname} from "next/navigation";
import {LucideIcon} from "lucide-react";
type Props = {
    is_active?: boolean
    showOnMobile?: boolean
    onClick?: () => void
    Icon: LucideIcon
    label: string;
    showLabel?: boolean
    href: string
}

const NavigationButton = ({is_active, onClick, Icon, label, href, showOnMobile, showLabel}: Props) => {
    const currentPath = usePathname();
  return (
    <Link  onClick={onClick} aria-label={label} className={`is-drawer-close:tooltip  
    ${ currentPath === "/landing" && "link rounded-full link-hover place-content-start  hover:text-blue-500 px-4"} 
     ${showOnMobile && "btn btn-ghost btn-circle place-content-center is-drawer-open:place-content-start"}
      ${!showOnMobile && "flex justify-center"}
       md:btn md:btn-ghost md:btn-circle is-drawer-close:place-content-center is-drawer-close:place-items-center 
       is-drawer-open:place-content-start  is-drawer-close:tooltip-right  is-drawer-open:px-4   w-full ${is_active ? "glass" : ""}`} href={href} type="button" data-tip={label}>
            {currentPath !== "/landing" && 
            <Icon className={`size-6 ${is_active ? "text-blue-500 drop-shadow-lg drop-shadow-blue-300" : ""}`}/>}
            {showLabel && <span className={`${currentPath !== "landing" && "is-drawer-close:hidden is-drawer-open:block"}`}>{label}</span>}
    </Link>
  )
}

export default NavigationButton