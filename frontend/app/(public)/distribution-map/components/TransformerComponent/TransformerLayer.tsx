"use client";

import { useEffect, use, useState } from "react";
import { useMap } from "../MapProvider";
import { PromiseType } from "../../../../../types/promise";
import { Transformers, TransformerProperties } from "@/types/transformer";
import { MapMouseEvent, MapGeoJSONFeature, Popup } from "maplibre-gl";
import { createRoot } from "react-dom/client";
import TransformerPopup from "./transformerPopup";
type Props = {
  promise: Promise<PromiseType<Transformers>>;
};

const TransformerLayer = ({ promise }: Props) => {
  const initialdata = use(promise);
  const [data, setData] = useState<PromiseType<Transformers>>();
  const { mapRef, isMapReady } = useMap();
  const sourceId = "transformers";
  const layerId = "transformers-layer";
  const unclusteredId = "transformers-unclustered";
  const clusterCountId = "transformers-cluster-count";
  const pingLayerId = `${unclusteredId}-ping`;

  // SET DATA STATE
  useEffect(() => {
    const setInitialData = async () => {
      setData(initialdata);
    };
    setInitialData();
  }, [initialdata]);

  // INITIATE LAYER
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map || !data?.data) return;
    if (!map.isStyleLoaded()) return;
    const setup = async () => {
      if (!map) return;
      if (!data.data) return;
      if (!map.hasImage("custom-marker")) {
        const transformerSvg = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 32 32"
          
        >
                <!-- White circular background -->
          <circle
          cx="12"
          cy="12"
          r="12"
          fill="white"
          drop-shadow="0 0 2px rgba(0, 0, 0, 0.3)"
          stroke="black"
          stroke-width="0.8"
          />
          <g 
          transform="translate(3 3) scale(0.7)"
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

        img.onload = () => {
          if (!map.hasImage("custom-marker")) {
            map.addImage("custom-marker", img);
          }
        };


        // ADD TRANSFORMER SOURCE
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            cluster: true,
            type: "geojson",
            data: data.data,
          });
        }

        // ADD CLUSTER LAYER
        if (!map.getLayer(layerId)) {
          map.addLayer({
            id: layerId,
            type: "symbol",
            source: sourceId,
            filter: ["has", "point_count"],
            layout: {
              "icon-image": "custom-marker",
              "icon-offset": [3, 2.5],
              "icon-allow-overlap": true,
              "icon-size": 1,
              "text-field": ["get", "transformer_id"],
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 7,
              "text-anchor": "top",
              "text-offset": [0, 2],
            },
            paint: {
              "text-color": "black",
            },
          });
        }

        // ADD COUNT ON CLUSTER LAYER
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
              "text-color": "black",
            },
          });
        }

        // ADD PING UNCLUSTER LAYER 
        if (!map.getLayer(pingLayerId)) {
          map.addLayer({
            id: pingLayerId,
            type: "circle",
            source: sourceId,
            filter: ["!", ["has", "point_count"]],

            paint: {
              "circle-color": [
                "case",
                ["==", ["get", "is_active"], true],
                "#2A7C13",
                ["==", ["get", "is_active"], false],
                "red",
                "#2A7C13",
              ],
              "circle-radius": 11,
              "circle-opacity": 0.8,
              "circle-stroke-width": 0.5,
              "circle-stroke-opacity": 1,
            },
          });
        }

        // ADD UNLUSTERED LAYER
        if (!map.getLayer(unclusteredId)) {
          map.addLayer({
            id: unclusteredId,
            type: "symbol",
            source: sourceId,
            filter: ["!", ["has", "point_count"]],

            layout: {
              "icon-image": "custom-marker",
              "icon-offset": [3, 2.5],
              "icon-allow-overlap": true,
              "icon-size": 1,
              "text-field": ["get", "transformer_id"],
              "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
              "text-size": 7,
              "text-anchor": "top",
              "text-offset": [0, 2],
            },
            paint: {
              "text-color": "black",
            },
          });
        }
        map.moveLayer(pingLayerId, unclusteredId);
        img.src = svgUrl;
      }
    };

    const attachEvents = async () => {
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
      map.once("style.load", run);
    }

    return () => {
      if (map && map.getStyle()) {
        map.removeLayer(layerId);
        map.removeLayer(unclusteredId);
        map.removeLayer(clusterCountId);
        map.removeLayer(pingLayerId);
        map.removeSource(sourceId);
      }
    };
  }, [data, mapRef, isMapReady, pingLayerId]);

  // EFFECT FOR LAYER FILTERING
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map) return;

    const filterLayer = document.getElementById("layer-filter");
    // FILTER CONTAINER
    const container = document.createElement("div");
    container.className = "flex gap-2 p-2 w-full items-center";
    filterLayer?.appendChild(container);

    // INPUT FIELD
    const input = document.createElement("input");
    input.id = "distribution-transformer-layer";
    input.checked = true;
    input.type = "checkbox";
    input.className = "checkbox checkbox-primary checkbox-xs";
    container.appendChild(input);

    // LABEL FOR INPUT FIELD
    const label = document.createElement("label");
    label.className = "w-full";
    label.htmlFor = "distribution-transformer-layer";
    label.textContent = "Distribution Transformers";
    container.appendChild(label);

    input.addEventListener("change", () => {
      map.setLayoutProperty(
        layerId,
        "visibility",
        input.checked ? "visible" : "none",
      );
      map.setLayoutProperty(
        unclusteredId,
        "visibility",
        input.checked ? "visible" : "none",
      );
      map.setLayoutProperty(
        clusterCountId,
        "visibility",
        input.checked ? "visible" : "none",
      );
      map.setLayoutProperty(
        pingLayerId,
        "visibility",
        input.checked ? "visible" : "none",
      );
    });
  }, [mapRef, isMapReady, layerId, unclusteredId, clusterCountId, pingLayerId]);

  // ANIMATION EFFECT PING

  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map) return;
    let animationFrame: number;
    let start: number | null = null;

    const animatePing = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }

      const duration = 1200;
      const progress = ((timestamp - start) % duration) / duration;

      // Expand
      const radius = 8 + progress * 10;

      // Fade
      const opacity = 0.8 * (1 - progress);

      if (map.getLayer(pingLayerId)) {
        map.setPaintProperty(pingLayerId, "circle-radius", radius);

        map.setPaintProperty(pingLayerId, "circle-opacity", opacity);

        map.setPaintProperty(pingLayerId, "circle-stroke-opacity", opacity);
      }

      animationFrame = requestAnimationFrame(animatePing);
    };

    animationFrame = requestAnimationFrame(animatePing);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [mapRef, isMapReady, pingLayerId]);

  // POPUP EFFECT ON MOUSE CLICK
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map) return;
    const handleMapClick = (
      e: MapMouseEvent & {
        features?: MapGeoJSONFeature[];
      },
    ) => {
      if (!e.features?.length) return;
      const feature = e.features[0].properties as TransformerProperties;
      const popupNode = document.createElement("div");
      const root = createRoot(popupNode);
      root.render(
        <TransformerPopup TransformerProperties={feature} setData={setData} />,
      );

      new Popup({
        className: "custom-maplibre-popup",
        closeButton: false,
        closeOnClick: true,
        maxWidth: "none",
        anchor: "bottom",
        offset: [0, -10],
      })
        .setLngLat(e.lngLat)
        .setDOMContent(popupNode)
        .addTo(map);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          popupNode.style.opacity = "1";
        });
      });
    };

    map.on("click", [unclusteredId], handleMapClick);
  }, [isMapReady, mapRef]);

  return null;
};

export default TransformerLayer;
