"use client";
import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Feature from 'ol/Feature';
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Overlay from "ol/Overlay";
import Map from "ol/Map";


type Props = {
    mapRef: Map | null;
    popupRef: React.RefObject<HTMLDivElement | null>;
    primaryLineData?: PrimaryLines;
    setPrimaryLinePopup: React.Dispatch<React.SetStateAction<PrimaryLineProperties>>
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
}

const PrimaryLineLayer = ({ mapRef, popupRef, primaryLineData, setPrimaryLinePopup }: Props) => {
  const popupOverlay = useRef<Overlay | null>(null);
  const lastFeature = useRef<Feature>(null);
  const primaryLine = useRef<VectorSource | null>(null);

  useEffect(() => {
    if (!popupRef.current) return;
    if (!mapRef || !primaryLineData) return;
    const format = new GeoJSON();
    const map = mapRef;
    // OVERLAY
    const primaryLineOverlay = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -50],
    });

    popupOverlay.current = primaryLineOverlay;

    primaryLine.current = new VectorSource({
      features: format.readFeatures(primaryLineData, {
        featureProjection: "EPSG:3857",
      }),
    });

    const PrimaryLineLayer = new VectorLayer({
      source: primaryLine.current,
      style: (feature) => {
        const selected = feature.get("selected");
        return new Style({
          stroke: new Stroke({
            color: selected ? "yellow" : feature.get("color"),
            width: 2.5,
          }),
        });
      },
    });

    map.addLayer(PrimaryLineLayer);
    map.addOverlay(primaryLineOverlay);
    // Initialize Map

    const handlePointerMove = (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      if (hit) {
        map.getTargetElement().style.cursor = "pointer";
      } else {
        map.getTargetElement().style.cursor = "";
      }
    };
    const handleShowPrimaryLinePopup = (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f) as Feature;
      if (!feature) {
        lastFeature.current?.set("selected", false);
        lastFeature.current = null;
        primaryLineOverlay.setPosition(undefined);
        return;
      }
      lastFeature.current?.set("selected", false);
      feature.set("selected", true);
      lastFeature.current = feature;
      const props = feature.getProperties();
      if (popupRef.current) {
        setPrimaryLinePopup({
          primary_line_id: props.primary_line_id,
          village: props.village,
          municipality: props.municipality,
          color: props.color,
          length_meters: props.length_meters,
          phasing: props.phasing,
          is_active: props.is_active,
        });
      }
      primaryLineOverlay.setPosition(evt.coordinate);
    };

    map.on("pointermove", handlePointerMove);
    map.on("singleclick", handleShowPrimaryLinePopup);
    return () => {
      map.un("pointermove", handlePointerMove);
      map.un("singleclick", handleShowPrimaryLinePopup);
    };
  }, [mapRef, popupRef, primaryLineData, setPrimaryLinePopup]);

  return null;
};

export default PrimaryLineLayer;
