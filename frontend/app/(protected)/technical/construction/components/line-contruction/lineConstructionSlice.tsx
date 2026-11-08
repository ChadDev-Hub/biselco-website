"use client";

import { createSlice } from "@reduxjs/toolkit";
import { LineConstructions } from "@/types/construction/construction";
import { LineConstruction } from "@/types/construction/line-construction";
import { Feature,FeatureCollection, Geometry } from "geojson";
import type { Sections } from "../sidebar-button";


type IntialState = {
  selectedSection: number;
  center: number[];
  section: Sections[];
  data: LineConstructions[];
  features: FeatureCollection<Geometry, LineConstruction>;
  popUpInfo?: Feature<Geometry, LineConstruction>;
};
const initialState: IntialState = {
  selectedSection: -1,
  center: [],
  section: [],
  data: [],
  features: {
    type: "FeatureCollection",
    features: [],
  },
  popUpInfo: undefined
};
export const LineConstructionSlice = createSlice({
  name: "construction",
  initialState,
  reducers: {
    setInitialState: (state, action) => {
      state.data = action.payload;
      state.section = action.payload.map((item: LineConstructions) => ({
        id: item.construction.id,
        description: item.construction.description,
        activity: item.construction.activity,
        date: item.construction.date_accomplished,
      }));
      
      const features = (action.payload.map((item)=> item.construction.feature_collection.features)).flat();
      state.features = {
        type: "FeatureCollection",
        features: features,
      }
    },
    selectSection: (state, action) => {
      const selectedSection = state.data.find(
        (item: LineConstructions) => item.construction.id === action.payload,
      );
      // SET THE SELECTED SECION ID
      state.selectedSection = action.payload;
      // SET THE SELECTED SECITON CENTER 
      state.center = selectedSection?.construction.centroid.type === "Point" ? selectedSection.construction.centroid.coordinates : [];
      const filtered: FeatureCollection<Geometry, LineConstruction> = {
        type: "FeatureCollection",
        features: selectedSection?.construction.feature_collection.features.map(
          (feature) => {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                selected: true,
              },
            };
          },
        ) || [],
      };
      state.features = filtered;
    },
    unSelectSection: (state, action) => {
      state.selectedSection = state.selectedSection === action.payload ? -1 : state.selectedSection;
      state.center= [];

      const feature = state.data.map((item: LineConstructions) => item.construction.feature_collection.features).flat();
      const filtered: FeatureCollection<Geometry, LineConstruction> = {
        type: "FeatureCollection",
        features: feature.map(
          (feature) => {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                selected: false,
              },
            };
          },
        )
      };
      state.features = filtered;
    },
    showPopUp : (state, action) => {
      const seletedFeature = state.features.features.find((feature) => feature.properties.id === action.payload);
      state.popUpInfo = seletedFeature;
    }
  },
});

export const { setInitialState, selectSection, unSelectSection, showPopUp } = LineConstructionSlice.actions;

export default LineConstructionSlice.reducer;
