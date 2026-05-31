
import React from 'react';


type Props = {
    children: React.ReactNode
}

const NavbarTools = ({children}:Props) => {
  return (
    <div className="navbar navbar-center w-full  p-2 shadow-md mb-4 bg-base-100 rounded-box">
      <div className="flex items-center justify-end w-full gap-2">
        {children}
      </div>
    </div>
  );
};

export default NavbarTools;
