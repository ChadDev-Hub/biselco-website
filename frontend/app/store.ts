"use client";
import {configureStore} from '@reduxjs/toolkit';
import LineConstructionSlice from './(protected)/technical/construction/components/line-contruction/lineConstructionSlice';

export const store = configureStore({
    reducer: {
        lineConstruction: LineConstructionSlice
    },
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store