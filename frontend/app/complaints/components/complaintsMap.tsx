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
        {tracking && <p className='absolute top-2 left-2 z-10'>
            Tracking Current Location...
        </p>}
        </div>
    )
}

export default ComplaintMap