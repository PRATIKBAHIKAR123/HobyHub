"use client";

import useLocation from '@/app/hooks/useLocation';
import { set } from 'date-fns';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  location: string;
  setLocation: (value: string) => void;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (value: { lat: number; lng: number } | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState('');
  const [time, setTime] = useState("");
  const [areFiltersApplied, setAreFiltersApplied] = useState(false);
  const [filterUpdateTrigger, setFilterUpdateTrigger] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<{ catId: number; subCatId: number | null }>({ catId: 0, subCatId: null });
  const [location, setLocation] = useState("");
  
  // Get coordinates from useLocation hook
  const locationHook = useLocation();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  
  useEffect(() => {
    if (locationHook.coordinates) {
      console.log("FilterContext: Updating coordinates from hook:", locationHook.coordinates);
      setCoordinates(locationHook.coordinates); // Update coordinates in the filter context
    }
  
    if (locationHook.location) {
      console.log("FilterContext: Updating location from hook:", locationHook.location);
      setLocation(locationHook.location); // Update location in the filter context
    }
  }, [locationHook.coordinates, locationHook.location]);

  const triggerFilterUpdate = () => {
    console.log("Triggering filter update. Current coordinates:", coordinates);
    setFilterUpdateTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const detectAndSetInitialLocation = async () => {
      try {
        const { detectLocation } = useLocation(); // Get only the method
        const result = await detectLocation();
        setLocation(result.location);
        setCoordinates(result.coordinates);
      } catch (err) {
        console.error("Initial location detection failed:", err);
      }
    };
  
    detectAndSetInitialLocation();
  }, []);

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
      coordinates,
      setCoordinates,
      filterUpdateTrigger,
      categoryFilter,
      setCategoryFilter,
      location,
      setLocation
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