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
    <nav
      className={`dock glass navbar-center  max-w-[92%] fixed bottom-4    rounded-full w-full text-xs z-50    md:hidden  shadow-lg  ${invisibleRoutes.includes(currentRoute) ? "hidden" : "visible"} `}
    >
      {/* BUTTONS */}
      
        {/* Home */}
        <HomeRouteButton isActive={isActive === "home"} />
      

      
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
      
    </nav>
  );
};

export default DocNavigation;
