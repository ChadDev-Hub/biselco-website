"use client";

import { useEffect, use } from "react";
import { useMap } from "../MapProvider";
import { PromiseType } from "../../../../../types/promise";
import { Transformers } from "@/types/transformer";


type Props = {
  promise: Promise<PromiseType<Transformers>>;
};

const TransformerLayer = ({ promise }: Props) => {
  const data = use(promise);
  const { mapRef, isMapReady } = useMap();

  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map || !data?.data) return;

    const sourceId = "transformers";
    const layerId = "transformers-layer";
    const unclusteredId = "transformers-unclustered";
    const clusterCountId = "transformers-cluster-count";

    const setup = async () => {
      if (!map) return;
      if (!data.data) return;
      if (!map.hasImage("custom-marker")) {
        const transformerSvg = `
 

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          
        >
                <!-- White circular background -->
          <circle
          cx="15"
          cy="15"
          r="15"
          fill="white"
          stroke="#0D47A1"
          stroke-width="2"
          />
          <g 
          transform="translate(3 3) scale(1)"
          fill="#FFDDB0"
          stroke="#f59e0b"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">

            <rect x="2" y="7" width="20" height="12" rx="2" />
            <path d="M14 13h4" stroke="blue"/>
            <path d="M16 15v-4" stroke="blue"/>
            <path d="M6 13h4" stroke="red"/>
            <path d="M18 5v2" />
            
            <path d="M6 5v2"/>
          </g>
          
        </svg>
   
        `;

        const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(transformerSvg)}`;
        // const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to decode SVG"));
          img.src = svgUrl;
        });

        map.addImage("custom-marker", img);
      }

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          cluster: true,
          type: "geojson",
          data: data.data,
        });
      }
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });
      }
      if (!map.getLayer(clusterCountId)) {
        map.addLayer({
          id: clusterCountId,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#fff",
          },
        });
      }

      if (!map.getLayer(unclusteredId)) {
        map.addLayer({
          id: unclusteredId,
          type: "symbol",
          source: sourceId,
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "custom-marker",
            "icon-allow-overlap": true,
            "icon-size": 1,
          },
        });
      }
    };

    const attachEvents = async() => {
      if (!map.getLayer(layerId)) return;

      
      const handleMouseEnter = () => {
        map.getCanvas().style.cursor = "pointer";
      };
      const handleMouseLeave = () => {
        map.getCanvas().style.cursor = "";
      };

      map.on("mouseenter", unclusteredId, handleMouseEnter);
      map.on("mouseleave", unclusteredId, handleMouseLeave);
      

    };
    const run = async () => {
      await setup();
      await attachEvents();
    };

    if (map.isStyleLoaded()) {
      run();
    } else {
      map.once("load", run);
    }

    return () => {
      if (map && map.getStyle()) {
        map.removeLayer(layerId);
        map.removeLayer(unclusteredId);
        map.removeLayer(clusterCountId);
        map.removeSource(sourceId);
      }
    };
  }, [data, mapRef, isMapReady]);
  return null;
};

export default TransformerLayer;
