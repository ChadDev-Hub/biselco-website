"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/authProvider";
import LogoutButton from "../auth-component/logout";
import Return from "@/app/common/buttons/Return";
import LandingPageNavigation from "./landingpage-navigations";
import MenuButton from "../buttons/menu-button";
import { UserCircle } from "lucide-react";
export default function NavBar() {
  const currentRouter = usePathname();
  const invisibleRoutes = [
    "/distribution-map",
    "/",
    "/landing",
    "/biselco-admin-login",
    "/agma-registration",
    "/agma-registration/registered",
    "/about",
    "/privacy-policy",
    "/terms-service",
    "/data-deletion",
  ];
  const isInvisible = invisibleRoutes.includes(currentRouter);
  const isLandingPage = currentRouter === "/landing";
  const { user } = useAuth();

  return (
    <nav id="main-navbar" className="sticky top-4 duration-300 ease-in-out  z-50 p-4 max-w-[92%] navbar  h-12 w-full glass rounded-full shadow-md transition-all">
      {/* LEFT SIDE: Sidebar Toggle + Logo */}
      <div className="navbar-start items-center gap-2">
        <div className="hidden sm:block w-fit rounded-full">
          <MenuButton isInvisible={isInvisible} />
        </div>

        <div className="flex  items-center gap-2">
          {currentRouter === "/home" || currentRouter === "/landing" ? (
            <Image
              src="/biselco-icon.png"
              alt="biselco"
              width={35}
              height={35}
              priority
            />
          ) : (
            <Return />
          )}

          <span className="text-xl font-bold text-blue-700 hidden sm:block">
            BISELCO
          </span>
        </div>
      </div>

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
