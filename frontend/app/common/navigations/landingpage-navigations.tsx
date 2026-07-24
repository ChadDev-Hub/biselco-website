"use client";
import { Menu } from "lucide-react";

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

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    console.log(element);
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
      <div className="hidden md:flex navbar-end items-center gap-5">
        {scrollElements.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToElement(item.id)}
            className="link link-hover hover:text-blue-500 text-md label font-semibold"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="dropdown md:hidden  dropdown-bottom navbar-end">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          <Menu />
        </div>
        <ul
          tabIndex={-1}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {scrollElements.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToElement(item.id)}
                className="link link-hover hover:text-blue-500 text-md label font-semibold"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LandingPageNavigation;
