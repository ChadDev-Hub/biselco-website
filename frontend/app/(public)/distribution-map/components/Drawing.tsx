"use client";

import { Geoman, type GmOptionsPartial } from "@geoman-io/maplibre-geoman-free";
import { useMap } from "./MapProvider";
import { useEffect, useRef } from "react";

const Drawing = () => {
  const mapRef = useMap();
  const geomanRef = useRef<Geoman | null>(null);
  useEffect(() => {
    const map = mapRef?.current;
    if (!map) return;

    const initGeoman = () => {
      // Prevent double initialization if effect runs twice (React 18 StrictMode)
      if (geomanRef.current) return;

      const gmOptions: GmOptionsPartial = {
        controls: {
          draw: {
            line: {
              active: true,
              settings: {
                length: true
              }
            },
          },
        },
      };

      geomanRef.current = new Geoman(map, gmOptions);
    };

    // If the map style is already loaded, initialize immediately
    if (map.isStyleLoaded()) {
      initGeoman();
    } else {
      // Fallback: wait for the style to load
      map.once("style.load", initGeoman);
    }

    // Cleanup: Destroy Geoman when the component unmounts
    return () => {
      map.off("style.load", initGeoman);
      if (geomanRef.current) {
        geomanRef.current.destroy();
        geomanRef.current = null;
      }
    };
  }, [mapRef]);

  return null;
};

export default Drawing;
