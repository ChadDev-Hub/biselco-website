"use client";
import {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import Maplibregl from "maplibre-gl";
import LayerFilterGroup from "./layer-filter-group";

// PRIMARY LINE LAYER
export const PrimaryLineSourceId = "primary-lines";
export const PrimaryLineLayerId = "primary-lines-layer";

// TRANSFORMER LAYER
export const TransformerSourceId = "transformers";
export const TransformerLayerId = "transformers-layer";
export const UnclusteredTransformer = "transformers-unclustered";
export const TransformerClusterCount = "transformers-cluster-count";
export const TransformerPing = `${UnclusteredTransformer}-ping`;

type Props = {
  children: ReactNode;
  className?: string;
};
type MapContextType = {
  mapRef: React.RefObject<Maplibregl.Map | null> | null;
  isMapReady: boolean;
};
const mapContext = createContext<MapContextType>({
  mapRef: null,
  isMapReady: false,
});

const MapProvider = ({ children, className }: Props) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Maplibregl.Map | null>(null);
  const [isMapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new Maplibregl.Map({
      container: mapContainer.current,
      attributionControl: false,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [120.2043, 11.9986],
      zoom: 10,
    });
    mapRef.current = map;
    const geolocation = new Maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
    });
    map.addControl(geolocation, "top-left");
    map.addControl(new Maplibregl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      // ADD PRIMARY LINE SOURCE
      if (!map.getSource(PrimaryLineSourceId)) {
        map.addSource(PrimaryLineSourceId, {
          type: "geojson",
          promoteId: "primary_line_id",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
      }

      // ADD PRIMARY LINE LAYER
      if (!map.getLayer(PrimaryLineLayerId)) {
        map.addLayer({
          id: PrimaryLineLayerId,
          type: "line",
          source: PrimaryLineSourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              "#70e000",
              ["get", "color"],
            ],
            "line-width": 2,
          },
        });
      }

      const transformerSvg = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 32 32"
      >
        <circle
          cx="12"
          cy="12"
          r="12"
          fill="white"
          stroke="black"
          stroke-width="0.8"
        />

        <g
          transform="translate(3 3) scale(0.7)"
          fill="#FFDDB0"
          stroke="#f59e0b"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect
            x="2"
            y="7"
            width="20"
            height="12"
            rx="2"
          />

          <path d="M14 13h4" stroke="blue"/>
          <path d="M16 15v-4" stroke="blue"/>
          <path d="M6 13h4" stroke="red"/>
          <path d="M18 5v2"/>
          <path d="M6 5v2"/>
        </g>
      </svg>
    `;

      const svgUrl =
        `data:image/svg+xml;charset=utf-8,` +
        encodeURIComponent(transformerSvg);

      const img = new Image();

      img.onload = () => {
        console.log("CUSTOM MARKER LOADED");

        // Add image
        if (!map.hasImage("custom-marker")) {
          map.addImage("custom-marker", img);
        }
      };

      // ADD TRANSFORMER SOURCE
      if (!map.getSource(TransformerSourceId)) {
        map.addSource(TransformerSourceId, {
          cluster: true,
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });
      }
      // TRANSFORMER LAYER
      if (!map.getLayer(TransformerLayerId)) {
        map.addLayer({
          id: TransformerLayerId,
          type: "symbol",
          source: TransformerSourceId,
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

      // ADD CLUSTER COUNT LAYER
      if (!map.getLayer(TransformerClusterCount)) {
        map.addLayer({
          id: TransformerClusterCount,
          type: "symbol",
          source: TransformerSourceId,
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

      //  PING LAYER
      // ADD PING UNCLUSTER LAYER
      if (!map.getLayer(TransformerPing)) {
        map.addLayer({
          id: TransformerPing,
          type: "circle",
          source: TransformerSourceId,
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

      // TRANSFORMER LAYER

      // ADD UNLUSTERED LAYER
      if (!map.getLayer(UnclusteredTransformer)) {
        map.addLayer({
          id: UnclusteredTransformer,
          type: "symbol",
          source: TransformerSourceId,
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

      img.src = svgUrl;
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  const handlePointerDown = () => setIsPointerDown(true);
  const handlePointerUp = () => setIsPointerDown(false);



  return (
    <mapContext.Provider value={{ mapRef, isMapReady }}>
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        ref={mapContainer}
        className={`w-full  h-full relative ${className} ${isPointerDown ? "cursor-grabbing " : "cursor-grab"}`}
      >
        <div className="absolute  inset-0 pointer-events-none z-10">
          {children}
        </div>
        <LayerFilterGroup />
      </div>
    </mapContext.Provider>
  );
};

export default MapProvider;

export const useMap = () => {
  const context = useContext(mapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
