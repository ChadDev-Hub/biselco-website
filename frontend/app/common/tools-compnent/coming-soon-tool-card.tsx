import React from "react";

type Props = {
  children: React.ReactNode;
};

const ComingSoonToolCard = ({ children }: Props) => {
  return (
    <div className="relative w-full h-full group">
      {/* Overlay Layer */}
      <div className="absolute inset-0  z-5 rounded-2xl flex items-center justify-center pointer-events-none">
        <span className="glass text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          Coming Soon
        </span>
      </div>

      {/* Disabled content look */}
      <div className="opacity-40 pointer-events-none select-none">
        {children}
      </div>
    </div>
  );
};

export default ComingSoonToolCard;
