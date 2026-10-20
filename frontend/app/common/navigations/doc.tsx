"use client";
import { usePathname } from "next/navigation";
import { ComplaintsRouteButton } from "../buttons/complaints";
import { HomeRouteButton } from "../buttons/home";
import MenuButton from "../buttons/menu-button";
import NavigationButton from "../buttons/navigation-button";
import { Info } from "lucide-react";

const DocNavigation = () => {
  const currentRoute = usePathname();
  const invisibleRoutes = [
    "/",
    "/landing",
    "/biselco-admin-login",
    "/agma-registration",
    "/agma-registration/registered",
    "/distribution-map",
    "/about",
    "/privacy-policy",
    "/terms-service",
    "/data-deletion",
  ];
  const isActive =
    currentRoute === "/home"
      ? "home"
      : currentRoute === "/complaints"
        ? "complaints"
        : currentRoute === "/about"
          ? "about"
          : "logout";
  return (
    
      <div
        id="main-doc"
        className={`dock dock-xs items-center transition-all duration-300 ease-in-out justify-evenly shadow-2xl glass  w-full text-xs z-50  md:hidden  s  ${invisibleRoutes.includes(currentRoute) ? "hidden" : "visible"} `} 
      >
        {/* BUTTONS */}
    
          <HomeRouteButton isActive={isActive === "home"} />
       
        {/* Home */}
        
   
          {/* Complaints */}
           <ComplaintsRouteButton isActive={isActive === "complaints"} />
      
    
          <NavigationButton
          label="About us"
          Icon={Info}
          href="/about"
          showOnMobile={false}
          is_active={isActive === "about"}
        />
      
        

        {/* About */}

        {/* Menu */}
        <MenuButton isInvisible={false} />
      
        
      </div>
   
  );
};

export default DocNavigation;
