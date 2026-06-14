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




type Props = {
  children: ReactNode;
  className?: string;
};
type MapContextType = {
  mapRef: React.RefObject<Maplibregl.Map | null> | null,
  isMapReady: boolean
  };
const mapContext = createContext<MapContextType>({ mapRef: null, isMapReady: false });

const MapProvider = ({ children, className }: Props) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Maplibregl.Map | null>(null);
  const [isMapReady, setMapReady] = useState(false);
  

  useEffect(() => {
    if (mapContainer.current) {
      mapRef.current = new Maplibregl.Map({
        container: mapContainer.current,
        attributionControl: false,
        hash: true,
        style: "https://tiles.openfreemap.org/styles/bright",
        center: [120.2043, 11.9986],
        zoom: 10,
      });
      
      mapRef.current.addControl(
        new Maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "top-left",
      );
      mapRef.current.addControl(new Maplibregl.NavigationControl(), "bottom-right");
      mapRef.current.on("load", () => {
        setMapReady(true);
      });
    }
    
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
    <mapContext.Provider value={{mapRef, isMapReady}}>
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        ref={mapContainer}
        className={`w-full  h-full relative ${className} ${isPointerDown ? "cursor-grabbing " : "cursor-grab"}`}
      >
        <div className="absolute  inset-0 pointer-events-none z-10">
          {children}
        </div>
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
