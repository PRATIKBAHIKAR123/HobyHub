"use client";
import { useMode } from "@/contexts/ModeContext";
import { useSortFilter } from "@/contexts/SortFilterContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const HomepageRedirectWithParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
    const { isOnline } = useMode();
    const { sortFilter } = useSortFilter();

  useEffect(() => {
    const hasParams = searchParams.get("SortFilter") || searchParams.get("Mode");

    if (!hasParams) {
      const params = new URLSearchParams();
      params.set("SortFilter", sortFilter);
      params.set("Mode", isOnline?'Online':'Offline');
      router.replace(`/?${params.toString()}`);
    }
  }, [sortFilter,isOnline]);

  return null; // or show a loader optionally
};

export default HomepageRedirectWithParams;
