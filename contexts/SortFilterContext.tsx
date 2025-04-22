"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SortFilterContextType {
  sortFilter: string;
  setSortFilter: (value: string) => void;
  distance: string;
  setDistance: (value: string) => void;
}

const SortFilterContext = createContext<SortFilterContextType | undefined>(undefined);

export function SortFilterProvider({ children }: { children: ReactNode }) {
  const [sortFilter, setSortFilter] = useState("NearMe");
  const [distance, setDistance] = useState("10");

  return (
    <SortFilterContext.Provider value={{ sortFilter, setSortFilter, distance, setDistance }}>
      {children}
    </SortFilterContext.Provider>
  );
}

export function useSortFilter() {
  const context = useContext(SortFilterContext);
  if (context === undefined) {
    throw new Error('useSortFilter must be used within a SortFilterProvider');
  }
  return context;
} 