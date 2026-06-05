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
};
type MapContextType = React.RefObject<Maplibregl.Map | null> | null;
const mapContext = createContext<MapContextType>(null);

const MapProvider = ({ children }: Props) => {
  const [isPointerDown, setIsPointerDown] = useState(false);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      mapRef.current = new Maplibregl.Map({
        container: mapContainer.current,
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
    <mapContext.Provider value={mapRef}>
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        ref={mapContainer}
        className={`w-full  h-full relative ${isPointerDown ? "cursor-grabbing " : "cursor-grab"}`}
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
