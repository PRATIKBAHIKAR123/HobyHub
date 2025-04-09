"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SortFilterContextType {
  sortFilter: string;
  setSortFilter: (value: string) => void;
}

const SortFilterContext = createContext<SortFilterContextType | undefined>(undefined);

export function SortFilterProvider({ children }: { children: ReactNode }) {
  const [sortFilter, setSortFilter] = useState("NearMe");

  return (
    <SortFilterContext.Provider value={{ sortFilter, setSortFilter }}>
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