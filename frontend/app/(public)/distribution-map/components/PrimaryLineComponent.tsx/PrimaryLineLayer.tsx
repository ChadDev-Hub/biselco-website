"use client";
import { useMap } from "../MapProvider";
import { PromiseType } from "../../../../../types/promise";
import { use, useEffect, useRef, useState } from "react";
import { PrimaryLines } from "@/types/primary-line";
import PrimaryLinePopup from "./PrimaryLinePopup";
import { createRoot } from "react-dom/client";
import { GeoJSONSource, MapMouseEvent, Popup} from "maplibre-gl";
import { PrimaryLineProperties } from "../../../../../types/primary-line";
import {PrimaryLineLayerId, PrimaryLineSourceId} from "../../components/MapProvider"
type Props = {
  promise: Promise<PromiseType<PrimaryLines>>;
};

const PrimaryLineLayer = ({ promise }: Props) => {
  const initialData = use(promise);
  const [data, setData] = useState<PromiseType<PrimaryLines>>();
  const { mapRef, isMapReady } = useMap();
  const selectedFeatureId = useRef<string | null>(null);
  

  // SETUP INITIAL DATA
  useEffect(() => {
    const setInitialData = async () => {
      setData(initialData);
    };
    setInitialData();
  }, [initialData]);

  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map) return;
    if (!data?.data) return;

    const geojson = data.data;
    
    const setup = () => {
      if (!map.isStyleLoaded()) {
        console.log("Map Style Not Loaded");
        return;
      }
      if (!geojson) {
        console.log("No Feature Data");
        return;
      }
      
      const source = map.getSource(PrimaryLineSourceId) as GeoJSONSource;
      if (source){
        source.setData(geojson);
      }
      
    };

    const attachEvent = () => {
      if (!map.getLayer(PrimaryLineLayerId)) return;
      const handleMouseEnter = () => {
        map.getCanvas().style.cursor = "pointer";
      };
      const handleMouseLeave = () => {
        map.getCanvas().style.cursor = "";
      };
      map.on("mouseenter", PrimaryLineLayerId, handleMouseEnter);
      map.on("mouseleave", PrimaryLineLayerId, handleMouseLeave);
    };

    
    // RUN EACH EVEN IN ASYNC
    const run = () => {
      setup();
      attachEvent();
      
    };

    if (map.isStyleLoaded()) {
      run();
    } else {
      map.once("style.load", run);
    }
  }, [data, mapRef, isMapReady]);

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
    input.id = PrimaryLineLayerId;
    input.checked = true;
    input.className = "checkbox checkbox-primary checkbox-xs";
    container.appendChild(input);

    // ADD LABEL FOR PRIMARY LINE LAYER
    const label = document.createElement("label");
    label.htmlFor = PrimaryLineLayerId;
    label.className = "w-full";
    label.textContent = "Primary Lines";
    filterLayer?.appendChild(label);
    container.appendChild(label);

    // EVENT LISTERNER TO MAKE THE LAYER VISIBLE
    input.addEventListener("change", () => {
      map.setLayoutProperty(
        PrimaryLineLayerId,
        "visibility",
        input.checked ? "visible" : "none",
      );
    });
  }, [ mapRef, isMapReady]);

  // EFFECT ON POPUP
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map) return;
    // SHOW POPUP
    const handleMapClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [PrimaryLineLayerId],
      });
      if (!features.length) {
        if (selectedFeatureId.current !== null) {
          map.setFeatureState(
            {
              source: PrimaryLineSourceId,
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

      const popup = new Popup({
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
            source: PrimaryLineSourceId,
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
          source: PrimaryLineSourceId,
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
