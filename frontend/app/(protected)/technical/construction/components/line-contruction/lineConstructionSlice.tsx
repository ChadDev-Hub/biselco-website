"use client";

import { createSlice } from "@reduxjs/toolkit";
import { LineConstructions } from "@/types/construction/construction";
import { LineConstruction } from "@/types/construction/line-construction";
import { FeatureCollection, Geometry } from "geojson";
import type { Sections } from "../sidebar-button";

type IntialState = {
  section: Sections[];
  data: LineConstructions[];
  features: FeatureCollection<Geometry, LineConstruction>[];
};
const initialState: IntialState = {
  section: [],
  data: [],
  features: [],
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
      state.features = action.payload.map(
        (item: LineConstructions) => item.construction.feature_collection,
      );
    },
    selectedSection: (state, action) => {
      const selectedSection = state.data.find(
        (item: LineConstructions) => item.construction.id === action.payload,
      );
      if (!selectedSection) return;
        state.features.forEach(feature => {
        feature.properties = {
            ...feature.properties,
            selected: false
        };
    });
      
      const features =
        selectedSection.construction.feature_collection.features.map(
          (feature) => ({
            ...feature,
            properties: {
              ...feature.properties,
              selected: true,
            },
          }),
        );
     
      state.features = [...state.features, ...features];
    },
  },
});

export const { setInitialState } = LineConstructionSlice.actions;

export default LineConstructionSlice.reducer;
