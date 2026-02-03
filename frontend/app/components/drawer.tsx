"use client"
import React from 'react'
import NavBar from './navbar'
import { usePathname } from 'next/navigation'
import { Logout } from "../services/clientApi"
import { useRouter } from 'next/navigation'
type Props = {
    children: React.ReactNode;
    baseurl?: string;
    title?: string
}

const Drawer = ({ children, baseurl , title }: Props) => {
    const currentRoute = usePathname()
    const router = useRouter()
    const handleLogout = () => {
        Logout(baseurl)
        router.push("/landing")
    }
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
                <div className="flex min-h-full flex-col items-start bg-base-100 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full grow">
                        {/* List item */}
                        <li>
                            <button type='button' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                                {/* Home icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                <span className="is-drawer-close:hidden">Homepage</span>
                            </button>
                        </li>

                        {/* List item */}
                        <li>

                            <button type='button' className="is-drawer-close:tooltip is-drawer-close:tooltip-right " data-tip="Settings">
                                {/* Settings icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                                <span className="is-drawer-close:hidden">Settings</span>
                            </button>
                        </li>
                        <li>
                            <button  onClick={handleLogout} type="button" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Logout">
                                <svg width={12} height={12} className="my-1.5 inline-block size-4"  viewBox="0 0 24 24" xmlns='http://www.w3.org/2000/svg'>
                                    <circle cx={12} cy={12} r={10} stroke='currentColor' fill='none' strokeWidth={2}/>
                                    <circle cx={12} cy={12} r={5} stroke='currentColor' fill='none' strokeWidth={2} strokeDasharray="20,8" strokeLinecap='round' strokeDashoffset={1}/>
                                    <line x1={12} y1={14} x2={12} y2={8} stroke='currentColor' strokeWidth={2} fill='none' />
                                </svg>
                                <span className='is-drawer-close:hidden'>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Drawer