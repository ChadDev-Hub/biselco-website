'use client'

import React, { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import { Overlay } from 'ol'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Geolocation } from 'ol'
import { defaults as defaultControls } from 'ol/control'
import { renderToStaticMarkup } from 'react-dom/server'



type Props = {
    onSelectLocation?: (lat: number | undefined, lon: number | undefined) => void
    consumermeters?: [number, number]
    coordinates?: [number, number]
    markerSvg?: React.ReactNode;
    markerPopup?: string;
    animatePing?: boolean
}


const defaultSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="red">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
                `;

const BiselcoMap = ({ onSelectLocation, coordinates, markerSvg, markerPopup, animatePing, consumermeters }: Props) => {
    const mapRef = useRef<Map | null>(null)
    const mapDivRef = useRef<HTMLDivElement | null>(null)
    const markerSourceRef = useRef<VectorSource | null>(null)
    const onSelectLocationRef = useRef(onSelectLocation)
    const geoLocationRef = useRef<Geolocation | null>(null)
    const userSourceRef = useRef<VectorSource | null>(null)
    const PopupRef = useRef<HTMLDivElement>(null)
    const initialCoordinates = useRef<[number, number] | [] | null>(coordinates ?? null)
    const [tracking, setTracking] = useState(false)
    // Initialize the map
    useEffect(() => {
        if (!mapDivRef.current || mapRef.current) return

        // Create New Marker Source 
        markerSourceRef.current = new VectorSource()
        userSourceRef.current = new VectorSource()

        const usersvg = `
        <svg 
        height="25" 
        width="25" version="1.1" id="Capa_1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink"
         viewBox="0 0 53.545 53.545" 
         xml:space="preserve" 
         fill="#000000">
         <g id="SVGRepo_bgCarrier" 
         stroke-width="0">
         </g>
         <g id="SVGRepo_tracerCarrier" 
         stroke-linecap="round" stroke-linejoin="round">
         </g><g id="SVGRepo_iconCarrier"> 
         <g> <g> 
         <circle style="fill:#010002;" cx="26.686" cy="4.507" r="4.507">
         </circle> <path style="fill:#010002;" d="M28.256,11.163c-1.123-0.228-2.344-0.218-3.447,0.042c-7.493,0.878-9.926,9.551-9.239,16.164 c0.298,2.859,4.805,2.889,4.504,0c-0.25-2.41-0.143-6.047,1.138-8.632c0,3.142,0,6.284,0,9.425c0,0.111,0.011,0.215,0.016,0.322 c-0.003,0.051-0.015,0.094-0.015,0.146c0,7.479-0.013,14.955-0.322,22.428c-0.137,3.322,5.014,3.309,5.15,0 c0.242-5.857,0.303-11.717,0.317-17.578c0.244,0.016,0.488,0.016,0.732,0.002c0.015,5.861,0.074,11.721,0.314,17.576 c0.137,3.309,5.288,3.322,5.15,0c-0.309-7.473-0.32-14.949-0.32-22.428c0-0.232-0.031-0.443-0.078-0.646 c-0.007-3.247-0.131-6.497-0.093-9.742c1.534,2.597,1.674,6.558,1.408,9.125c-0.302,2.887,4.206,2.858,4.504,0 C38.678,20.617,36.128,11.719,28.256,11.163z">
         </path> 
         </g> 
         </g> 
         </g></svg>`

        // CREATE NEW LAYER AND ADDING THE SOURCE 
        // marker layer
        const markerLayer = new VectorLayer({
            source: markerSourceRef.current
        })

        // POPUP OVERLAY
        const overlay = new Overlay({
            element: PopupRef.current!,
            autoPan: true,
            offset: [-85, -50]

        })


        // CREATE NEW LAYER AND ADDING THE SOURCE
        // user layer
        const userLayer = new VectorLayer({
            source: userSourceRef.current,
            style: new Style({
                image: new Icon({
                    src: `data:image/svg+xml;utf8,${encodeURIComponent(usersvg)}`,
                    anchor: [0.5, 1],
                }),
            }),
        })

        // CONST INITIALIZE MAP VIEW
        const view = new View({
            center: fromLonLat([120.2043, 11.9986]),
            zoom: 9,
        })
        // CREATE NEW MAP AND ADDING the view and the layers 
        mapRef.current = new Map({
            target: mapDivRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                markerLayer,
                userLayer,
            ],
            controls: defaultControls({
                attribution: false,
                zoom: false,
                rotate: false,

            }),
            view: view,
        })
        mapRef.current.addOverlay(overlay)

        // CREATE A COMPLAINT MARKER IF COORDINATES IS AVAILABLE
        if (initialCoordinates.current) {
            markerSourceRef.current?.clear()
            markerSourceRef.current?.addFeature(
                new Feature({ geometry: new Point(fromLonLat(initialCoordinates.current)) })
            )
            onSelectLocationRef.current?.(initialCoordinates.current[1], initialCoordinates.current[0])
            overlay.setPosition(fromLonLat(initialCoordinates.current))
            mapRef.current?.getView().animate({
                center: fromLonLat(initialCoordinates.current),
                zoom: 16,
                duration: 500
            })
        }

        // CREATE AN ACTION ON THE MAP FOR Pointing on the specific location
        mapRef.current.on('singleclick', (evt) => {
            const coord = evt.coordinate
            const [lon, lat] = toLonLat(coord)
            markerSourceRef.current?.clear()
            markerSourceRef.current?.addFeature(
                new Feature({ geometry: new Point(coord) })
            )
            onSelectLocationRef.current?.(lat, lon)
            overlay.setPosition(coord)

            // Animate map to new location
            mapRef.current?.getView().animate({
                center: coord,
                zoom: 16,
                duration: 600
            })
        })



        // INTIALIZE NEW GEOLOCATION
        geoLocationRef.current = new Geolocation({
            trackingOptions: {
                enableHighAccuracy: true,
            },
            projection: view.getProjection(),
        })

        return () => {
            mapRef.current?.setTarget(undefined)
            mapRef.current = null
        }
    }, [])




    useEffect(() => {
        if (!mapRef.current || !consumermeters) {
            markerSourceRef.current?.clear()
            return
        };
        markerSourceRef.current?.clear()

        const svgString = markerSvg ? renderToStaticMarkup(markerSvg) : defaultSvg;
        // CREATE NEW ICON
        const icon = new Icon({
            src: `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`,
            anchor: [0.5, 1],
        });

        // CREATE NEW STYLE
        const style = new Style({
            image: icon,
        });

        const feature = new Feature({
            geometry: new Point(fromLonLat(consumermeters)),
            style: style
        })
        feature.setStyle(style)

        // Add New Marker
        markerSourceRef.current?.addFeature(feature)

        // Move overlay
        const overlay = mapRef.current.getOverlays().getArray()[0];
        overlay?.setPosition(fromLonLat(consumermeters));

        // Animate map to new location
        mapRef.current.getView().animate({
            center: fromLonLat(consumermeters),
            zoom: 16,
            duration: 50
        });
    }, [consumermeters, markerSvg])

    useEffect(() => {
        if (!geoLocationRef) return;
        geoLocationRef.current?.on('change:position', () => {
            const coord = geoLocationRef.current?.getPosition()
            if (coord) {
                userSourceRef.current?.clear()
                userSourceRef.current?.addFeature(
                    new Feature({ geometry: new Point(coord) })
                )
                mapRef.current?.getView().animate({
                    center: coord,
                    zoom: 16,
                    duration: 600
                })
                setTracking(false);
                geoLocationRef.current?.setTracking(false);
            }
        })

    }, [tracking])

    // HANDLE THE REALTIME-LOCATION
    const handleClick = () => {
        setTracking(true)
        geoLocationRef.current?.setTracking(true)
    }
    return <div ref={mapDivRef} className="w-full h-64 rounded-lg relative cursor-pointer">
        <button
            onClick={handleClick}
            aria-label='Realtime-Location'
            type='button'
            data-tip='Show Current Location'
            className='btn tooltip tooltip-left absolute btn-circle  btn-ghost top-2 right-2 z-50 pointer-events-auto'>
            <svg
                fill="currentColor"
                height={25}
                width={25}
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 297 297" xmlSpace="preserve">
                <g
                    id="SVGRepo_bgCarrier"
                    strokeWidth="0">
                </g>
                <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                </g>
                <g
                    id="SVGRepo_iconCarrier">
                    <path d="M293.337,259.152l-24.732-49.592c-4.232-8.483-12.772-13.754-22.288-13.754c-1.168,0-2.336,0.094-3.494,0.261l-7.2-14.438 c14.341-9.565,25.064-23.512,30.621-40.125c6.62-19.794,5.136-40.982-4.179-59.66c-10.195-20.442-28.311-34.943-49.638-40.621 C190.297,15.971,157.833,0,121.707,0C55.178,0,1.053,54.15,1.053,120.712c0,66.56,54.125,120.71,120.654,120.71 c39.74,0,75.04-19.333,97.036-49.079l6.278,12.59c-7.386,7.352-9.625,18.896-4.727,28.722l24.731,49.59 c4.23,8.484,12.77,13.756,22.288,13.756h0.001c3.812,0,7.633-0.9,11.049-2.603l3.821-1.905 C294.451,286.374,299.453,271.419,293.337,259.152z M244.268,90.719c6.945,13.925,8.052,29.721,3.116,44.478 c-4.936,14.757-15.322,26.709-29.247,33.652c-8.168,4.074-16.897,6.14-25.947,6.14c-22.259,0-42.253-12.364-52.181-32.269 c-14.337-28.745-2.614-63.795,26.13-78.131c8.167-4.073,16.897-6.139,25.947-6.139C214.346,58.45,234.342,70.814,244.268,90.719z M181.104,39.337c-5.61,0.795-11.098,2.209-16.432,4.226c-0.605-1.676-1.224-3.326-1.874-4.924 c-1.837-4.514-3.822-8.653-5.936-12.417C165.58,29.479,173.72,33.921,181.104,39.337z M147.005,54.222H95.969 c7.258-22.021,17.427-34.336,25.738-34.336C129.854,19.886,139.781,33.019,147.005,54.222z M90.822,74.107h35.859 c-7.124,10.983-11.409,23.614-12.428,36.661H86.748C87.236,97.221,88.688,84.936,90.822,74.107z M32.371,74.107H70.69 c-2.085,11.559-3.385,23.905-3.83,36.661H21.429C22.717,97.653,26.531,85.27,32.371,74.107z M32.371,167.314 c-5.841-11.162-9.654-23.544-10.942-36.659H66.86c0.445,12.755,1.745,25.101,3.83,36.659H32.371z M46.022,187.199h29.263 c1.579,5.494,3.351,10.719,5.332,15.585c1.837,4.513,3.821,8.653,5.936,12.416C70.809,209.318,56.921,199.605,46.022,187.199z M80.616,38.639c-1.98,4.864-3.753,10.09-5.331,15.583H46.023c10.899-12.405,24.787-22.118,40.529-28 C84.438,29.985,82.453,34.125,80.616,38.639z M86.748,130.654h28.519c1.285,7.109,3.564,14.157,6.947,20.94 c2.856,5.728,6.339,10.986,10.335,15.719H90.822C88.688,156.485,87.236,144.201,86.748,130.654z M121.707,221.536 c-8.312,0-18.48-12.314-25.738-34.337h51.476C140.187,209.222,130.019,221.536,121.707,221.536z M162.798,202.784 c1.546-3.797,2.96-7.818,4.259-12.01c7.254,2.44,14.941,3.837,22.864,4.06c-9.518,8.776-20.715,15.754-33.059,20.366 C158.976,211.438,160.961,207.297,162.798,202.784z M273.311,274.694l-3.821,1.906c-0.684,0.341-1.415,0.514-2.174,0.514 c-1.898,0-3.662-1.077-4.493-2.744l-24.731-49.591c-1.203-2.412-0.183-5.466,2.23-6.669l3.819-1.904 c0.684-0.341,1.416-0.514,2.175-0.514c1.897,0,3.661,1.076,4.492,2.742l24.731,49.593 C276.743,270.439,275.723,273.492,273.311,274.694z">
                    </path>
                </g>
            </svg>
        </button>
        <div ref={PopupRef} className={`${animatePing ? 'animate-ping' : ''}`}>
            <h1 className='font-bold text-blue-800'>{markerPopup}</h1>
        </div>
        {tracking && <p className='absolute top-2 left-2 z-10'>
            Tracking Current Location...
        </p>}
    </div>
}

export default BiselcoMap
