"use client"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "../utils/authProvider"
import LogoutButton from "./auth-component/logout"



export default function NavBar() {
    const currentRouter = usePathname()
    const visibleRoutes = ["/landing", "/", "/complaints", "/complaints/dashboard", "/technical", "/technical/change-meter", "/technical/new-connection"];
    const isLanding = currentRouter === "/landing";
    const { user } = useAuth()
    const isVisible = visibleRoutes.includes(currentRouter);
    if (!isVisible) return null;
    return (
        <nav className="sticky top-0 z-60 p-4  h-12 w-full flex items-center justify-between  bg-base-200/45 backdrop-blur-sm shadow-md transition-all">

            {/* LEFT SIDE: Sidebar Toggle + Logo */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="my-drawer-4"
                    aria-label="open sidebar"
                    className={`btn btn-square btn-ghost swap swap-rotate hidden lg:flex ${isLanding ? "hidden" : ""
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        className="size-6"
                    >
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                        <path d="M9 4v16" />
                        <path d="M14 10l2 2l-2 2" />
                    </svg>
                </label>

                <div className="flex items-center gap-2">
                    <Image
                        src="/biselco-icon.png"
                        alt="biselco"
                        width={35}
                        height={35}
                        priority
                    />
                    <span className="text-xl font-bold text-blue-700 hidden sm:block">
                        BISELCO
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: Actions (Hidden on Landing) */}
            {!isLanding && (
                <div className="flex items-center gap-1">
                    <div className="dropdown dropdown-end">
                        <div title="Profile" tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <Image
                                    src={user?.photo ?? "https://img.daisyui.com/images/profile/demo/distracted1@192.webp"}
                                    alt="User Profile"
                                    width={40}
                                    height={40}
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-xl border border-base-300">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge badge-ghost text-xs">Soon</span>
                                </a>
                            </li>
                            <li>
                                <LogoutButton />
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    )

}