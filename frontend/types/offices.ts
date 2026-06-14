import {FeatureCollection, Point} from "geojson";

export type Offices = FeatureCollection<Point, OfficesProps>


export type OfficesProps = {
    label: string
    address: string
    google_link: string
}