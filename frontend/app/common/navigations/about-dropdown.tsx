"use client";
import NavigationButton from "../buttons/navigation-button";
import { Info } from "lucide-react";
function AboutDropDown() {
  return (
    <div className="dropdown  dropdown-center   md:dropdown-bottom">
      <button
        tabIndex={0}
        className=" label hover:text-blue-500 link link-hover w-full  font-semibold"
      >
        About Us
      </button>
      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <NavigationButton
            showLabel
            label="About us"
            is_active={false}
            Icon={Info}
            href="/about"
            showOnMobile
          />
        </li>

        <li>
          <NavigationButton
            showLabel
            label="Franchise Area"
            is_active={false}
            Icon={Info}
            href="/distribution-map"
            showOnMobile
          />
        </li>

        <li>
          <NavigationButton
            showLabel
            label="Privacy Policy"
            is_active={false}
            Icon={Info}
            href="/privacy-policy"
            showOnMobile
          />
        </li>
        <li>
          <NavigationButton
            showLabel
            label="Terms of Service"
            is_active={false}
            Icon={Info}
            href="/terms-service"
            showOnMobile
          />
        </li>
        <li>
          <NavigationButton
            showLabel
            label="Data Deletion"
            is_active={false}
            Icon={Info}
            href="/data-deletion"
            showOnMobile
          />
        </li>
      </ul>
    </div>
  );
}

export default AboutDropDown;
