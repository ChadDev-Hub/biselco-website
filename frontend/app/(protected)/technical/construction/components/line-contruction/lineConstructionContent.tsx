"use client";
import { useEffect } from "react";
import { LineConstructions } from "@/types/construction/construction";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { setInitialState } from "./lineConstructionSlice";
import SideContent from "../../../../../common/navigations/side-content";
import LineConstructionLayer from "./LineConstructionLayer";
import LineConstructionCardSection from "../sidebar-button";
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
    <div className="p-4 absolute">
      <SideContent title="Line Construction">
        {lineConstruction.section.map((section) => (
          <LineConstructionCardSection key={section.id} section={section} />
        ))}
      </SideContent>
      <LineConstructionLayer />
    </div>
  );
};

export default LineConstructionContent;
