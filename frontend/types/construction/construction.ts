import {FeatureCollection, Geometry} from 'geojson'
import {LineConstruction} from './line-construction'

export type ConstructionData<T> = {
    id: number
    activity: string
    description: string
    centroid: Geometry
    date_accomplished: Date
    feature_collection: FeatureCollection<Geometry, T>
}

export type LineConstructions = {
    construction: ConstructionData<LineConstruction>
}