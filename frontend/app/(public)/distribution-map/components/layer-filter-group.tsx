"use client";

import { Layers } from "lucide-react";
import { useState } from "react";

const LayerFilterGroup = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="absolute top-3 right-3 z-20">
      <div
        className={`
          rounded-box bg-base-300 shadow-lg
          transition-all duration-200 relative
          ${open ? "p-4" : "p-3"}
        `}
      >
        <div
          id="layer-filter"
          className={`min-w-48 place-items-start ${open ? "block" : "hidden"}`}
        >
          <button
            className="absolute top-2 right-2 btn btn-xs btn-circle"
            onClick={handleClose}
            type="button"
          >
            X
          </button>
          <h1 className="font-semibold">Layers</h1>
          {/* filters here */}
        </div>

        <Layers
          size={22}
          onClick={handleOpen}
          className={`${open ? "hidden" : "block"} `}
        />
      </div>
    </div>
  );
};

export default LayerFilterGroup;
