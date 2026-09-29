"use client";

import { useEffect, use, useState } from "react";
import { useMap } from "../MapProvider";
import { PromiseType } from "../../../../../types/promise";
import { Transformers, TransformerProperties } from "@/types/transformer";
import {
  MapMouseEvent,
  MapGeoJSONFeature,
  Popup,
  GeoJSONSource,
} from "maplibre-gl";
import { createRoot } from "react-dom/client";
import TransformerPopup from "./transformerPopup";
import { useAuth } from "@/app/context/authProvider";
import {
  TransformerSourceId,
  UnclusteredTransformer,
  TransformerLayerId,
  TransformerClusterCount,
  TransformerPing,
} from "../MapProvider";

type Props = {
  promise: Promise<PromiseType<Transformers>>;
};

const TransformerLayer = ({ promise }: Props) => {
  const initialdata = use(promise);
  const [data, setData] = useState<PromiseType<Transformers>>();
  const { mapRef, isMapReady } = useMap();

  const { user } = useAuth();
  // SET DATA STATE
  useEffect(() => {
    const setInitialData = () => {
      setData(initialdata);
    };
    setInitialData();
  }, [initialdata]);

  useEffect(() => {
    if (!mapRef?.current) return;
    if (!isMapReady) return;
    if (!data?.data) return;

    const map = mapRef.current;
    const geojson = data.data;

    const addTransformerData = () => {
      const source = map.getSource(TransformerSourceId) as GeoJSONSource;
      if (source) {
        source.setData(geojson);
      }
    };
    const attachEvents = () => {
      if (!map.getLayer(UnclusteredTransformer)) return;

      const handleMouseEnter = () => {
        map.getCanvas().style.cursor = "pointer";
      };
      const handleMouseLeave = () => {
        map.getCanvas().style.cursor = "";
      };

      map.on("mouseenter", UnclusteredTransformer, handleMouseEnter);
      map.on("mouseleave", UnclusteredTransformer, handleMouseLeave);
    };

    addTransformerData();
    attachEvents();

  }, [data, mapRef, isMapReady]);

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
        TransformerLayerId,
        "visibility",
        input.checked ? "visible" : "none",
      );
      map.setLayoutProperty(
        UnclusteredTransformer,
        "visibility",
        input.checked ? "visible" : "none",
      );
      map.setLayoutProperty(
        TransformerClusterCount,
        "visibility",
        input.checked ? "visible" : "none",
      );
      map.setLayoutProperty(
        TransformerPing,
        "visibility",
        input.checked ? "visible" : "none",
      );
    });
  }, [mapRef, isMapReady]);

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

      if (map.getLayer(TransformerPing)) {
        map.setPaintProperty(TransformerPing, "circle-radius", radius);

        map.setPaintProperty(TransformerPing, "circle-opacity", opacity);

        map.setPaintProperty(TransformerPing, "circle-stroke-opacity", opacity);
      }

      animationFrame = requestAnimationFrame(animatePing);
    };

    animationFrame = requestAnimationFrame(animatePing);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [mapRef, isMapReady]);

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
        <TransformerPopup
          TransformerProperties={feature}
          setData={setData}
          user={user}
        />,
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

    map.on("click", [UnclusteredTransformer], handleMapClick);
  }, [isMapReady, mapRef, user]);

  return null;
};

export default TransformerLayer;
