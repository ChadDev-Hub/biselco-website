"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { renderToStaticMarkup } from "react-dom/server";


type Props = {
  onSelectLocation?: (lat: number | undefined, lon: number | undefined) => void;
  consumermeters?: [number, number];
  coordinates?: [number, number];
  markerSvg?: React.ReactNode;
  markerPopup?: string;
  animatePing?: boolean;
};

const defaultSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="red">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  <circle cx="12" cy="9" r="2.5" fill="white"/>
</svg>
`;

export default function BiselcoMap({
  onSelectLocation,
  markerSvg,
  markerPopup,
  consumermeters,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

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

    // CLICK MAP → DROP MARKER
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      if (!markerRef.current) {
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="transform: translate(-50%, -100%)">
            ${renderToStaticMarkup(defaultSvg)}
          </div>
        `;

        markerRef.current = new maplibregl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([lng, lat]);
      }
      if (markerPopup) {
        popup
          .setLngLat([lng, lat])
          .setHTML(markerPopup ?? "")
          .addTo(map);
      }

      onSelectLocation?.(lat, lng);

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
  }, []);

  // consumermeters marker update
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    if (consumermeters) {
      if (markerRef.current) {
        markerRef.current.setLngLat(consumermeters);
      } else {
        const el = document.createElement("div");
        el.innerHTML = markerSvg ? renderToStaticMarkup(markerSvg) : defaultSvg;

        markerRef.current = new maplibregl.Marker(el)
          .setLngLat(consumermeters)
          .addTo(map);
      }

      popupRef.current?.setLngLat(consumermeters).addTo(map);

      map.flyTo({
        center: consumermeters,
        zoom: 16,
        duration: 300,
      });
    }else{
      markerRef.current?.remove();
      markerRef.current = null;
      popupRef.current?.remove();
      map.flyTo({
        center: [120.2043, 11.9986],
        zoom: 9,
        duration: 300,
      });
    }
  }, [consumermeters, markerSvg]);
  // console.log(consumermeters)
  // GEOLOCATION (tracking)

  return (
    <div className="relative w-full h-64 rounded-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
