"use client";
import { useEffect, useState } from "react";
import type { PrimaryLines, PrimaryLineProperties} from "@/types/primary-line";
import { Layer, Source, LayerProps, Popup } from "react-map-gl/maplibre";

import { useMap } from "../MapProvider";
import type { PopupInfo } from "../MapProvider";
import PrimaryLinePopup from "../PrimaryLineComponent/PrimaryLinePopup";


type Props = {
  initialData: PrimaryLines;
};

const PrimaryLineLayer = ({ initialData }: Props) => {
  const primaryLineSourceId = "primary-lines";
  const { setasInteractiveLayers, selectedFeature, setSelectedFeature} = useMap();
  const primaryLineLayerId = "primary-lines-layer";
  const [popUpInfo, setPopupInfo] = useState<PopupInfo<PrimaryLineProperties> | null>(
    null,
  );
  const primaryLineLayer: LayerProps = {
    id: primaryLineLayerId,
    type: "line",
    source: primaryLineSourceId,
    
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
  };
  useEffect(() => {
    const setInteractivity = () => {
      setasInteractiveLayers((prev) => [...prev, primaryLineLayerId]);
    }
    setInteractivity();
    return () => {
      setasInteractiveLayers((prev) => prev.filter((id) => id !== primaryLineLayerId));
    };
  }, [setasInteractiveLayers]);

  useEffect(() => {
    const ShowPopup = () => {
      if (!selectedFeature) return;
      if (selectedFeature.layer.id !== primaryLineLayerId) return;
      const geometry = selectedFeature.geometry;
      if (geometry.type !== "LineString") return;
      const coordinates = geometry.coordinates;
      const midPoint = [
        (coordinates[0][0] + coordinates[1][0]) / 2,
        (coordinates[0][1] + coordinates[1][1]) / 2,
      ];
      setPopupInfo({
        coordinates: midPoint,
        info: selectedFeature.properties as PrimaryLineProperties,
      });
      
    };
    ShowPopup();
  }, [selectedFeature]);


  const handleClosePopup = () => {
    setPopupInfo(null);
    setSelectedFeature(null);
  }
  
  return (
    <>
      <Source id={primaryLineSourceId} promoteId="id" type="geojson" data={initialData ?? ""}>
        <Layer {...primaryLineLayer} />
      </Source>
      {popUpInfo && (
        <Popup
          closeButton={false}
          longitude={popUpInfo.coordinates[0]}
          latitude={popUpInfo.coordinates[1]}
          onClose={() => handleClosePopup()}
        >
          <PrimaryLinePopup primaryLinePopup={popUpInfo.info} />
        </Popup>
      )}
    </>
  );
};

export default PrimaryLineLayer;
