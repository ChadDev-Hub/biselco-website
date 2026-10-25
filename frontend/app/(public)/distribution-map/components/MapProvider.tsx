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
} from "react";
import Map, {
  type MapRef,
  MapMouseEvent,
  MapGeoJSONFeature,
} from "react-map-gl/maplibre";

export type PopupInfo<T> = {
  coordinates: number[];
  info: T;
};


type Props = {
  children: ReactNode;
  className?: string;
};
type MapContextType = {
  isMapReady: boolean;
  mapRef: React.RefObject<MapRef | null> | null;
  setasInteractiveLayers: Dispatch<SetStateAction<string[]>>;
  selectedFeature: MapGeoJSONFeature | null;
};
const mapContext = createContext<MapContextType>({
  isMapReady: false,
  mapRef: null,
  setasInteractiveLayers: () => {},
  selectedFeature: null,
});

const MapProvider = ({ children }: Props) => {
  const [interactiveLayers, setasInteractiveLayers] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] =
    useState<MapGeoJSONFeature | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [cursor, setCursor] = useState<string>("auto");
  const mapRef = useRef<MapRef | null>(null);

  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);
  const onMouseClick = useCallback((e: MapMouseEvent) => {
    const features = mapRef.current?.queryRenderedFeatures(e.point);
    if (!features?.length) return;
    const feature = features[0];
    setSelectedFeature(feature);
  }, []);

  // useEffect(() => {
  //   if (!mapContainer.current) return;
  //   const map = new Maplibregl.Map({
  //     container: mapContainer.current,
  //     attributionControl: false,
  //     style: "https://tiles.openfreemap.org/styles/bright",
  //     center: [120.2043, 11.9986],
  //     zoom: 10,
  //   });
  //   mapRef.current = map;
  //   const geolocation = new Maplibregl.GeolocateControl({
  //     positionOptions: {
  //       enableHighAccuracy: true,
  //     },
  //     trackUserLocation: true,
  //     showAccuracyCircle: true,
  //   });
  //   map.addControl(geolocation, "top-left");
  //   map.addControl(new Maplibregl.NavigationControl(), "bottom-right");

  //   map.on("load", () => {
  //     // ADD PRIMARY LINE SOURCE
  //     if (!map.getSource(PrimaryLineSourceId)) {
  //       map.addSource(PrimaryLineSourceId, {
  //         type: "geojson",
  //         promoteId: "primary_line_id",
  //         data: {
  //           type: "FeatureCollection",
  //           features: [],
  //         },
  //       });
  //     }

  //     // ADD PRIMARY LINE LAYER
  //     if (!map.getLayer(PrimaryLineLayerId)) {
  //       map.addLayer({
  //         id: PrimaryLineLayerId,
  //         type: "line",
  //         source: PrimaryLineSourceId,
  //         layout: {
  //           "line-join": "round",
  //           "line-cap": "round",
  //         },
  //         paint: {
  //           "line-color": [
  //             "case",
  //             ["boolean", ["feature-state", "selected"], false],
  //             "#70e000",
  //             ["get", "color"],
  //           ],
  //           "line-width": 2,
  //         },
  //       });
  //     }

  //

  //     const svgUrl =
  //       `data:image/svg+xml;charset=utf-8,` +
  //       encodeURIComponent(transformerSvg);

  //     const img = new Image();

  //     img.onload = () => {
  //       console.log("CUSTOM MARKER LOADED");

  //       // Add image
  //       if (!map.hasImage("custom-marker")) {
  //         map.addImage("custom-marker", img);
  //       }
  //     };

  //     // ADD TRANSFORMER SOURCE
  //     if (!map.getSource(TransformerSourceId)) {
  //       map.addSource(TransformerSourceId, {
  //         cluster: true,
  //         type: "geojson",
  //         data: {
  //           type: "FeatureCollection",
  //           features: [],
  //         },
  //       });
  //     }
  //     // TRANSFORMER LAYER
  //     if (!map.getLayer(TransformerLayerId)) {
  //       map.addLayer({
  //         id: TransformerLayerId,
  //         type: "symbol",
  //         source: TransformerSourceId,
  //         filter: ["has", "point_count"],
  //         layout: {
  //           "icon-image": "custom-marker",
  //           "icon-offset": [3, 2.5],
  //           "icon-allow-overlap": true,
  //           "icon-size": 1,
  //           "text-field": ["get", "transformer_id"],
  //           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
  //           "text-size": 7,
  //           "text-anchor": "top",
  //           "text-offset": [0, 2],
  //         },
  //         paint: {
  //           "text-color": "black",
  //         },
  //       });
  //     }

  //     // ADD CLUSTER COUNT LAYER
  //     if (!map.getLayer(TransformerClusterCount)) {
  //       map.addLayer({
  //         id: TransformerClusterCount,
  //         type: "symbol",
  //         source: TransformerSourceId,
  //         layout: {
  //           "text-field": "{point_count_abbreviated}",
  //           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
  //           "text-size": 12,
  //         },
  //         paint: {
  //           "text-color": "black",
  //         },
  //       });
  //     }

  //     //  PING LAYER
  //     // ADD PING UNCLUSTER LAYER
  //     if (!map.getLayer(TransformerPing)) {
  //       map.addLayer({
  //         id: TransformerPing,
  //         type: "circle",
  //         source: TransformerSourceId,
  //         filter: ["!", ["has", "point_count"]],

  //         paint: {
  //           "circle-color": [
  //             "case",
  //             ["==", ["get", "is_active"], true],
  //             "#2A7C13",
  //             ["==", ["get", "is_active"], false],
  //             "red",
  //             "#2A7C13",
  //           ],
  //           "circle-radius": 11,
  //           "circle-opacity": 0.8,
  //           "circle-stroke-width": 0.5,
  //           "circle-stroke-opacity": 1,
  //         },
  //       });
  //     }

  //     // TRANSFORMER LAYER

  //     // ADD UNLUSTERED LAYER
  //     if (!map.getLayer(UnclusteredTransformer)) {
  //       map.addLayer({
  //         id: UnclusteredTransformer,
  //         type: "symbol",
  //         source: TransformerSourceId,
  //         filter: ["!", ["has", "point_count"]],

  //         layout: {
  //           "icon-image": "custom-marker",
  //           "icon-offset": [3, 2.5],
  //           "icon-allow-overlap": true,
  //           "icon-size": 1,
  //           "text-field": ["get", "transformer_id"],
  //           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
  //           "text-size": 7,
  //           "text-anchor": "top",
  //           "text-offset": [0, 2],
  //         },
  //         paint: {
  //           "text-color": "black",
  //         },
  //       });
  //     }

  //     img.src = svgUrl;
  //     setMapReady(true);
  //   });

  //   return () => {
  //     if (mapRef.current) {
  //       mapRef.current.remove();
  //       mapRef.current = null;
  //     }
  //   };
  // }, []);
  // const handlePointerDown = () => setIsPointerDown(true);
  // const handlePointerUp = () => setIsPointerDown(false);
  const handleReady = () => setIsMapReady(true);

  return (
    <mapContext.Provider
      value={{ isMapReady, mapRef, setasInteractiveLayers, selectedFeature }}
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
        >
          {children}
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
