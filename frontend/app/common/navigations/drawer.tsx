"use client";
import React from "react";
import NavBar from "./navbar";
import { usePathname } from "next/navigation";
import { HomeRouteButton } from "../buttons/home";
import About from "../buttons/about";
type Props = {
  children: React.ReactNode;
  baseurl?: string;
};

const Drawer = ({ children }: Props) => {
  const currentRoute = usePathname();
  const invisibleRoutes = [
    "/landing",
    "/biselco-admin-login",
    "/agma-registration",
    "/agma-registration/registered",
    "/about",
  ];
  const isActive =
    currentRoute === "/"
      ? "home"
      : currentRoute === "/complaints"
        ? "complaints"
        : currentRoute === "/technical"
          ? "technical"
          : currentRoute === "/about"
            ? "about"
            : "";

  return (
    <div className="drawer min-h-screen  lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        {/* Navbar */}
        <NavBar />
        {/* Page content here */}
        <div >{children}</div>
      </div>
      <div
        className={`drawer-side z-60 backdrop-blur-xs is-drawer-close:overflow-visible ${invisibleRoutes.includes(currentRoute) ? "hidden" : "visible"}`}
      >
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex flex-col min-h-full items-start bg-base-100  is-drawer-close:w-14  is-drawer-open:w-64">
          {/* Sidebar content here */}
          <div className="w-full is-drawer-close:hidden">
            <div className="divider w-full   divider-warning text-blue-800">
              Menu
            </div>
          </div>

          <ul className="menu w-full  grow">
            {/* List item */}
            <li className="hidden md:block lg:block">
              {/* HOME ROUTE BUTTON */}
              <HomeRouteButton isActive={isActive === "home"} />
            </li>
            <li>
              <About is_active={isActive === "about"} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
