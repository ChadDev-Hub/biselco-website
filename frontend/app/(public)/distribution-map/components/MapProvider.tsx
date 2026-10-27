"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import Map, {
  type MapRef,
  MapMouseEvent,
  MapGeoJSONFeature,
  Marker,
} from "react-map-gl/maplibre";

export type PopupInfo<T> = {
  coordinates: number[];
  info: T;
};

type Props = {
  children?: ReactNode;
  onPin?: (lat: number, lon: number) => void;
  pinLocation?: {
    lat?: number;
    lon?: number;
    defaultIcon?: React.ReactNode;
  };

};
type MapContextType = {
  isMapReady: boolean;
  mapRef: React.RefObject<MapRef | null> | null;
  setasInteractiveLayers: Dispatch<SetStateAction<string[]>>;
  selectedFeature: MapGeoJSONFeature | null;
  setSelectedFeature: Dispatch<SetStateAction<MapGeoJSONFeature | null>>;
};
const mapContext = createContext<MapContextType>({
  isMapReady: false,
  mapRef: null,
  setasInteractiveLayers: () => {},
  selectedFeature: null,
  setSelectedFeature: () => {},
});

const MapProvider = ({ children, onPin, pinLocation }: Props) => {
  const [interactiveLayers, setasInteractiveLayers] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] =
    useState<MapGeoJSONFeature | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [cursor, setCursor] = useState<string>("auto");
  const mapRef = useRef<MapRef | null>(null);

  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  const changeColoronClick = (
    SourceId: string,
    id: string | number | undefined,
    selected: boolean,
  ) => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getStyle().sources[SourceId];
    if (source.type === "vector") return;

    if (!SourceId || !id) return;
    map.setFeatureState({ source: SourceId, id: id }, { selected: selected });
  };

  // CLICK EVENTS
  const selectFeature = (e: MapMouseEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(e.point);
    if (!features?.length) return;
    const feature = features[0];
    setSelectedFeature(feature);
  };

  const onMouseClick = useCallback(
    (e: MapMouseEvent) => {
      selectFeature(e);
      if (!onPin) return;
      const { lat, lng } = e.lngLat;
      onPin(lat, lng);
    },
    [onPin],
  );

  // EFFECT THAT LISTEN IF THERE A DEFAULT PIN
  useEffect(() => {
    if (!isMapReady || !pinLocation) return;

    const map = mapRef.current;
    if (!map) return;

    const { lat, lon } = pinLocation;

    if (lat == null || lon == null) return;

    map.jumpTo(
      {
        center: [lon, lat],
        zoom: 16,
      },
      {
        duration: 1000,
        easing: (t: number) => t,
        
      },
    );
  }, [pinLocation, isMapReady]);

  // EFFECT ON SELECTED FEATURE
  useEffect(() => {
    if (!selectedFeature) return;
    // FOR PRIMARY LINE LAYER
    changeColoronClick(selectedFeature?.source, selectedFeature?.id, true);
    return () => {
      changeColoronClick(selectedFeature?.source, selectedFeature?.id, false);
    };
  }, [selectedFeature]);

  const handleReady = () => setIsMapReady(true);

  return (
    <mapContext.Provider
      value={{
        isMapReady,
        mapRef,
        setasInteractiveLayers,
        selectedFeature,
        setSelectedFeature,
      }}
    > 
   
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 120.2043,
          latitude: 11.9986,
          zoom: 11,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
        onLoad={handleReady}
        interactiveLayerIds={[...interactiveLayers]}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        cursor={cursor}
        onClick={onMouseClick}
        attributionControl={false}
      >
        {children}
        {pinLocation && (
          <Marker
            key="pin"
            style={{ cursor: "pointer", scale: 0.7 }}
            longitude={pinLocation.lon ?? 0}
            latitude={pinLocation.lat ?? 0}
            anchor="bottom"
            color="red"
          >
            {pinLocation.defaultIcon}
          </Marker>
        )}
      </Map>

   
      
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
