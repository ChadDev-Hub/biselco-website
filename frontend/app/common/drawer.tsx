"use client"
import React from 'react'
import NavBar from './navbar'
import { usePathname } from 'next/navigation'
import { HomeRouteButton } from './buttons/home'
type Props = {
    children: React.ReactNode;
    baseurl?: string;
}

const Drawer = ({ children}: Props) => {
    const currentRoute = usePathname()
    const visibleRoutes = ["/", "/complaints", "/complaints/dashboard", "/technical", "/technical/change-meter","/technical/new-connection"];
    const isActive = currentRoute === "/" ? "home"
        : currentRoute === "/complaints" ? "complaints"
            : currentRoute === "/technical" ? "technical" : "";

    return (
        <div className="drawer absolute z-40  lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content bg-linear-to-bl bg-base-300">
                {/* Navbar */}
                <NavBar/>
                {/* Page content here */}
                <div className="min-h-screen">
                    {children}
                </div>
            </div>
            <div className={`drawer-side z-60 border-gray-400 shadow bg-base-200 is-drawer-close:overflow-visible ${visibleRoutes.includes(currentRoute) ? "visible" : "hidden"}`} >
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex flex-col min-h-full items-start bg-base-300/45 drop-shadow-2xl  is-drawer-close:w-14 backdrop-blur-sm is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <div className='hidden md:block w-full is-drawer-close:hidden'>
                        <div className='divider w-full   divider-warning text-blue-800'>
                            Navigations
                        </div>
                    </div>

                    <ul className="menu w-full">

                        {/* List item */}
                        <li className='hidden md:block lg:block'>
                            {/* HOME ROUTE BUTTON */}
                            <HomeRouteButton
                                strokeColor={isActive === "home" ? "currentColor" : "currentColor"}
                                svgfill={isActive === "home" ? "#D4F6FF" : "None"}
                                orientation='flex flex-row'
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Drawer