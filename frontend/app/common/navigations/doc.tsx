"use client";
import { usePathname } from "next/navigation";
import { ComplaintsRouteButton } from "../buttons/complaints";
import { HomeRouteButton } from "../buttons/home";
import MenuButton from '../buttons/menu-button';
import NavigationButton from "../buttons/navigation-button";
import { Info } from "lucide-react";
const DocNavigation = () => {
  const currentRoute = usePathname();
  const invisibleRoutes = ["/","/landing","/biselco-admin-login","/agma-registration","/agma-registration/registered","/distribution-map", "/about", "/privacy-policy", "/terms-service", "/data-deletion"];
  const isActive =
    currentRoute === "/home"
      ? "home"
      : currentRoute === "/complaints"
        ? "complaints"
        : currentRoute === "/about"
          ? "about"
        : "logout";
  return (
    <nav
      className={`dock justify-between glass max-w-[92%]  sticky bottom-4 rounded-full w-full text-xs dock-sm z-50    md:hidden  shadow-lg  ${invisibleRoutes.includes(currentRoute) ? "hidden" : "visible"} `}
    >   
    {/* BUTTONS */}
        {/* Home */}
        <HomeRouteButton
          isActive={isActive === "home"}
          orientation="flex flex-col"
        />
        
        

        {/* Complaints */}
        <ComplaintsRouteButton isActive={isActive === "complaints"} />
        
        {/* About */}
        <NavigationButton label="About us" Icon={Info} href="/about" is_active={isActive === "about"} />

        {/* Menu */}
        <MenuButton isInvisible={false} />

    </nav>
  );
};

export default DocNavigation;
