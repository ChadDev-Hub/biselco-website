"use client";
import { useMap } from "../MapProvider";
import { PromiseType } from "../../../../../types/promise";
import { use, useEffect, useRef } from "react";
import { PrimaryLines } from "@/types/primary-line";
import PrimaryLinePopup from "./PrimaryLinePopup";
import { createRoot } from "react-dom/client";
import Maplibregl from "maplibre-gl";
import { PrimaryLineProperties } from "../../../../../types/primary-line";
type Props = {
  promise: Promise<PromiseType<PrimaryLines>>;
};

const PrimaryLineLayer = ({ promise }: Props) => {
  const initialData = use(promise);
  const { mapRef, isMapReady } = useMap();
  const selectedFeatureId = useRef<string | null>(null);
  const sourceId = "primary-lines";
  const layerId = "primary-lines-layer";

  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map || !initialData?.data) return;
    if (!map.isStyleLoaded()) return;
    const geojson = initialData.data;
    const setup = () => {
      if (!map) return;
      if (!geojson) {
        console.log("No Feature Data");
        return;
      }
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: geojson,
          promoteId: "primary_line_id",
        });
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],

              "#FFD51E",
              ["get", "color"],
            ],
            "line-width": 2,
          },
        });
      }
    };

    //  Visual Pointer Changes
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mouseleave", layerId, handleMouseLeave);

    if (map.isStyleLoaded()) {
      setup();
    } else {
      map.once("style.load", setup);
    }

    return () => {
      if (map && map.getStyle()) {
        map.removeLayer(layerId);
        map.removeSource(sourceId);
      }
    };
    //
  }, [initialData, mapRef, isMapReady]);

  // USE EFFECT FOR FILTERING LAYER
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map) return;
    // FILTER CONTAINER
    const filterLayer = document.getElementById("layer-filter");
    const container = document.createElement("div");
    container.className = "flex gap-2 p-2 w-full items-center";
    filterLayer?.appendChild(container);

    // ADD CHECK BOX FOR PRIMARY LINE LAYER
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = layerId;
    input.checked = true;
    input.className = "checkbox checkbox-primary checkbox-xs";
    container.appendChild(input);

    // ADD LABEL FOR PRIMARY LINE LAYER
    const label = document.createElement("label");
    label.htmlFor = layerId;
    label.className = "w-full";
    label.textContent = "Primary Lines";
    filterLayer?.appendChild(label);
    container.appendChild(label);

    // EVENT LISTERNER TO MAKE THE LAYER VISIBLE
    input.addEventListener("change", () => {
      map.setLayoutProperty(
        layerId,
        "visibility",
        input.checked ? "visible" : "none",
      );
    });
  }, [layerId, mapRef, isMapReady]);

  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map) return;
    // SHOW POPUP
    const handleMapClick = (e: Maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerId],
      });
      if (!features.length) {
        console.log("no features");
        if (selectedFeatureId.current !== null) {
          map.setFeatureState(
            {
              source: sourceId,
              id: selectedFeatureId.current,
            },
            {
              selected: false,
            },
          );
          selectedFeatureId.current = null;
        }
        return;
      }

      const feature = features[0];
      const properties = feature.properties as PrimaryLineProperties;

      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      const popupNode = document.createElement("div");
      const root = createRoot(popupNode);
      root.render(<PrimaryLinePopup primaryLinePopup={properties} />);

      const popup = new Maplibregl.Popup({
        className: "custom-maplibre-popup",
        closeButton: false,
        closeOnClick: true,
        maxWidth: "none",
        anchor: "bottom",
        offset: [0, -10],
      })
        .setLngLat(coordinates)
        .setDOMContent(popupNode);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const map = mapRef.current;
          if (map && map.getStyle()) {
            popup.addTo(map);
          }
        });
      });
      if (selectedFeatureId.current !== null) {
        map.setFeatureState(
          {
            source: sourceId,
            id: selectedFeatureId.current,
          },
          {
            selected: false,
          },
        );
      }

      selectedFeatureId.current = properties.primary_line_id;
      map.setFeatureState(
        {
          source: sourceId,
          id: properties.primary_line_id,
        },
        {
          selected: true,
        },
      );
    };

    map.on("click", handleMapClick);
  }, [isMapReady, mapRef]);

  return null;
};

export default PrimaryLineLayer;
