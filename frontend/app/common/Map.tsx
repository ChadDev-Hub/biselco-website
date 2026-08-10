"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { renderToStaticMarkup } from "react-dom/server";
import {MapPin} from "lucide-react"
type Props = {
  onSelectLocation?: (lat: number | undefined, lon: number | undefined) => void;
  consumermeters?: [number, number];
  markerSvg?: React.ReactElement;
  markerPopup?: string;
  animatePing?: boolean;
  disableClick?: boolean;
  markerLabel?: string;
};

const defaultSvg = <MapPin className="size-6 text-blue-600 fill-blue-300"/>;


export default function BiselcoMap({
  onSelectLocation,
  markerSvg,
  markerPopup,
  consumermeters,
  disableClick = false,
  markerLabel,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const onSelectLocationRef = useRef(onSelectLocation);
  const markerSvgRef = useRef<React.ReactElement | null>(markerSvg);
  const markerPopupRef = useRef(markerPopup);
  const disableClickRef = useRef(disableClick);
  const markerdivRef = useRef<HTMLDivElement | null>(null);
  
  // INIT MAP
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      attributionControl: false,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [120.2043, 11.9986],
      zoom: 9,
    });

    mapRef.current = map;

    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.addControl(geolocate);

    // Popup
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
    });

    popupRef.current = popup;

    if (!disableClickRef.current) {
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        if (!markerRef.current) {
          const el = document.createElement("div");
          el.innerHTML = `
          <div style="transform: translate(-50%, -100%)">
            ${markerSvgRef.current ? renderToStaticMarkup(markerSvgRef.current) : renderToStaticMarkup(defaultSvg)}
          </div>
        `;
          markerRef.current = new maplibregl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map);
        } else {
          markerRef.current.setLngLat([lng, lat]);
        }
        if (markerPopupRef.current) {
          popup
            .setLngLat([lng, lat])
            .setHTML(markerPopupRef.current ?? "")
            .addTo(map);
        }

        onSelectLocationRef.current?.(lat, lng);

        map.flyTo({
          center: [lng, lat],
          zoom: 16,
          duration: 600,
        });
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }
    // CLICK MAP → DROP MARKER
  }, []);

  // UPAGE ON SELECT LOCATION
  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
  }, [onSelectLocation]);

  // UPDATE MARKER SVG
  useEffect(() => {
    markerSvgRef.current = markerSvg;
  }, [markerSvg]);

  // UPDATE MARKER POPUP
  useEffect(() => {
    markerPopupRef.current = markerPopup;
  }, [markerPopup]);

  // consumermeters marker update
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (!consumermeters) {
      markerRef.current?.remove();
      markerRef.current = null;

      popupRef.current?.remove();

      map.flyTo({
        center: [120.2043, 11.9986],
        zoom: 9,
        duration: 300,
      });

      return;
    }

    markerRef.current?.remove();

    const markerElement = markerdivRef.current;
    if (!markerElement) return;
    markerElement.innerHTML = markerSvg
      ? renderToStaticMarkup(markerSvg)
      : renderToStaticMarkup(defaultSvg);
    if (markerLabel) {
      const textElement = document.createElement("p");
      textElement.className = "text-[10px] italic text-gray-700 text-shadow-white text-shadow-md";
      textElement.textContent = markerLabel;
      markerElement.appendChild(textElement);
    }

    markerRef.current = new maplibregl.Marker({
      element: markerElement,
      anchor: "center",
    })
      .setLngLat(consumermeters)
      .addTo(map);

    popupRef.current?.setLngLat(consumermeters).addTo(map);

    map.flyTo({
      center: consumermeters,
      zoom: 16,
      duration: 300,
    });
  }, [consumermeters, markerSvg, markerLabel]);

  return (
    <div className="relative w-full h-64 rounded-lg">
      <div ref={mapContainer} className="w-full h-full" />
      <div
        ref={markerdivRef}
        className="flex flex-col items-center justify-center"
      ></div>
    </div>
  );
}
