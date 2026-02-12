"use client"
import React, { useEffect, useRef } from 'react'
import {Map} from 'ol'
import {View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Feature} from 'ol'
import Style from 'ol/style/Style'
import { Point } from 'ol/geom'
import Icon from 'ol/style/Icon'
import { fromLonLat } from 'ol/proj'



type Props = {
    longitude: number,
    latitude: number
    srid: number
}
const ComplaintMap = ({longitude,latitude,srid}: Props) => {
    const useDiv = useRef<HTMLDivElement | null>(null)
    const useMap = useRef<Map | null>(null)
    const markerSource = useRef<VectorSource>(null)
    useEffect(()=>{
        if (!useDiv.current) return
        // initialize Map and View
        const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="red">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
                `;
        const view = new View({
            center: fromLonLat([120.2043, 11.9986]),
            zoom: 9
        })
        useMap.current = new Map({
            target: useDiv.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
            ],
            view: view
        })

        markerSource.current = new VectorSource()
        const complaintLayer = new VectorLayer({
            source: markerSource.current,
            style: new Style({
                image: new Icon({
                    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
                    anchor: [0.5, 0.5],
                    scale: .60
                })
            })
        })
        useMap.current.addLayer(complaintLayer)

        const feature = new Feature(new Point(fromLonLat([longitude, latitude])))
        markerSource.current?.clear()
        markerSource.current?.addFeature(feature)
        useMap.current?.getView().animate({
            center: fromLonLat([longitude, latitude]),
            duration: 1000,
            zoom: 16
        })
        return () => {
            useMap.current?.setTarget(undefined)
            useMap.current = null
        }
    },[latitude, longitude, srid])
  return (
    <div ref={useDiv} className="w-full h-150" >

    </div>
  )
}

export default ComplaintMap