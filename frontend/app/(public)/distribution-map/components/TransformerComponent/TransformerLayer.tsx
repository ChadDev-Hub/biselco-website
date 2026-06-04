"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import Icon from "ol/style/Icon";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import { Zap } from "lucide-react";
import { Transformers } from "@/types/transformer";
import { renderToStaticMarkup } from "react-dom/server";
type Props = {
  mapRef: Map | null;
  data: Transformers | undefined;
};

const batteryIconUrl = (fill: string = "gray") => {
  const markup = renderToStaticMarkup(
    <Zap className="text-white" size={20}  strokeWidth={2}  />,
  );

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
  width="24"
  height="24">
      ${markup}
    </svg>
  `;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

const createSingleStyle = (geometry, color:string) =>
  new Style({
    geometry,
    image: new Icon({
      src: batteryIconUrl(),
      scale: 1,
      anchor: [0.5, 0.5],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
    }),
  });

const createClusterStyle = (size: number) =>
  new Style({
    image: new CircleStyle({
      radius: 18,
      fill: new Fill({
        color: "rgba(0, 123, 255, 0.85)",
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 2,
      }),
    }),
    text: new Text({
      text: String(size),
      fill: new Fill({ color: "#fff" }),
      font: "bold 12px sans-serif",
    }),
  });

export default function DistributionTransformer({ mapRef, data }: Props) {
  const sourceRef = useRef<VectorSource | null>(null);
  const clusterRef = useRef<Cluster | null>(null);
  const layerRef = useRef<VectorLayer | null>(null);

  useEffect(() => {
    if (!mapRef || !data) return;

    const format = new GeoJSON();

    const features = format.readFeatures(data, {
      featureProjection: "EPSG:3857",
      dataProjection: "EPSG:4326",
    });

    // cleanup old layer first (important)
    if (layerRef.current) {
      mapRef.removeLayer(layerRef.current);
    }

    // reuse or create source
    if (!sourceRef.current) {
      sourceRef.current = new VectorSource();
    }
    sourceRef.current.clear();
    sourceRef.current.addFeatures(features);

    // reuse or create cluster
    if (!clusterRef.current) {
      clusterRef.current = new Cluster({
        distance: 100,
        source: sourceRef.current,
      });
    }

    const clusterSource = clusterRef.current;

    const layer = new VectorLayer({
      source: clusterSource,
      style: (feature) => {
        const clusteredFeatures = feature.get("features") as Feature[];
        const size = clusteredFeatures.length;

        if (size === 1) {
          const original = clusteredFeatures[0];
          const props = original.getProperties();
          const geom = original.getGeometry();
          return createSingleStyle(geom);
        }

        return createClusterStyle(size);
      },
    });

    layerRef.current = layer;
    mapRef.addLayer(layer);

    return () => {
      if (layerRef.current) {
        mapRef.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [mapRef, data]);

  return null;
}
