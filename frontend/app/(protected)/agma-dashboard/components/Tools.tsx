
import React from 'react';


type Props = {
    children: React.ReactNode
}

const NavbarTools = ({children}:Props) => {
  return (
    <div className="navbar navbar-center w-full  p-2 shadow-md mb-4 bg-base-100 rounded-box">
      <div className="flex items-center w-full gap-2">
        {/* SEARCH */}
        <input
          title="Search"
          type="text"
          placeholder="Search"
          className="input input-sm  bg-base-200 shadow-sm rounded-br-3xl w-full max-w-xs"
        />
        {/* FILTER */}
        {children}
      </div>
    </div>
  );
};

export default NavbarTools;
