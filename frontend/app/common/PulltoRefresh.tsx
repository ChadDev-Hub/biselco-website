"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PullToRefresh({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const startY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0 && window.scrollY === 0) {
      setPull(Math.min(distance, 120));
    }
  };

  const handleTouchEnd = async () => {
    if (pull > 80) {
      setRefreshing(true);

      router.refresh();

      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }

    setPull(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen"
    >
      <div
        className="flex justify-center items-center transition-all duration-200 overflow-hidden"
        style={{
          height: `${pull}px`,
        }}
      >
        {refreshing ? (
          <span className="loading loading-spinner loading-md" />
        ) : null}
      </div>

      {children}
    </div>
  );
}