"use client";
import { Menu, X } from "lucide-react";
import AboutDropDown from "./about-dropdown";
import { useState } from "react";

const LandingPageNavigation = () => {
  const scrollElements = [
    {
      label: "Mission & Vision",
      id: "mission-vision",
    },
    {
      label: "Features",
      id: "features",
    },
    {
      label: "Events",
      id: "events",
    },
    {
      label: "Offices",
      id: "offices",
    },
  ];
  const [open, setOpen] = useState(false);
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };
  return (
    <>
      <div className="hidden relative md:flex navbar-end items-center gap-5">
        {scrollElements.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToElement(item.id)}
            className="link link-hover hover:text-blue-500 text-md label font-semibold"
          >
            {item.label}
          </button>
        ))}
        <AboutDropDown />
      </div>

      <div className="relative md:hidden navbar-end ">
        <button
          onClick={() => setOpen(!open)}
          className="btn btn-circle"
        >
          {open ? (
            <span className="swap swap-active swap-rotate">
              <Menu className="swap-off fill-current" />
              <X className="swap-on fill-current" />
            </span>
            
          ) : (
            <span className="swap  swap-rotate">
              <Menu className="swap-off fill-current" />
              <X className="swap-on fill-current" />
            </span>
          )}
        </button>
        {open && <ul
          className="absolute right-0 top-full mt-2 w-56 menu bg-base-100 rounded-box shadow-lg z-9999"
        >
          {scrollElements.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToElement(item.id)}
                className="link link-hover w-full hover:text-blue-500  label font-semibold"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            
            <AboutDropDown />
          </li>
        </ul>}
      </div>
    </>
  );
};

export default LandingPageNavigation;
