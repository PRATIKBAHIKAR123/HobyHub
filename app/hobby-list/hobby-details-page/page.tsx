"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from 'next/navigation';
import { getActivityById, increaseActivityViewCount } from "@/services/hobbyService";
import { API_BASE_URL_1 } from "@/lib/apiConfigs";

// const thumbnails = [
//   // "/images/thumb2.png",
//   "/images/thumb3.png",
//   "/images/thumb4.png",
//   "/images/thumb5.png",
//   "/images/thumb6.png",
// ];

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
  rate: number;
  currency: string;
  address: string;
  road: string;
  area: string;
  state: string;
  city: string;
  pincode: string;
  country: string;
  longitude: string;
  latitute: string;
  purchaseMaterialIds: string;
  itemCarryText: string;
  companyName: string;
  tutorFirstName: string;
  tutorLastName: string;
  tutorEmailID: string;
  tutorCountryCode: string;
  tutorPhoneNo: string;
  whatsappCountryCode: string;
  whatsappNo: string;
  tutorIntro: string;
  website: string | null;
  profileImage: string | null;
  sinceYear: string | null;
  iconActivityType: string;
  approved: string;
  approvedDateTime: string;
  isCreatedByAdmin: string;
  createdDate: string;
  viewCount: number;
  images?: any;
  classDetails?: any;
  courseDetails?: any;
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
  //const [apiImage, setApiImage] = useState("");
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!activityId) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        let activity: ActivityData;
        activity = await getActivityById(parseInt(activityId));
        if (token) {
          sessionStorage.setItem('activityClassData', JSON.stringify(activity?.classDetails??[]));
          sessionStorage.setItem('activityCourseData', JSON.stringify(activity?.courseDetails??[]));
          sessionStorage.setItem('activity', JSON.stringify(activity));
          try {
            await increaseActivityViewCount(parseInt(activityId));
          } catch (error) {
            console.error('Error increasing view count:', error);
          }
        } else {
          const storedData = sessionStorage.getItem('activityData');
          if (storedData) {
            activity = JSON.parse(storedData);
          }
        }
      
        setActivityData(activity);

        // Handle image URL with fallback
        let imageUrl;
        if (activity.thumbnailImage) {
          try {
            const baseImageUrl = activity.thumbnailImage.startsWith('http') 
              ? activity.thumbnailImage 
              : `${API_BASE_URL_1}${activity.thumbnailImage.replace(/\\/g, '/')}`;
            
            const response = await fetch(baseImageUrl);
            if (!response.ok) {
              imageUrl = '/images/noimg.png';
            } else {
              imageUrl = baseImageUrl;
            }
          } catch {
            imageUrl = '/images/noimg.png';
          }
        } else {
          imageUrl = '/images/noimg.png';
        }
        //setApiImage(imageUrl);
        setSelectedImage(imageUrl);

        // Handle additional images
        const allImages = new Set<string>();
        
        // Always add the thumbnail image first
        allImages.add(imageUrl);

        // Add other images from the images array
        if (activity.images && activity.images.length > 0) {
          activity.images.forEach((img: any) => {
            const fullImageUrl = img.startsWith('http') 
              ? img 
              : `${API_BASE_URL_1}${img.replace(/\\/g, '/')}`;
            allImages.add(fullImageUrl);
          });
        }

        setThumbnails(Array.from(allImages));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setIsLoading(false);
        throw new Error('No activity data available');
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

  const fullAddress = `${activityData.address??''}, ${activityData.road??''}, ${activityData.area??''}, ${activityData.city??''}, ${activityData.state??''} - ${activityData.pincode??''}, ${activityData.country??''}`;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4">
        {/* Main Image */}
        <div className="w-full md:w-[85%] bg-white">
          <div className="relative w-full h-[300px] md:h-[510px] border-[1px] border-black/20 rounded-md flex items-center justify-center">
            <Image 
              src={selectedImage} 
              alt={activityData.title} 
              width={800}
              height={557} 
              className="rounded-md object-contain"
              style={{ width: '100%', height: '100%' }}
              unoptimized={true}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/noimg.png';
              }}
            />
          </div>
        </div>
        
        {/* Thumbnail Images */}
        <div className="flex md:flex-col flex-row gap-2 w-full md:w-[14%] overflow-x-auto md:overflow-y-auto md:h-[510px]">
          {thumbnails.map((thumb, index) => (
            <div 
              key={index}
              className={`relative w-[120px] h-[96px] flex-shrink-0 rounded-lg cursor-pointer border-2 ${
                selectedImage === thumb ? 'border-blue-500' : 'border-transparent'
              } hover:border-blue-500`}
              onClick={() => setSelectedImage(thumb)}
            >
              <Image
                src={thumb}
                alt="Thumbnail"
                width={120}
                height={96}
                className="rounded-lg"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                unoptimized={true}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/noimg.png';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
        <div>
          <h1 className="text-black text-2xl md:text-[32.60px] font-medium font-['Minion_Pro']">{activityData.title}</h1>
          <div className="text-[#929292] text-base md:text-[19px] font-medium font-['Minion_Pro'] mt-2">{fullAddress}</div>
        </div>
        <span className="px-4 py-2 bg-[#d4e1f2] rounded-[28px] border-[7px] border-[#dfe8f2] mt-4 md:mt-0">
          <div className="text-[#7a8491] text-sm md:text-md font-bold font-['Trajan_Pro']">
            {activityData?.type}
          </div>
        </span>
      </div>

      <p className="text-[#ababab] text-sm md:text-md font-medium md:font-bold font-['Inter'] md:font-['Trajan_Pro'] leading-7 md:leading-9 mt-6">
        {activityData.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4]">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Age Restriction</h3>
          <p className="text-black text-[18px] font-bold font-['Trajan_Pro'] flex items-center justify-center gap-2">
            <Image src={'/Icons/user-details.png'} height={24} width={24} alt={''} />
            {activityData.ageRestrictionFrom} - {activityData.ageRestrictionTo} Years
          </p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4]">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Session</h3>
          <p className="text-black text-[18px] font-bold flex items-center justify-center gap-2">
            <Image src={'/Icons/Calender-ic.png'} height={24} width={24} alt={''} />
            Session {activityData.sessionCountFrom}
          </p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4]">
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