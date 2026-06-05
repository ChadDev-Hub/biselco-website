"use client";
import { useMap } from "../MapProvider";
import { PromiseType } from "../../../../../types/promise";
import { use, useEffect } from "react";
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
  const mapRef = useMap();

  useEffect(() => {
    const map = mapRef?.current;
    if (!map || !initialData?.data) return;

    const sourceId = "primary-lines";
    const layerId = "primary-lines-layer";
    const geojson = initialData.data;
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });
    }
    map.on("load", async()=>{
      
    })
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
          "line-color": ["get", "color"],
          "line-width": 2,
        },
      });
    }

    // SHOW POPUP
    const handleMapClick = (
      e: Maplibregl.MapMouseEvent & {
        features?: Maplibregl.MapGeoJSONFeature[];
      },
    ) => {
      if (!e.features?.length) return;

      const feature = e.features[0];
      const properties = feature.properties as PrimaryLineProperties;

      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      const popupNode = document.createElement("div");
      const root = createRoot(popupNode);
      root.render(<PrimaryLinePopup primaryLinePopup={properties} />);

      const popup = new Maplibregl.Popup({
        className: "custom-maplibre-popup",
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
    };

    // 3. Visual Pointer Changes
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", layerId, handleMapClick);
    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mouseleave", layerId, handleMouseLeave);

    return () => {
      if (map && map.getStyle()) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      }
    };
    //
  }, [initialData, mapRef]);

  return null;
};

export default PrimaryLineLayer;
