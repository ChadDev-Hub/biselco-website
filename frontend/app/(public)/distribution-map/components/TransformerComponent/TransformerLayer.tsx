"use client";

import { useEffect, use } from "react";
import { useMap } from "../MapProvider";
import { PromiseType } from "../../../../../types/promise";
import { Transformers } from "@/types/transformer";

type Props = {
  promise: Promise<PromiseType<Transformers>>;
};

const TransformerLayer = ({ promise }: Props) => {
  const data = use(promise);
  const {mapRef, isMapReady }= useMap();

  useEffect(() => {
    if(!isMapReady) return;
    const map = mapRef?.current;
    if (!map || !data?.data) return;

    const sourceId = "transformers";
    const layerId = "transformers-layer";
    const unclusteredId = "transformers-unclustered";
    const clusterCountId = "transformers-cluster-count";

    const setup =  async () => {
      if (!map) return;
      if (!data.data) return;
      if (!map.hasImage("custom-marker")) {
        const image = await map.loadImage("/icons/transformer.png");
        map.addImage("custom-marker", image.data);
      }

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          cluster: true,
          type: "geojson",
          data: data.data,
        });
      }
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });
      }
      if (!map.getLayer(clusterCountId)) {
        map.addLayer({
          id: clusterCountId,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#fff",
          },
        });
      }

      if (!map.getLayer(unclusteredId)) {
        map.addLayer({
          id: unclusteredId,
          type: "symbol",
          source: sourceId,
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "custom-marker",
            "icon-allow-overlap": false,
            "icon-size": 0.05,
          },
        });
      }
    };



    const attachEvents = () => {
    if(!map.getLayer(layerId)) return;
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("mouseenter", layerId, handleMouseEnter);
    map.on("mouseleave", layerId, handleMouseLeave);

    }
    const run = async() => {
      await setup();
      attachEvents();
    }

    if (map.isStyleLoaded()){
      run();
    }else{
      map.once("load", run);
    }
    

    return () => {
      if (map && map.getStyle()) {
        map.removeLayer(layerId);
        map.removeLayer(unclusteredId);
        map.removeLayer(clusterCountId);
        map.removeSource(sourceId);
      }
    };
  }, [data, mapRef, isMapReady]);
  return null;
};

export default TransformerLayer;
