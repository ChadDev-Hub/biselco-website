"use client";
import { useEffect, useState } from "react";
import { Offices, OfficesProps } from "@/types/offices";
import { useMap } from "../../../distribution-map/components/MapProvider";
import { Building2} from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LayerProps,
  Layer,
  Source,
  SourceProps,
  Popup,
} from "react-map-gl/maplibre";
import { PopupInfo } from "../../../distribution-map/components/MapProvider";
import BiselcoOfficesPopup from "./biselcoOfficesPopup";

type Props = {
  initialData: Offices;
};

const BiselcoOffices = ({ initialData }: Props) => {
  const [popupInfo, setPopupInfo] = useState<PopupInfo<OfficesProps> | null>(
    null,
  );
  const { mapRef, setasInteractiveLayers, selectedFeature } = useMap();
  const iconId = "biselcoOfficesIcon";

  const sourceId = "biselcoOffices";
  const layerId = "biselcoOfficesLayer";

  // SELECTED FEATURE FOR POPUP
  useEffect(() => {
    const showPopup = () => {
      if (!selectedFeature) return;
      if (selectedFeature.layer.id !== layerId) return;
      if (selectedFeature.geometry.type !== "Point") return;
      const info = selectedFeature.properties as OfficesProps;
      setPopupInfo({ coordinates: selectedFeature.geometry.coordinates, info });
    };
    showPopup();
  }, [selectedFeature]);

  // SET ICON
  useEffect(() => {
    if (!mapRef?.current) return;
    const map = mapRef.current;
    const icon = renderToStaticMarkup(
      <svg
        
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <circle
          cx="13"
          cy="13"
          r="12"
          fill="white"
          stroke="blue"
          strokeWidth="1"
        />
        <g transform="translate(4, 4)">
          <Building2 size={18} color="blue" strokeWidth={2} />
        </g>
      </svg>,
    );
    const OfficeImage = new Image();

    const svgUrl =
      `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(icon);
    OfficeImage.onload = () => {
      if (!map.hasImage(iconId)) {
        map.addImage(iconId, OfficeImage);
      }
    };

    OfficeImage.onerror = () => {
      console.error("Failed to load transformer SVG icon.");
    };
    OfficeImage.src = svgUrl;
    return () => {
      OfficeImage.onload = null;
      OfficeImage.onerror = null;
    };
  }, [mapRef]);

  // set interactivity
  useEffect(() => {
    const setInteractivity = () => {
      setasInteractiveLayers((prev) => [...prev, layerId]);
    };
    setInteractivity();
    return () =>
      setasInteractiveLayers((prev) => prev.filter((id) => id !== layerId));
  }, [setasInteractiveLayers]);

  const source: SourceProps = {
    type: "geojson",
    data: initialData,
  };

  const layer: LayerProps = {
    id: layerId,
    type: "symbol",
    source: sourceId,
    layout: {
      "icon-image": iconId,
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  };

  return (
    <>
      <Source id={sourceId} {...source}>
        <Layer {...layer} />
      </Source>
      {popupInfo && (
        <Popup
          closeButton={false}
          longitude={popupInfo.coordinates[0]}
          latitude={popupInfo.coordinates[1]}
          onClose={() => setPopupInfo(null)}
        >
          <BiselcoOfficesPopup properties={popupInfo.info} />
        </Popup>
      )}
    </>
  );
};

export default BiselcoOffices;
