"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Props {
    title: string
}
export default function NavBar({ title }: Props) {
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


    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentTheme)
    }, [currentTheme])

    return (
        <div className="navbar fixed top-0 left-0 bg-base-100 shadow-sm z-50">
            <Image
                src="/biselco-icon.png"
                alt="biselco"
                width={20}
                height={20}
                />
            <div className="flex-1">
                
                <a className="btn btn-ghost text-xl">{title}</a>
            </div>
            <div className="flex-none">
                    <button type="button" aria-label="Search" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                    </button>
                    <button type="button" aria-label="Notification" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                            <span className="badge badge-xs badge-primary indicator-item"></span>
                        </div>
                    </button>
           
                <div className="dropdown dropdown-end">
                    <div aria-label="Profile" tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <Image
                                src="/globe.svg"
                                alt="svg"
                                width={5}
                                height={5}
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )

}