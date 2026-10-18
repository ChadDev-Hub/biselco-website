"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useRef } from "react";
type Props = {
  isInvisible?: boolean;
};

const MenuButton = ({ isInvisible }: Props) => {
  const swapInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // SWAP LOGIC THAT LISTEN ON DRAWER INPUT CHANGES
    const handleSwap = () => {
      const drawer = document.getElementById(
        "my-drawer",
      ) as HTMLInputElement | null;
      if (!drawer || !swapInput.current) return;

      swapInput.current.checked = drawer.checked;
    };
    document.addEventListener("change", handleSwap);
    return () => {
      document.removeEventListener("change", handleSwap);
    };
  }, []);
  return (
    
      <label
        htmlFor="my-drawer"
        aria-label="open sidebar"
        className={`swap swap-flip  md:btn md:btn-circle md:btn-ghost md:glass ${isInvisible ? "hidden" : ""}`}
      >
        <input ref={swapInput} type="checkbox" />
        <PanelLeftClose className="swap-off" />
        <PanelLeftOpen className="swap-on" />
      </label>
  
  );
};

export default MenuButton;
