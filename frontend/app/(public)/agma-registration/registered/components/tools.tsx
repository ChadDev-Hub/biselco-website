"use client";
import { useState } from "react";
import {Menu, XIcon} from "lucide-react";
type Props = {
  children: React.ReactNode;
};

const Tools = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  return (
        <div className="relative inline-block">
      <button
      title="Tools"
      type="button"
        className="btn  btn-md btn-circle "
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`transition-transform duration-300 ${
            open ? "rotate-90 opacity-0 scale-75" : "rotate-0"
          }`}
        >
          <Menu size={18} />
        </span>

        <span
          className={`absolute transition-transform duration-300 ${
            open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
          }`}
        >
          <XIcon size={18} />
        </span>
      </button>

      {open && (
          <>
          {children}
          </>
      )}
    </div>
  );
};

export default Tools;
