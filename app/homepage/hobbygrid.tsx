"use client"

import Image from "next/image";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllActivities } from "@/services/hobbyService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMode } from "@/contexts/ModeContext";
import { useSortFilter } from "@/contexts/SortFilterContext";
import { useFilter } from "@/contexts/FilterContext";

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
  latitute: string;
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
  const { isOnline } = useMode();
  const { sortFilter } = useSortFilter();
  const { priceRange, gender, age, time, areFiltersApplied, filterUpdateTrigger, categoryFilter } = useFilter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        const data = await getAllActivities({
          catId: categoryFilter.catId,
          subCatId: categoryFilter.subCatId,
          mode: isOnline ? "online" : "offline",
          sortFilter: sortFilter,
          location: "",
          age: areFiltersApplied ? parseInt(age) : 0,
          type: "",
          time: areFiltersApplied ? time : "",
          gender: areFiltersApplied ? gender : "",
          priceFrom: areFiltersApplied ? priceRange[0] : 0,
          priceTo: areFiltersApplied ? priceRange[1] : 0
        });
        setActivities(data as Activity[]);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [isOnline, sortFilter, filterUpdateTrigger, categoryFilter, age, areFiltersApplied, gender, priceRange, time]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
        {[...Array(8)].map((_, index) => (
          <HobbyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          onClick={() => {
            // Store the activity data in sessionStorage before navigation
            sessionStorage.setItem('activityData', JSON.stringify(activity));
            router.push(`/hobby-list/hobby-details-page?id=${activity.id}`);
          }} 
          className="rounded-2xl border-[1px] border-black/20 w-full max-w-sm mx-auto bg-white relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          {/* Image Section */}
          <div className="relative">
            <Image
              src={activity.thumbnailImage ? 
                `https://api.hobyhub.com${activity.thumbnailImage.replace(/\\/g, '/')}` : 
                '/images/noimg.png'}
              alt={activity.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
              // onError={(e) => {
              //   const target = e.target as HTMLImageElement;
              //   target.src = '/images/noimg.png';
              // }}
            />
            <div className="absolute top-2 left-2 bg-[#c8daeb] bg-opacity-70 rounded-full px-[11px] py-[5px] flex items-center">
              <Eye size={16} className="mr-1" />
              <span className="text-[9px]">{activity.viewCount}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            <h2 className="text-[#212529] text-[14px] font-bold trajan-pro mb-2">{activity.title}</h2>

            <div className="w-auto h-[29px] pl-[11px] pr-[9px] pt-0.5 pb-0.5 bg-[#c8daeb] rounded-[20px] justify-center items-center gap-[5px] inline-flex">
              <Image src={'/Icons/location-pin-black.svg'} height={14} width={12} alt="pin"/>
              <span className="text-[#212529] text-sm font-medium font-['Minion_Pro'] leading-[21px]">
                {activity.area} - {activity.city}
              </span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-[#212529] text-xs font-normal font-['Trajan_Pro'] flex gap-2">
                <Image src={"/Icons/user-ic.svg"} alt="user" height={14} width={14}/>
                <span>{activity.ageRestrictionFrom} - {activity.ageRestrictionTo} YEARS</span>
              </span>
              <div className="flex items-center gap-2">
                <Image src={"/Icons/calender-blk.svg"} alt="user" height={14} width={14}/>
                <span className="text-[#212529] text-[11.16px] font-normal font-['Trajan_Pro'] mt-[5px]">
                  SESSION {activity.sessionCountFrom}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
