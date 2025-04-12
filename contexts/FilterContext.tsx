"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  gender: string;
  setGender: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  areFiltersApplied: boolean;
  setAreFiltersApplied: (value: boolean) => void;
  triggerFilterUpdate: () => void;
  filterUpdateTrigger: number;
  categoryFilter: {
    catId: number;
    subCatId: number | null;
  };
  setCategoryFilter: (filter: { catId: number; subCatId: number | null }) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState('');
  const [time, setTime] = useState("");
  const [areFiltersApplied, setAreFiltersApplied] = useState(false);
  const [filterUpdateTrigger, setFilterUpdateTrigger] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<{ catId: number; subCatId: number | null }>({ catId: 0, subCatId: null });

  const triggerFilterUpdate = () => {
    setFilterUpdateTrigger(prev => prev + 1);
  };

  return (
    <FilterContext.Provider value={{
      priceRange,
      setPriceRange,
      gender,
      setGender,
      age,
      setAge,
      time,
      setTime,
      areFiltersApplied,
      setAreFiltersApplied,
      triggerFilterUpdate,
      filterUpdateTrigger,
      categoryFilter,
      setCategoryFilter
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
} 