"use client";

import { useRef, useEffect, useState, use } from "react";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { defaults as defaultControls } from "ol/control";

import PrimaryLinePopup from "./PrimaryLineComponent.tsx/PrimaryLinePopup";
import PrimaryLineLayer from "./PrimaryLineComponent.tsx/PrimaryLineLayer";
type PromiseType<T> = {
  status: number;
  error?: string;
  data?: T;
};

type PrimaryLines = {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: PrimaryLineProperties;
  }[];
};

type PrimaryLineProperties = {
  primary_line_id: string;
  village: string;
  municipality: string;
  color: string;
  is_active: boolean;
  length_meters: number;
  phasing: string;
};

type Props = {
  primaryLinePromise: Promise<PromiseType<PrimaryLines>>;
};

const DistributionMap = ({ primaryLinePromise }: Props) => {
  const [mapInstance, setMapInstances] = useState<Map | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<View | null>(null);
  const primaryLineData = use(primaryLinePromise);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const [primaryLinePopup, setPrimaryLinePopup] =
    useState<PrimaryLineProperties>({
      primary_line_id: "",
      village: "",
      municipality: "",
      color: "",
      is_active: false,
      length_meters: 0,
      phasing: "",
    });
  useEffect(() => {
    if ( !mapDivRef.current) return;

    // Initialize View
    viewRef.current = new View({
      center: fromLonLat([120.2043, 11.9986]),
      zoom: 10,
    });

    const initialMap = new Map({
      target: mapDivRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: defaultControls({
        attribution: false,
        zoom: false,
      }),
      view: viewRef.current,
    });
    const setInitialMap = async() =>  setMapInstances(initialMap);

    setInitialMap();
    return  () => {
        initialMap.setTarget(undefined);
    }
  }, []);

  //   HANDLE THE POINTER GRABBING
  const [isPointerDown, setIsPointerDown] = useState(false);
  const handlePointerDown = () => setIsPointerDown(true);
  const handlePointerUp = () => setIsPointerDown(false);
  return (
    <>
      <div
        ref={mapDivRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={`w-full h-96 min-h-screen  ${isPointerDown ? "cursor-grabbing" : "cursor-grab"}`}
      ></div>
      <PrimaryLineLayer
        primaryLineData={primaryLineData.data}
        mapRef={mapInstance}
        popupRef={popupRef}
        setPrimaryLinePopup={setPrimaryLinePopup}
      />
      {/* PRIMARY LINE POPUP */}
      <PrimaryLinePopup ref={popupRef} primaryLinePopup={primaryLinePopup} />
    </>
  );
};

export default DistributionMap;
