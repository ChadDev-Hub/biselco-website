"use client";
import { use, useEffect } from "react";
import { Offices } from "@/types/offices";
import { useMap } from "../../distribution-map/components/MapProvider";
import { Building2 } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import BiselcoOfficePopup from "./biselcoOfficesPopup";
import Maplibregl from "maplibre-gl";
type PromiseType = Promise<{
  status: number;
  error?: string;
  data?: Offices;
}>;
type Props = {
  promise: PromiseType;
};
const icon = renderToStaticMarkup(<Building2 size={20} color="#3b82f6" />);
const BiselcoOffices = ({ promise }: Props) => {
  const initialData = use(promise);
  console.log(initialData);
  const { mapRef, isMapReady } = useMap();
  useEffect(() => {
    if (!isMapReady) return;
    const map = mapRef?.current;
    if (!map || !initialData?.data) return;
    const geojson = initialData.data;
    const markers: Maplibregl.Marker[] = [];
    const setup = () => {
      if (!map.isStyleLoaded()) return;

      geojson.features.forEach((feature) => {
        if (!feature.geometry) return;
        const markerEl = document.createElement("div");
        markerEl.innerHTML = icon;
        Object.assign(markerEl.style, {
          width: "24px",
          height: "24px",
          background: "white",
          shadow: "0 0 0 2px #3b82f6",
          border: "1px solid #3b82f6",
          borderRadius: "9999px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        });
        markerEl.addEventListener("click", () => {
            const properties = feature.properties;
            const popupNode = document.createElement("div");
            const root = createRoot(popupNode);
            root.render(<BiselcoOfficePopup properties={properties}/>);
            requestAnimationFrame(() => {
                const popup = new Maplibregl.Popup({ anchor: "top" })
              .setLngLat(feature.geometry.coordinates as [number, number])
              .setDOMContent(popupNode);
            popup.addTo(map);
            })
            
        })

        const marker = new Maplibregl.Marker({element: markerEl, anchor: "center"})
          .setLngLat(feature.geometry.coordinates as [number, number])
          .addTo(map);
        markers.push(marker);
      });
    };
    if (map.isStyleLoaded()) {
      setup();
    } else {
      map.on("load", setup);
    }
    return () => {
      map.off("load", setup);
      markers.forEach((marker) => marker.remove());
    };
  }, [isMapReady, mapRef, initialData?.data]);
  return null;
};

export default BiselcoOffices;
