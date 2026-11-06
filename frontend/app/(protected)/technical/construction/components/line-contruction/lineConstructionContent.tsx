"use client";
import { useEffect } from "react";
import { LineConstructions } from "@/types/construction/construction";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { setInitialState } from "./lineConstructionSlice";
import SideContent from "../../../../../common/navigations/side-content";
import LineConstructionLayer from "./LineConstructionLayer";
import MapProvider from "../../../../../context/MapProvider";
import LineConstructionCardSection from '../sidebar-button'
type Props = {
  data: LineConstructions[];
};

const LineConstructionContent = ({ data }: Props) => {
  const lineConstruction = useAppSelector((state) => state.lineConstruction);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setInitialState(data));
  }, [data, dispatch]);
  return (
    <div className="w-full place-items-center">
      <div className="flex w-full gap-4 h-full max-w-8xl p-2">
        <SideContent title="Line Construction">
          {lineConstruction.section.map((section) => (
            <LineConstructionCardSection key={section.id} section={section} />
          ))}
        </SideContent>
        <div className="w-full h-screen rounded-box overflow-hidden">
          <MapProvider>
            <LineConstructionLayer data={lineConstruction.features[0]} />
          </MapProvider>
        </div>
      </div>
    </div>
  );
};

export default LineConstructionContent;
