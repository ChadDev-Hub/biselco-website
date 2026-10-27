"use client";

import { useEffect, useState } from "react";
import { Transformers, TransformerProperties } from "@/types/transformer";
import { Layer, Source, LayerProps, Popup } from "react-map-gl/maplibre";
import { useMap } from "../MapProvider";
import { Coordinates } from "../../../../../types/consumer-meter";
import TransformerPopup from "./transformerPopup";
import type { PopupInfo } from "../MapProvider";

type Props = {
  initialData: Transformers;
};

const TransformerLayer = ({ initialData }: Props) => {
  const [popupInfo, setPopupInfo] =
    useState<PopupInfo<TransformerProperties> | null>(null);
  const { setasInteractiveLayers, selectedFeature, mapRef } = useMap();
  const transformerSourceId = "transformers";
  const clusteredtransformerLayerId = "transformers-clustered";
  const transformerClusterCountId = "transformers-cluster-count";
  const unclusteredtransformerLayerId = "transformers-unclustered";
  const unclusteredTransformerPing = `${unclusteredtransformerLayerId}-ping`;
  // ADD IMAGE WHEN MAP IS READY
  useEffect(() => {
    const map = mapRef?.current;
    if (!map) return;
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
    const transformerImage = new Image();
    const svgUrl =
      `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(transformerSvg);
    transformerImage.onload = () => {
      if (!map.hasImage("transformer")) {
        map.addImage("transformer", transformerImage);
      }
    };

    transformerImage.onerror = () => {
      console.error("Failed to load transformer SVG icon.");
    };

    transformerImage.src = svgUrl;

    return () => {
      transformerImage.onload = null;
      transformerImage.onerror = null;
    };
  }, [mapRef]);

  // CLUSTERED TRANSFORMER LAYER
  const clusterLayer: LayerProps = {
    id: clusteredtransformerLayerId,
    type: "symbol",
    source: transformerSourceId,
    filter: ["has", "point_count"],
    layout: {
      "icon-image": "transformer",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      "icon-offset": [3, 2.5],
    },
  };

  const clusterCountLayer: LayerProps = {
    id: transformerClusterCountId,
    type: "symbol",
    source: transformerSourceId,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  };

  const unclusteredPingLayer: LayerProps = {
    id: unclusteredTransformerPing,
    type: "circle",
    source: transformerSourceId,
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
      "circle-radius": 12,
      "circle-opacity": 0.8,
      "circle-stroke-width": 0.5,
      "circle-stroke-opacity": 1,
    },
  };

  const unclusteredLayer: LayerProps = {
    id: unclusteredtransformerLayerId,
    type: "symbol",
    source: transformerSourceId,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": "transformer",
      "icon-allow-overlap": true,
      "icon-offset": [3, 2.5],
    },
  };

  // SET AS INTERACTIVE
  useEffect(() => {
    const setASInteractive = () => {
      setasInteractiveLayers((prev) => [
        ...prev,
        unclusteredtransformerLayerId,
      ]);
    };
    setASInteractive();
    return () => {
      setasInteractiveLayers((prev) => prev.filter((id) => id !== unclusteredtransformerLayerId));
    };
  }, [setasInteractiveLayers]);

  // POPUP EFFECT
  useEffect(() => {
    const ShowPopup = () => {
      if (!selectedFeature) return;
      if (selectedFeature.layer.id !== unclusteredtransformerLayerId) return;
      const geometry = selectedFeature.geometry;
      if (geometry.type !== "Point") return;
      const coordinates = geometry.coordinates as Coordinates;
      const info = selectedFeature.properties as TransformerProperties;
      setPopupInfo({ coordinates, info });
    };
    ShowPopup();
  }, [selectedFeature]);

  // PING ANIMATION

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map) return;
    let animationFrame: number;
    let start: number | null = null;
    const animation = (timestamp: number) => {
      if (start === null) start = timestamp;
      const duration = 1000;
      const progress = ((timestamp - start) % duration) / duration;
      const radius = 8 + progress * 4;
      const opacity = 0.8 * (1 - progress);
      if (map.getLayer(unclusteredTransformerPing)) {
        map.setPaintProperty(
          unclusteredTransformerPing,
          "circle-radius",
          radius,
        );
        map.setPaintProperty(
          unclusteredTransformerPing,
          "circle-opacity",
          opacity,
        );
      }
      animationFrame = requestAnimationFrame(animation);
    };
    animationFrame = requestAnimationFrame(animation);
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [mapRef, unclusteredTransformerPing]);

  return (
    <>
      <Source
        id={transformerSourceId}
        promoteId="id"
        cluster
        type="geojson"
        data={initialData}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPingLayer} />
        <Layer {...unclusteredLayer} />
      </Source>
      {popupInfo && (
        <Popup
          closeButton={false}
          latitude={popupInfo.coordinates[1]}
          longitude={popupInfo.coordinates[0]}
          onClose={() => setPopupInfo(null)}
        >
          <TransformerPopup TransformerProperties={popupInfo.info} />
        </Popup>
      )}
    </>
  );
};

export default TransformerLayer;
