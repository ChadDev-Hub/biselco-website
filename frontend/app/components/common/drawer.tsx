"use client"
import React from 'react'
import NavBar from './navbar'
import { usePathname } from 'next/navigation'
import { ComplaintsRouteButton } from '../buttons/complaints'
import { HomeRouteButton } from '../buttons/home'
import LogoutButton from '../auth-component/logout'
type Props = {
    children: React.ReactNode;
    baseurl?: string;
    title?: string
}

const Drawer = ({ children, baseurl, title }: Props) => {
    const currentRoute = usePathname()
    const isActive = currentRoute === "/" ? "home"
        : currentRoute === "/complaints" ? "complaints" : "logout";
    return (
        <div className="drawer absolute z-40 lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <NavBar title={title} />
                {/* Page content here */}
                <div className="lg:p-2">
                    {children}
                </div>
            </div>
            <div className={`drawer-side is-drawer-close:overflow-visible mt-18 fixed ${currentRoute === "/landing" ? "hidden" : "visible"}`} >
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-base-300/45 drop-shadow-2xl  is-drawer-close:w-14 backdrop-blur-sm is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <li className='hidden md:block lg:block'>
                            {/* HOME ROUTE BUTTON */}
                            <HomeRouteButton
                                strokeColor={isActive === "home" ? "currentColor" : "currentColor"}
                                svgfill={isActive === "home" ? "#D4F6FF" : "None"}
                                orientation='flex flex-row'
                            />
                        </li>
                        <li className='hidden md:block lg:block'>
                            <ComplaintsRouteButton
                                strokeColor={isActive === "complaints" ? "currentColor" : "currentColor"}
                                svgfill={isActive === "complaints" ? "#D4F6FF" : "None"}
                                orientation="flex flex-row"
                            />
                        </li>
                        <li>
                            <LogoutButton
                                svgfill={isActive === "logout" ? "#D4F6FF" : "None"}
                                strokeColor={isActive === "logout" ? "currentColor" : "currentColor"}
                                baseurl={baseurl} />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Drawer