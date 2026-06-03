"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../utils/authProvider";
import LogoutButton from "./auth-component/logout";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const currentRouter = usePathname();
  const invisibleRoutes = ["/landing", "/biselco-admin-login", "/agma-registration", "/agma-registration/registered"];
  const isLanding = invisibleRoutes.includes(currentRouter);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <nav className="sticky top-0 z-60 p-4  h-12 w-full flex items-center justify-between  bg-base-200/45 backdrop-blur-sm shadow-md transition-all">
      {/* LEFT SIDE: Sidebar Toggle + Logo */}
      <div className="flex items-center gap-2">
        <label
          onClick={handleClick}
          htmlFor="my-drawer-4"
          aria-label="open sidebar"
          className={`btn btn-square btn-ghost  ${
            isLanding ? "hidden" : "hidden lg:flex"
          }`}
        >
          <PanelLeftClose
            className={`size-6 transition-all duration-300 ${
              open ? "hidden" : "block"
            }`}
          />
          <PanelLeftOpen
            className={`size-6 transition-all duration-300 ${
              open ? "block" : "hidden"
            }`}
          />
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
            <div
              title="Profile"
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image
                  src={
                    user?.photo ??
                    "https://img.daisyui.com/images/profile/demo/distracted1@192.webp"
                  }
                  alt="User Profile"
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-xl border border-base-300"
            >
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
  );
}
