"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from 'next/navigation';

const thumbnails = [
  "/images/thumb2.png",
  "/images/thumb3.png",
  "/images/thumb4.png",
  "/images/thumb5.png",
  "/images/thumb6.png",
];

interface ActivityData {
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
}

function HobbyDetailsPageSkeleton() {
  return (
    <div className="p-6">
      {/* Main Image Gallery Skeleton */}
      <div className="flex:col md:flex gap-6 mt-4">
        {/* Main Image Skeleton */}
        <div className="w-full md:w-[85%]">
          <Skeleton className="w-full h-[600px] rounded-md" />
        </div>
        {/* Thumbnail Images Skeleton */}
        <div className="md:flex md:flex-col grid grid-cols-3 w-full md:w-[14%] gap-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-[120px] md:w-45 md:h-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Title and Address Section Skeleton */}
      <div className="flex-col block md:flex md:flex-row justify-between items-center">
        <div>
          <Skeleton className="h-12 w-[500px] mt-[21px]" />
          <Skeleton className="h-6 w-[700px] mt-[10px]" />
        </div>
        <Skeleton className="h-12 w-32 rounded-[28px] mt-2" />
      </div>

      {/* Description Skeleton */}
      <div className="mt-[19px] space-y-2">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>

      {/* Info Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4 bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4]">
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-8 w-24 mx-auto" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function HobbyDetailsPageContent() {
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!activityId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.hobyhub.com/api/1/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: activityId
          })
        });
        const data = await response.json();
        const specificActivity = data.find((activity: ActivityData) => activity.id === parseInt(activityId));
        if (specificActivity) {
          setActivityData(specificActivity);
          setSelectedImage(`https://api.hobyhub.com${specificActivity.thumbnailImage.replace(/\\/g, '/')}`);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, [activityId]);

  if (isLoading) {
    return <HobbyDetailsPageSkeleton />;
  }

  if (!activityData) {
    return <div className="p-6 text-center">No activity data available</div>;
  }

  const fullAddress = `${activityData.address}, ${activityData.road}, ${activityData.area}, ${activityData.city}, ${activityData.state} - ${activityData.pincode}, ${activityData.country}`;

  return (
    <div className="p-6">
      <div className="flex:col md:flex gap-6 mt-4">
        {/* Main Image */}
        <div className="w-full md:w-[85%] bg-white">
          <div className="relative w-full h-[510px] border-[1px] border-black/20 rounded-md flex items-center justify-center">
            <Image 
              src={selectedImage} 
              alt={activityData.title} 
              width={800}
              height={557} 
              className="rounded-md object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        {/* Thumbnail Images */}
        <div className="md:flex md:flex-col grid grid-cols-3 w-full md:w-[14%] gap-2 overflow-auto h-[557px]">
          {thumbnails.map((thumb, index) => (
            <Image
              key={index}
              src={thumb}
              alt="Thumbnail"
              width={120}
              height={96}
              className="w-[120px] md:w-45 h-[96px] rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500"
              onClick={() => setSelectedImage(thumb)}
            />
          ))}
        </div>
      </div>

      <div className="flex-col block md:flex md:flex-row justify-between items-center">
        <div>
          <h1 className="text-black text-[32.60px] font-medium font-['Minion_Pro'] mt-[21px]">{activityData.title}</h1>
          <div className="justify-center text-[#929292] text-[19px] font-medium font-['Minion_Pro'] mt-[10px]">{fullAddress}</div>
        </div>
        <span className="px-[17px] bg-[#d4e1f2] max-h-12 rounded-[28px] border-[7px] content-center border-[#dfe8f2] inline-block mt-2">
          <div className="justify-left md:justify-center text-[#7a8491] text-md font-bold font-['Trajan_Pro']">
            {activityData.type}
          </div>
        </span>
      </div>

      <p className={`text-[#ababab] text-sm lg:text-md font-medium md:font-bold font-['Inter'] md:font-['Trajan_Pro'] leading-9 mt-[19px]`}>
        {activityData.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4] gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Age Restriction</h3>
          <p className="text-black text-[18px] font-bold font-['Trajan_Pro'] flex items-center justify-center gap-2">
            <Image src={'/Icons/user-details.png'} height={24} width={24} alt={''} />
            {activityData.ageRestrictionFrom} - {activityData.ageRestrictionTo} Years
          </p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4] gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Session</h3>
          <p className="text-black text-[18px] font-bold flex items-center justify-center gap-2">
            <Image src={'/Icons/Calender-ic.png'} height={24} width={24} alt={''} />
            Session {activityData.sessionCountFrom}
          </p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4] gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Location</h3>
          <p className="text-black text-[18px] font-bold flex items-center justify-center gap-2">
            {activityData.city}
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function ClassDetailsPage() {
  return (
    <Suspense fallback={<HobbyDetailsPageSkeleton />}>
      <HobbyDetailsPageContent />
    </Suspense>
  );
}
