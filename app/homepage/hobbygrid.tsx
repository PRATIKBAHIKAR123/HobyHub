"use client"

import Image from "next/image";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { getAllActivities } from "@/services/hobbyService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMode } from "@/contexts/ModeContext";
import { useSortFilter } from "@/contexts/SortFilterContext";
import { useFilter } from "@/contexts/FilterContext";
import { API_BASE_URL_IMG } from "@/lib/apiConfigs";

interface Activity {
  id: number;
  vendorId: number;
  type: string;
  categoryId: number;
  subCategoryId: string;
  title: string;
  description: string;
  thumbnailImage: string;
  sessionCountFrom: number;
  sessionCountTo: number;
  ageRestrictionFrom: number;
  ageRestrictionTo: number;
  address: string;
  road: string;
  area: string;
  state: string;
  city: string;
  pincode: string;
  country: string;
  longitude: string;
  latitude: string;
  viewCount: number;
}

function HobbyCardSkeleton() {
  return (
    <div className="rounded-2xl border-[1px] border-black/20 w-full max-w-sm mx-auto bg-white relative">
      {/* Image Skeleton */}
      <Skeleton className="h-[250px] w-full rounded-tl-2xl rounded-tr-2xl" />

      {/* Views Count Skeleton */}
      <div className="absolute top-2 left-2">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Favorite Button Skeleton */}
      <div className="absolute top-2 right-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title Skeleton */}
        <Skeleton className="h-5 w-3/4 mb-2" />

        {/* Location Badge Skeleton */}
        <Skeleton className="h-[29px] w-[180px] rounded-[20px]" />

        {/* Bottom Info Skeleton */}
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </div>
    </div>
  );
}

export default function HobbyGrid() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<{ [key: string]: Activity }>({});
  const { isOnline } = useMode();
  const { sortFilter , distance } = useSortFilter();
  const { priceRange, gender, age, time, areFiltersApplied, filterUpdateTrigger, categoryFilter, location, coordinates } = useFilter();
  
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(16); // Fixed page size of 16 items
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Reference to the observer element
  const observer = useRef<IntersectionObserver | null>(null);
  const lastActivityElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    // Load favorites from localStorage when component mounts
    const storedFavorites = localStorage.getItem('hobbyFavorites');
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        setFavorites({});
      }
    }
  }, []);


  useEffect(() => {
    console.log('coordinates:', coordinates);
  }, [coordinates]);

  useEffect(() => {
    // Reset pagination when filters change
    setActivities([]);
    setPageNumber(1);
    setHasMore(true);
  }, [isOnline, sortFilter, filterUpdateTrigger, categoryFilter, areFiltersApplied, location, distance]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (pageNumber === 1) {
          setIsLoading(true);
        } else {
          setLoadingMore(true);
        }
        
        const data = await getAllActivities({
          latitude: coordinates?.lat.toString(),
          longitude: coordinates?.lng.toString(),
          catId: categoryFilter.catId,
          subCatId: categoryFilter.subCatId || undefined,
          mode: isOnline ? "online" : "offline",
          sortFilter: sortFilter,
          location: location || "",
          age: areFiltersApplied ? parseInt(age) : 0,
          type: "",
          time: areFiltersApplied ? time : "",
          gender: areFiltersApplied ? gender : "",
          priceFrom: areFiltersApplied ? priceRange[0] : 0,
          priceTo: areFiltersApplied ? priceRange[1] : 0,
          pageNumber: pageNumber,
          pageSize: pageSize,
          distance: distance
        });
        
        const newActivities = data as Activity[];
        
        if (newActivities.length === 0 || newActivities.length < pageSize) {
          setHasMore(false);
        }
        
        if (pageNumber === 1) {
          setActivities(newActivities);
        } else {
          setActivities(prev => [...prev, ...newActivities]);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setLoadingMore(false);
      }
    };

    fetchActivities();
  // }, [pageNumber, isOnline, sortFilter, filterUpdateTrigger, categoryFilter, areFiltersApplied, age, gender, priceRange, time, location, coordinates, pageSize, distance]);
}, [pageNumber, isOnline, sortFilter, filterUpdateTrigger, categoryFilter, areFiltersApplied, location, coordinates, pageSize, distance]);

