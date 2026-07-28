"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/authProvider";
import LogoutButton from "../auth-component/logout";
import { PanelLeftClose, PanelLeftOpen, UserCircle } from "lucide-react";
import { useState } from "react";
import LandingPageNavigation from "./landingpage-navigations";
export default function NavBar() {
  const currentRouter = usePathname();
  const invisibleRoutes = [
    "/landing",
    "/biselco-admin-login",
    "/agma-registration",
    "/agma-registration/registered",
    "/about",
  ];
  const isInvisible = invisibleRoutes.includes(currentRouter);
  const isLandingPage = currentRouter === "/landing";
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <nav className="sticky top-0 z-50 p-4 navbar  h-12 w-full    bg-base-200 backdrop-blur-sm shadow-md transition-all">
      {/* LEFT SIDE: Sidebar Toggle + Logo */}
      <div className="navbar-start items-center gap-2">
        <label
          onClick={handleClick}
          htmlFor="my-drawer-4"
          aria-label="open sidebar"
          className={`btn btn-square btn-ghost  ${
            isInvisible ? "hidden" : "hidden lg:flex"
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

      {/* CENTER SIDE: Search Bar (Hidden on Landing) */}
      {isLandingPage && <LandingPageNavigation />}

      {/* RIGHT SIDE: Actions (Hidden on Landing) */}
      {!isInvisible && (
        <div className="flex navbar-end items-center gap-1">
          <div className="dropdown dropdown-end">
            <div className="aura rounded-full text-primary aura-glow">
              <div
              title="Profile"
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar size-10 overflow-hidden"
            >
                  {user?.photo ? (
                    <Image
                      src={user?.photo}
                      alt="User Profile"
                      width={30}
                      height={30}
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <UserCircle className="w-10 h-10" />
                  )}
                
              
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
