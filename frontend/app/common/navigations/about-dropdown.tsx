"use client";
import Link from "next/link";
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
          <Link className="hover:text-blue-500 link link-hover" href="/about">History</Link>
        </li>

        <li>
          <Link className="hover:text-blue-500 link link-hover" href="/distribution-map">Franchise Area</Link>
        </li>
      </ul>
    </div>
  );
}

export default AboutDropDown;
