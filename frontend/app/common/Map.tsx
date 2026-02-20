'use client'

import {  useEffect, useRef } from 'react'
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
import { fromLonLat, toLonLat } from 'ol/proj'
import { Geolocation } from 'ol'
import { defaults as defaultControls } from 'ol/control'


type Props = {
    onSelectLocation?: (lat: number, lon: number) => void
    coordinates?: [number, number]
}

const BiselcoMap = ({ onSelectLocation, coordinates }: Props) => {
    const mapRef = useRef<Map | null>(null)
    const mapDivRef = useRef<HTMLDivElement | null>(null)
    const markerSourceRef = useRef<VectorSource | null>(null)
    const onSelectLocationRef = useRef(onSelectLocation)
    const geoLocationRef = useRef<Geolocation | null>(null)
    const userSourceRef = useRef<VectorSource | null>(null)

    // Initialize the map
    useEffect(() => {
        if (!mapDivRef.current || mapRef.current) return
        // Create New Marker Source 
        markerSourceRef.current = new VectorSource()
        userSourceRef.current = new VectorSource()
        const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="red">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
                `;
        const usersvg = `
        <svg 
        height="15" 
        width="15" version="1.1" id="Capa_1" 
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
            source: markerSourceRef.current,
            style: new Style({
                image: new Icon({
                    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
                    anchor: [0.5, 1],
                }),
            }),
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
                attribution: false ,
                zoom: false,
                rotate: false,

            }),
            view:view,
        })
        // CREATE AN ACTION ON THE MAP FOR Pointing on the specific location
        mapRef.current.on('singleclick', (evt) => {
            const coord = evt.coordinate
            const [lon, lat] = toLonLat(coord)

            markerSourceRef.current?.clear()
            markerSourceRef.current?.addFeature(
                new Feature({ geometry: new Point(coord) })
            )
            onSelectLocationRef.current?.(lat, lon)
        })

        // CREATE A COMPLAINT MARKER IF COORDINATES IS AVAILABLE
        if (coordinates) {
            markerSourceRef.current?.clear()
            markerSourceRef.current?.addFeature(
                new Feature({ geometry: new Point(fromLonLat(coordinates)) })
            )
        }

        // INTIALIZE NEW GEOLOCATION
        geoLocationRef.current = new Geolocation({
            trackingOptions: {
                enableHighAccuracy: true,
            },
            projection: view.getProjection(),
        })

        //  GET REALTIME-GEOLOCATION DATA
        geoLocationRef.current.on('change:position', () => {
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
            }
        })
        return () => {
            mapRef.current?.setTarget(undefined)
            mapRef.current = null
        }
    }, [coordinates])
    // HANDLE THE REALTIME-LOCATION
    const handleClick = () => {
        geoLocationRef.current?.setTracking(true)
    }
    return <div ref={mapDivRef} className="w-full h-64 rounded-lg relative cursor-pointer border">
        <button
            onClick={handleClick}
            aria-label='Realtime-Location'
            type='button'
            data-tip='Show Current Location'
            className='btn tooltip tooltip-left absolute btn-circle btn-ghost top-2 right-2 z-50 pointer-events-auto'>
            <svg
                version="1.1"
                id="Uploaded to svgrepo.com"
                xmlns="http://www.w3.org/2000/svg"

                width="64px"
                height="64px"
                viewBox="0 0 32 32"
                fill="#000000"
                stroke="currentColor">
                <g
                    id="SVGRepo_bgCarrier"
                    strokeWidth={0}>
                </g>
                <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                </g>
                <g
                    id="SVGRepo_iconCarrier">
                    <style type="text/css">
                    </style>
                    <path
                        d="M24.674,11.041L26,6l-5.041,1.326C19.426,6.449,17.715,6,16,6c-1.835,0-3.666,0.511-5.278,1.515 H7.515v3.208c-2.008,3.223-2.008,7.332,0,10.555v3.208h3.208C12.334,25.489,14.165,26,16,26s3.666-0.511,5.278-1.515h3.208v-3.208 C26.428,18.16,26.489,14.213,24.674,11.041z M10.343,21.657c-3.119-3.119-3.119-8.195,0-11.314C11.854,8.832,13.863,8,16,8 c2.137,0,4.146,0.832,5.657,2.343c3.119,3.119,3.119,8.195,0,11.314C20.146,23.168,18.137,24,16,24 C13.863,24,11.854,23.168,10.343,21.657z M16.773,13.114C16.525,13.047,16.269,13,16,13c-1.654,0-3,1.346-3,3 c0,0.269,0.047,0.525,0.114,0.773L11,21l4.227-2.114C15.475,18.953,15.731,19,16,19c1.654,0,3-1.346,3-3 c0-0.269-0.047-0.525-0.114-0.773L21,11L16.773,13.114z M16,17c-0.552,0-1-0.448-1-1c0-0.552,0.448-1,1-1s1,0.448,1,1 C17,16.552,16.552,17,16,17z">
                    </path>
                </g>
            </svg>
        </button>
    </div>
}

export default BiselcoMap
