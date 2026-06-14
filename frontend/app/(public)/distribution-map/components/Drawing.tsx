"use client";

import { Geoman } from "@geoman-io/maplibre-geoman-free";
import { useMap } from "./MapProvider";
import { useEffect, useRef } from "react";

const Drawing = () => {
  const {mapRef} = useMap();
  const geomanRef = useRef<Geoman | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      const map = mapRef?.current;
      if (!map || geomanRef.current) return;

      if (!map.isStyleLoaded()) return;

      geomanRef.current = new Geoman(map, {
        controls: {
          draw: {
            line: {
              active: true,
              settings: {
                length: true,
              },
            },
          },
        },
      });

      clearInterval(interval);
    }, 200);

    return () => {
      clearInterval(interval);
      geomanRef.current?.destroy();
      geomanRef.current = null;
    };
  }, [mapRef]);
  return null;
};

export default Drawing;
