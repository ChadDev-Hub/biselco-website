"use client";
import React from "react";
import {Settings} from "lucide-react"
type Props = {
  children: React.ReactNode;
};
const Tools = ({ children }: Props) => {
  return (
    <div className="fab fixed right-[6%] bottom-[10%] ">
      <div
        title="Settings"
        tabIndex={0}
        role="button"
        className="btn btn-lg btn-circle btn-info"
      >
        <Settings />
      </div>

      {/* close button should not be focusable so it can close the FAB when clicked. It's just a visual placeholder */}
      <div className="fab-close">
        <span className="btn btn-circle btn-lg btn-error">✕</span>
      </div>
      {children}
    </div>
  );
};

export default Tools;
