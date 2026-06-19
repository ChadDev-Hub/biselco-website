"use client";
import { usePathname } from "next/navigation";
import { ComplaintsRouteButton } from "../buttons/complaints";
import { HomeRouteButton } from "../buttons/home";
import { PanelLeftOpen } from "lucide-react"
const DocNavigation = () => {
  const currentRoute = usePathname();
  const invisibleRoutes = ["/landing","/biselco-admin-login","/agma-registration","/agma-registration/registered"];
  const isActive =
    currentRoute === "/"
      ? "home"
      : currentRoute === "/complaints"
        ? "complaints"
        : "logout";
  return (
    <div
      className={`dock text-xs dock-xs z-50   bg-base-100  lg:hidden  shadow-lg  ${invisibleRoutes.includes(currentRoute) ? "hidden" : "visible"} `}
    >
      <div className={`${isActive === "home" ? "dock-active" : ""} `}>
        <HomeRouteButton
          isActive={isActive === "home"}
          orientation="flex flex-col"
        />
      </div>

      <div className={`${isActive === "complaints" ? "dock-active" : ""} `}>
        <ComplaintsRouteButton isActive={isActive === "complaints"} />
      </div>

      <div>
        <label
          htmlFor="my-drawer-4"
          aria-label="open sidebar"
          className={`flex flex-col items-center justify-center cursor-pointer`}
        >
          <PanelLeftOpen className="size-6" />
          <span className="dock-label">Menu</span>
        </label>
      </div>
    </div>
  );
};

export default DocNavigation;
