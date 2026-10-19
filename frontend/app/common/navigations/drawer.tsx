"use client";
import React from "react";
import NavBar from "./navbar";
import { usePathname } from "next/navigation";
import { HomeRouteButton } from "../buttons/home";
import DocNavigation from "./doc";
import NavigationButton from "../buttons/navigation-button";
import {Info, ShieldUser, SquarePen, DatabaseMinus} from "lucide-react"
type Props = {
  children: React.ReactNode;
  baseurl?: string;
};

const Drawer = ({ children }: Props) => {
  const currentRoute = usePathname();
  const invisibleRoutes = [
    "/",
    "/landing",
    "/biselco-admin-login",
    "/agma-registration",
    "/agma-registration/registered",
    "/about",
    "/distribution-map",
    "/privacy-policy",
    "/terms-service",
    "/data-deletion",
  ];

  const closeDrawer = () => {
    const drawer = document.getElementById(
      "my-drawer",
    ) as HTMLInputElement | null;

    if (drawer) {
      drawer.checked = false;
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center">
        {/* Navbar */}
           <NavBar />
        {/* Page content here */}
        <div className="w-full min-h-screen pt-5 pb-25">{children}</div>
        <DocNavigation/>
      </div>
      <div
        className={`drawer-side z-60 backdrop-blur-xs is-drawer-close:overflow-visible ${invisibleRoutes.includes(currentRoute) ? "hidden" : "visible"}`}
      >
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay glass"
        ></label>
        <div className="flex flex-col  min-h-full items-start glass is-drawer-close:w-14  is-drawer-open:w-64 py-4 ">
          {/* Sidebar content here */}
      

          <ul className="menu w-full list  grow  gap-4">
            {/* List item */}
            <li className="hidden md:block is-drawer-open:list-row lg:block">
              {/* HOME ROUTE BUTTON */}
                <HomeRouteButton onClick={closeDrawer} isActive={currentRoute === "/home"} />
            </li>
            <li className="hidden  is-drawer-open:list-row lg:block">
                <NavigationButton onClick={closeDrawer} showLabel label="About us" is_active={currentRoute === "/about"} Icon={Info} href="/about" />
            </li>
            <li className="block is-drawer-open:list-row lg:block">
                <NavigationButton onClick={closeDrawer} showLabel showOnMobile label="Privacy Policy" is_active={currentRoute === "/privacy-policy"} Icon={ShieldUser} href="/privacy-policy" />
            </li>
            <li className="block is-drawer-open:list-row lg:block">
                <NavigationButton onClick={closeDrawer} showLabel showOnMobile label="Terms of Service" is_active={currentRoute === "/terms-service"} Icon={SquarePen} href="/terms-service" />
            </li>
            <li className=" block is-drawer-open:list-row lg:block">
                <NavigationButton onClick={closeDrawer} showLabel showOnMobile label="Data Deletion" is_active={currentRoute === "/data-deletion"} Icon={DatabaseMinus} href="/data-deletion" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
