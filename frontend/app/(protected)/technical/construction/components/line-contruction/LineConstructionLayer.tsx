"use client";

import { Layer, LayerProps, Source, Popup } from "react-map-gl/maplibre";
import { useEffect } from "react";
import { useMap } from "@/app/context/MapProvider";
import { UtilityPole } from "lucide-react";
import {renderToStaticMarkup} from 'react-dom/server';
import { useAppSelector, useAppDispatch } from '../../../../../hook';
import {showPopUp} from './lineConstructionSlice';
import ConstructionLinePopupInfo from './lineConstructionPopupInfo';
const LineConstructionLayer = () => {
  const dispatch = useAppDispatch();
  const feature = useAppSelector((state) => state.lineConstruction.features);
  const center = useAppSelector((state) => state.lineConstruction.center);
  const popUpInfo = useAppSelector((state) => state.lineConstruction.popUpInfo);
  const layerId = "line-construction-layer";
  const linecircleId = "line-construction-circle-layer";
  const sourceId = "line-construction-source";
  const { setasInteractiveLayers, mapRef, selectedFeature } = useMap();

  
  const LineConstruction: LayerProps = {
    id: layerId,
    source: sourceId,
    type: "symbol",
    layout:{
        "icon-image": "pole",
        "icon-allow-overlap": true,
        "icon-offset": [0, 2]
    },
    paint: {
        "icon-opacity": 1
    }
  };

//   ANIMATED CIRCLE COLOR WHEN SELECTED
  const LineConstructionCircle:LayerProps = {
    id: linecircleId,
    source: sourceId,
    type: "circle",
    paint: {
      "circle-radius": 9,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#000000",
      "circle-color": [
        "case",
        ["boolean", ["get", "selected"], false],
        "#FFCD54",
        "#2391FF",
      ]
    },
    beforeId: layerId
  }

  useEffect(()=>{
    const map = mapRef?.current;
    if (!map) return;
    if(center.length === 0) return;
    map.flyTo({
      center: center as [number, number],
      zoom: 15
    })
  },[center, mapRef])

//   SET AS INTERACTIVE LAYER
  useEffect(() => {
    setasInteractiveLayers((prev) => [...prev, layerId]);
  }, [setasInteractiveLayers]);
  
  
  
  // ADD IMAGE SVG
  useEffect(() => {
    // this will add image to the map that will be used as icon
    const map = mapRef?.current;
    if (!map) return;
    const poleImage = new Image();
    const svg = renderToStaticMarkup(
      <UtilityPole size={12} color="black" strokeWidth={2} />,
    );

    const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    poleImage.onload = () => {
        if (!map.hasImage("pole")){
            map.addImage("pole", poleImage);
        }
    }

    poleImage.onerror = () => {
      console.error("Failed to load pole SVG icon.");
    };

    poleImage.src = uri;

    return () => {
        poleImage.onload = null;
        poleImage.onerror = null;
    };
  }, [mapRef]);
  

  // POPUP EFFECT 
  useEffect(()=>{
    if(!selectedFeature) return;
    if (selectedFeature.layer.id !== layerId) return;
    dispatch(showPopUp(selectedFeature.properties.id));
  },[selectedFeature, dispatch, layerId]);


  
  return (
    <>
    <Source 
    id={sourceId} 
    promoteId="id" 
    type="geojson"
    data={feature}
    >
      <Layer {...LineConstruction} />
      <Layer {...LineConstructionCircle} />
    </Source>
    {popUpInfo && (
      <Popup
        longitude={popUpInfo.geometry.type === "Point" ? popUpInfo.geometry.coordinates[0] : 0}
        latitude={popUpInfo.geometry.type === "Point" ? popUpInfo.geometry.coordinates[1] : 0}
        onClose={() => dispatch(showPopUp(null))}
      >
        <ConstructionLinePopupInfo data={popUpInfo.properties} />
        </Popup>
    )}
    </>
    
    
  );
};

export default LineConstructionLayer;
