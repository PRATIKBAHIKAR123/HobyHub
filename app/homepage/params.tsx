"use client";
import { useFilter } from "@/contexts/FilterContext";
import { useMode } from "@/contexts/ModeContext";
import { useSortFilter } from "@/contexts/SortFilterContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const HomepageRedirectWithParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOnline } = useMode();
  const { sortFilter, distance } = useSortFilter();
  const { priceRange, gender, age, time, areFiltersApplied, filterUpdateTrigger, categoryFilter, location, coordinates } = useFilter();

  useEffect(() => {
    let currentSortFilter = searchParams.get("SortFilter");
    let currentMode = searchParams.get("Mode");
    let kilometer = searchParams.get("Kilometer");
    let currentPriceRange = searchParams.get("PriceRange");
    const currentGender = searchParams.get("Gender");
    const currentAge = searchParams.get("Age");
    const currentTime = searchParams.get("Time");
    const currentCategoryFilter = searchParams.get("CategoryFilter");
    const currentLocation = searchParams.get("Location");
    const currentCoordinates = searchParams.get("Coordinates");

    // Check if the parameters need to be updated
    if (
      currentSortFilter !== sortFilter ||
      currentMode !== (isOnline ? "Online" : "Offline") ||
      kilometer !== distance ||
      (currentPriceRange ? JSON.parse(currentPriceRange) : null) !== priceRange ||
      currentGender !== gender ||
      currentAge !== age ||
      currentTime !== time ||
      (currentCategoryFilter ? JSON.parse(currentCategoryFilter) : null) !== categoryFilter ||
      currentLocation !== location ||
      currentCoordinates !== coordinates
    ) {
      localStorage.setItem('params', JSON.stringify({
        currentSortFilter,
        currentMode,
        kilometer,
        currentPriceRange,
      }))

      const localstorageParams = JSON.parse(localStorage.getItem('params')!);
      const params = new URLSearchParams();
      currentSortFilter = localstorageParams.currentSortFilter || currentSortFilter;
      currentMode = localstorageParams.currentMode || currentMode;
      kilometer = localstorageParams.kilometer || kilometer;
      currentPriceRange = localstorageParams.currentPriceRange || currentPriceRange;
      params.set("SortFilter", sortFilter);
      params.set("Mode", isOnline ? "Online" : "Offline");
      params.set("Kilometer", distance || "");
      params.set("PriceRange", JSON.stringify(priceRange));
      params.set("Gender", gender || "");
      params.set("Age", age || "");
      params.set("Time", time || "");
      params.set("CategoryFilter", JSON.stringify(categoryFilter));
      params.set("Location", location || "");
      params.set("Coordinates", coordinates ? JSON.stringify(coordinates) : "");
      router.replace(`/?${params.toString()}`);
      
    }
  }, [sortFilter, isOnline, searchParams,areFiltersApplied,filterUpdateTrigger, router]);

  return null; 
};

export default HomepageRedirectWithParams;