const toggleFavorite = (e: React.MouseEvent, activity: Activity) => {
  e.stopPropagation(); // Prevent card click event
  
  // Get current favorites from localStorage
  const storedFavorites = localStorage.getItem('hobbyFavorites');
  let currentFavorites: { [key: string]: Activity } = storedFavorites ? JSON.parse(storedFavorites) : {};
  
  const activityId = activity.id.toString();
  
  // Check if this activity is already in favorites
  if (currentFavorites[activityId]) {
    // Remove from favorites
    // The '-' is showing unused in lint errors
    const { [activityId]: _, ...restFavorites } = currentFavorites;
    console.log(_)
    currentFavorites = restFavorites;
  } else {
    // Add to favorites
    currentFavorites[activityId] = activity;
  }
  
  // Update state and localStorage
  setFavorites(currentFavorites);
  localStorage.setItem('hobbyFavorites', JSON.stringify(currentFavorites));
};

const isFavorited = (activityId: number): boolean => {
  return !!favorites[activityId.toString()];
};

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
        {[...Array(8)].map((_, index) => (
          <HobbyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (activities.length === 0 && !isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
        <div className="col-span-full flex items-center justify-center h-[360px]">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          ref={index === activities.length - 1 ? lastActivityElementRef : null}
          onClick={() => {
            router.push(`/hobby-list/hobby-details-page?id=${activity.id}`);
          }}
          className="rounded-2xl border-[1px] border-black/20 w-full max-w-sm mx-auto bg-white relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          {/* Image Section */}
          <div className="relative">
            <Image
              src={activity.thumbnailImage ?
                `${API_BASE_URL_IMG}${activity.thumbnailImage.replace(/\\/g, '/')}` :
                ''}
              alt={activity.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
              unoptimized={true}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />

            {/* Views Count */}
            <div className="absolute top-2 left-2 bg-[#c8daeb] bg-opacity-70 rounded-full px-[11px] py-[5px] flex items-center">
              <Eye size={16} className="mr-1" />
              <span className="text-[9px]">{activity.viewCount}</span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => toggleFavorite(e, activity)}
              className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 transition-all duration-200 hover:bg-opacity-100"
            >
              {isFavorited(activity.id) ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#ff3b5c"
                  stroke="#ff3b5c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#212529"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              )}
            </button>
          </div>

          {/* Content Section */}
          <div className="p-4">
            <h2 className="text-[#212529] text-[14px] font-bold trajan-pro mb-2">{activity.title}</h2>

            <div className="w-auto h-[29px] pl-[11px] pr-[9px] pt-0.5 pb-0.5 bg-[#c8daeb] rounded-[20px] justify-center items-center gap-[5px] inline-flex">
              <Image src={'/Icons/location-pin-black.svg'} height={14} width={12} alt="pin" />
              <span className="text-[#212529] text-sm font-medium font-['Minion_Pro'] leading-[21px]">
                {activity.area} - {activity.city}
              </span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-[#212529] text-xs font-normal font-['Trajan_Pro'] flex gap-2">
                <Image src={"/Icons/user-ic.svg"} alt="user" height={14} width={14} />
                <span>{activity.ageRestrictionFrom} - {activity.ageRestrictionTo} YEARS</span>
              </span>
              <div className="flex items-center gap-2">
                <Image src={"/Icons/calender-blk.svg"} alt="user" height={14} width={14} />
                <span className="text-[#212529] text-[11.16px] font-normal font-['Trajan_Pro'] mt-[5px]">
                  SESSION {activity.sessionCountFrom}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
     
    </div>
     {/* Loading indicator at the bottom when fetching more data */}
     {loadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
            {[...Array(4)].map((_, index) => (
              <HobbyCardSkeleton key={index} />
            ))}
          </div>
      )}
    </>
  );
}