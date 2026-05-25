

import React from 'react'

type Props = {
    tabs: Tabs[]
    activeTab: string
    handleActiveTab: (tab: string) => void
}
type Tabs = {
    value: string;
    label: string;
}

const Tabs = ({tabs, activeTab, handleActiveTab}: Props) => {
  return (
      <div className="tabs shadow-md bg-base-100 tabs-lift tabs-bordered mb-6 pt-2 px-2   rounded-lg ">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleActiveTab(tab.value)}
            className={`tab tab-lg ${activeTab === tab.value ? "tab-active bg-base-200 rounded-box" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
  )
}

export default Tabs