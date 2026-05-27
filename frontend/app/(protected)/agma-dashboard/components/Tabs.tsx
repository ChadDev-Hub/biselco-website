import React from "react";
import Link from "next/link";
type Props = {
  tabs: Tabs[];
  activeTab: string;
};
type Tabs = {
  value: string;
  label: string;
};

const Tabs = ({ tabs, activeTab }: Props) => {
  return (
    <div className="tabs shadow-md bg-base-100 tabs-lift tabs-bordered mb-6 pt-2 px-2   rounded-lg ">
      {tabs.map((tab) => {
        const param = new URLSearchParams();
        param.set("tab", tab.value);
        return (
          <Link
            href={`?${param.toString()}`}
            key={tab.value}
            scroll={false}
            shallow={true}
            className={`tab tab-lg ${activeTab === tab.value ? "tab-active bg-base-200 rounded-box" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default Tabs;
