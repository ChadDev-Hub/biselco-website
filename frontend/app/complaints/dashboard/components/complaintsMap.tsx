"use client"
import React, {   useEffect, useRef, useState} from 'react'
import { Map } from 'ol'
import { View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Feature } from 'ol'
import Style from 'ol/style/Style'
import { Point } from 'ol/geom'
import Icon from 'ol/style/Icon'
import { fromLonLat } from 'ol/proj'
import { defaults as defaultControls } from 'ol/control'
import { Overlay } from 'ol'
import {Geolocation} from 'ol'
type Props = {
    longitude: number,
    latitude: number
    srid: number
}
const ComplaintMap = ({ longitude, latitude, srid }: Props) => {
    const [tracking, setTracking] = useState(false)
    const useDiv = useRef<HTMLDivElement | null>(null)
    const useMap = useRef<Map | null>(null)
    const markerSource = useRef<VectorSource>(null)
    const usegeolocation = useRef<Geolocation | null>(null)

    useEffect(() => {
        if (!useDiv.current) return
        // USER SVG
        const usersvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="blue">
        <polygon points="16,4 28,28 16,22 4,28"/>
        </svg>
        `
        // COMPLAINT MARKER
        const markerElement = document.createElement('div')
        markerElement.innerHTML = `
        <svg class="animate-bounce" xmlns="http://www.w3.org/2000/svg"
            width="32" height="32" viewBox="0 0 24 24" fill="red">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>`

        // INITIALIZE VIEW
        const view = new View({
            center: fromLonLat([120.2043, 11.9986]),
            zoom: 9
        })

        // INITIALIZE MAP
        useMap.current = new Map({
            target: useDiv.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
            ],
            view: view,
            controls: defaultControls({
                attribution: false,
                zoom: false,
                rotate: false

            })
        })

        // INITIALIZE USER MARKER SOURCE
        markerSource.current = new VectorSource()
        const complaintLayer = new VectorLayer({
            source: markerSource.current,
            style: new Style({
                image: new Icon({
                    src: `data:image/svg+xml;utf8,${encodeURIComponent(usersvg)}`,
                    anchor: [0.5, 0.5],
                    scale: 1,
                    rotateWithView: true
                }),
                
            }),
        })

        // ADD COMPLAINT LAYER FOR USER MARKER SOURCE
        useMap.current.addLayer(complaintLayer)
        useMap.current?.getView().animate({
            center: fromLonLat([longitude, latitude]),
            duration: 1000,
            zoom: 16
        })


        // COMPLAINT MARKER OVERLAY BOUNCING
        const markerOverlay = new Overlay({
            position: fromLonLat([longitude, latitude]),
            positioning: 'bottom-center',
            element: markerElement,
            stopEvent: false
        })
        useMap.current?.addOverlay(markerOverlay)


        // INIRIALIZE USER GEOLOCATION
        usegeolocation.current = new Geolocation({
            projection: view.getProjection(),
            trackingOptions: {
                enableHighAccuracy: true,
            }
        })
        
        return () => {
            useMap.current?.setTarget(undefined)
            useMap.current = null
        }
    }, [latitude, longitude, srid])


    useEffect(() => {
        // TRACK USER REALTIME POSITION
        if (!usegeolocation.current) return
        usegeolocation.current.on('change:position', () => {
            const position = usegeolocation.current?.getPosition()
            const heading = usegeolocation.current?.getHeading()
            if (position) {
                markerSource.current?.clear()
                markerSource.current?.addFeature(new Feature({
                    geometry: new Point(position)
                }))
                markerSource.current?.getFeatures()[0].set('heading', heading)
                useMap.current?.getView().animate({
                    center: position,
                    duration: 1000
                })
                setTracking(false)
                usegeolocation.current?.setTracking(false)
            }
        })
    }, [tracking])
    // HANDLE TRACKING WHEN BUTTON IS CLICK
    const handleClick = () => {
        usegeolocation.current?.setTracking(true)
        setTracking(true)
    }

    return (
        <div ref={useDiv} className="w-full shadow-lg drop-shadow-md h-100 relative" >
            <button
            onClick={handleClick}
            aria-label='Realtime-Location'
            type='button'
            data-tip='Show Current Location'
            className='btn tooltip tooltip-left absolute btn-circle btn-ghost top-2 right-2 z-50 pointer-events-auto shadow-md drop-shadow-md'>
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
        {tracking && <p className='absolute top-2 left-2 z-10'>
            Tracking Current Location...
        </p>}
        </div>
    )
}

export default ComplaintMap