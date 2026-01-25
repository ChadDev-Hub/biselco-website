"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Logout } from "../services/clientApi"
import { useRouter } from "next/navigation"
interface Props {
    title?: string,
    baseurl?: string;
}
export default function NavBar({baseurl, title }: Props) {
    const router = useRouter()
    const [currentTheme, setTheme] = useState(() => {
        if (typeof window == "undefined") {
            return "cupcake"
        }
        const current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "luxury" : "cupcake"
        document.documentElement.setAttribute("data-theme", current)
        return current
    })
    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        const handleThemeChange = (event: MediaQueryListEvent) => {
            setTheme(event.matches ? "luxury" : "cupcake")
        }

        // Modern browsers
        mediaQuery.addEventListener("change", handleThemeChange)

        // Cleanup
        return () => {
            mediaQuery.removeEventListener("change", handleThemeChange)
        }
    }, [])

    //  Automatica Theme Change
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentTheme)
    }, [currentTheme])


    // LOGOUT
    const handleLogout = () =>{
        Logout(baseurl),
        router.push("/landing")
    }
    return (
        <div className="navbar w-full fixed pr-20">
            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                    </label>
            <Image
                loading="eager"
                src="/biselco-icon.png"
                alt="biselco"
                width={20}
                height={20}
                />
            <div className="flex-1">
                <a className="btn btn-ghost text-xl text-blue-700">{title}</a>
            </div>
            <div className="flex flex-none z-40">
                    <button type="button" aria-label="Search" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                    </button>
                    <button type="button" aria-label="Notification" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                            <span className="badge badge-xs badge-primary indicator-item"></span>
                        </div>
                    </button>
           
                <div className="dropdown dropdown-end z-20">
                    <div aria-label="Profile" tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <Image
                                loading="eager"
                                src="/globe.svg"
                                alt="svg"
                                width={5}
                                height={5}
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-40 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><button type="button" onClick={handleLogout} className="btn btn-neutral">Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    )

}