"use client";

import { useState } from "react";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Urgent", value: "urgent" },
  { label: "Trending", value: "trending" },
  { label: "Recent", value: "recent" },
];

interface FiltersProps {
  onFilterChange?: (filter: string) => void;
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [activeTab, setActiveTab] = useState("all");

  function handleSelect(value: string) {
    setActiveTab(value);
    onFilterChange?.(value);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleSelect(tab.value)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${
            activeTab === tab.value
              ? "bg-text-primary text-white border-text-primary"
              : "border-border-medium text-text-secondary hover:border-text-primary hover:text-text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
