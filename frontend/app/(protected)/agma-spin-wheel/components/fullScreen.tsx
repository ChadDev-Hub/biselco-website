"use client";

import { Maximize, Minimize } from "lucide-react";
import { useState } from "react";

const FullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = async () => {
    if (document.fullscreenElement) {
      setIsFullScreen(false);
      await document.exitFullscreen();
      return;
    }
    setIsFullScreen(true);
    await document.documentElement.requestFullscreen();
  };

  return (
    <button
      type="button"
      onClick={toggleFullScreen}
      className="btn btn-sm btn-dash absolute top-4 right-4"
    >
      {isFullScreen ? (
        <Minimize className="w-6 h-6 text-white" />
      ) : (
        <Maximize className="w-6 h-6 text-white" />
      )}
    </button>
  );
};

export default FullScreen;
