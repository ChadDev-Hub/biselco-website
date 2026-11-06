

"use client"
import {LineConstruction} from '@/types/construction/line-construction'
import {  FeatureCollection, Geometry } from 'geojson';
import { Layer, LayerProps, Source } from 'react-map-gl/maplibre';
type Props = {
    data:FeatureCollection<Geometry, LineConstruction>
}


const LineConstructionLayer = ({data}: Props) => {
    const layerId = "line-construction-layer";
    const sourceId = "line-construction-source";

    const LineConstruction: LayerProps = {
        id: layerId,
        source: sourceId,
        type: 'circle',
        paint: {
            'circle-radius': 5,
            'circle-color': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                '#FF0000',
                '#FF8938'
            ]
        }
    }
  return (
    <Source id={sourceId} type="geojson" data={data}>
        <Layer {...LineConstruction} />
    </Source>
  )
}

export default LineConstructionLayer