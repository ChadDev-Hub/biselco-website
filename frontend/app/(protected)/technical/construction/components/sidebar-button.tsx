"use client";
import React from "react";
import { UtilityPole, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../hook";
import {
  selectSection,
  unSelectSection,
} from "./line-contruction/lineConstructionSlice";
import DownloadReport from "@/app/common/buttons/download-report";
export type Sections = {
  id: number;
  activity: string;
  description: string;
  date: string;
};
type Props = {
  section: Sections;
};

const SidebarButton = ({ section }: Props) => {
  const dispatch = useAppDispatch();
  const selectedSection = useAppSelector(
    (state) => state.lineConstruction.selectedSection,
  );

  const handleClick = () => {
    dispatch(selectSection(section.id));
  };
  const handleDoubleClick = () => {
    dispatch(unSelectSection(section.id));
  };

  return (
    <div
      key={section.id}
      role="button"
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      className={`w-full h-full btn btn-ghost place-content-start text-left px-3 py-2 rounded-xl transition-all duration-200 font-medium ${selectedSection === section.id ? "bg-blue-50 text-blue-600" : ""}`}
    >
      <div key={section.id} className="w-full">
        <div className="p-2 flex gap-4 items-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors mt-0.5">
          <UtilityPole className="w-5 h-5" />{" "}
          <h3 className="text-base font-semibold text-slate-900 truncate">
            {section.activity}
          </h3>
        </div>

        {/* Content details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-600 mt-1">{section.description}</p>

          <div className="flex justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{section.date}</span>
            </div>
            {selectedSection === section.id && (
              <div className="flex items-center  gap-1.5 text-xs text-slate-400 mt-2">
                <DownloadReport />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarButton;
