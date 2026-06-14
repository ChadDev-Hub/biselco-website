"use client";
import { usePathname } from "next/navigation";
import { ComplaintsRouteButton } from "./buttons/complaints";
import { HomeRouteButton } from "./buttons/home";
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={25}
            height={25}
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className=""
          >
            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
            <path d="M9 4v16"></path>
            <path d="M14 10l2 2l-2 2"></path>
          </svg>
          <span className="dock-label">Menu</span>
        </label>
      </div>
    </div>
  );
};

export default DocNavigation;
