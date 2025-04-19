"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from 'next/navigation';
import { getActivityById, increaseActivityViewCount } from "@/services/hobbyService";
import { API_BASE_URL_1 } from "@/lib/apiConfigs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const [isLoading, setIsLoading] = useState(true);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [apiImage, setApiImage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [carouselApi, setCarouselApi] = useState<any>(null);

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
          sessionStorage.setItem('activityClassData', JSON.stringify(activity.classDetails));
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
        let imageUrl: string | null = null;
        if (activity.thumbnailImage) {
          try {
            const baseImageUrl = activity.thumbnailImage.startsWith('http') 
              ? activity.thumbnailImage 
              : `${API_BASE_URL_1}${activity.thumbnailImage.replace(/\\/g, '/')}`;
            
            const response = await fetch(baseImageUrl);
            if (!response.ok) {
              throw new Error('Image not found');
            }
            imageUrl = baseImageUrl;
          } catch {
            throw new Error('Image not found');
          }
        } else {
          throw new Error('No thumbnail image available');
        }
        setApiImage(imageUrl);

        // Handle additional images
        if (activity.images) {
          const uniqueThumbnails = new Set<string>();
          activity.images.forEach((img: any) => {
            if (!img) return; // Skip empty image URLs
            
            const fullImageUrl = img.startsWith('http') 
              ? img 
              : `${API_BASE_URL_1}${img.replace(/\\/g, '/')}`;
            
            if (activity.thumbnailImage && 
                fullImageUrl === `${API_BASE_URL_1}${activity.thumbnailImage.replace(/\\/g, '/')}`) {
              return;
            }
            uniqueThumbnails.add(fullImageUrl);
          });
          setThumbnails(Array.from(uniqueThumbnails));
        }
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

  const allImages = apiImage ? [apiImage, ...thumbnails] : thumbnails;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Main Image Carousel */}
        <div className="w-full md:w-[85%]">
          {allImages.length > 0 ? (
            <Carousel
              setApi={setCarouselApi}
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {allImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full h-[510px] border-[1px] border-black/20 rounded-md flex items-center justify-center bg-gray-100">
                      <Image
                        src={image}
                        alt={`${activityData.title} - Image ${index + 1}`}
                        width={800}
                        height={510}
                        className="rounded-md object-contain"
                        style={{ width: '100%', height: '100%' }}
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          ) : (
            <div className="relative w-full h-[510px] border-[1px] border-black/20 rounded-md flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">No images available</div>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {allImages.length > 0 && (
          <div className="w-full md:w-[14%]">
            {/* Mobile View - Horizontal Carousel */}
            <div className="md:hidden">
              <Carousel
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                  dragFree: true,
                }}
              >
                <CarouselContent className="flex gap-2">
                  {allImages.map((image, index) => (
                    <CarouselItem key={index} className="basis-[120px]">
                      <div 
                        className={`relative w-[120px] h-[96px] rounded-lg cursor-pointer border-2 ${
                          carouselApi?.selectedScrollSnap() === index ? 'border-blue-500' : 'border-transparent'
                        } hover:border-blue-500`}
                        onClick={() => carouselApi?.scrollTo(index)}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          width={120}
                          height={96}
                          className="rounded-lg object-cover"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Desktop View - Vertical Grid */}
            <div className="hidden md:flex md:flex-col gap-2 overflow-auto h-[510px]">
              {allImages.map((image, index) => (
                <div 
                  key={index}
                  className={`relative w-full h-[96px] rounded-lg cursor-pointer border-2 ${
                    carouselApi?.selectedScrollSnap() === index ? 'border-blue-500' : 'border-transparent'
                  } hover:border-blue-500`}
                  onClick={() => carouselApi?.scrollTo(index)}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={120}
                    height={96}
                    className="rounded-lg object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-col block md:flex md:flex-row justify-between items-center">
        <div>
          <h1 className="text-black text-[32.60px] font-medium font-['Minion_Pro'] mt-[21px]">{activityData.title}</h1>
          <div className="justify-center text-[#929292] text-[19px] font-medium font-['Minion_Pro'] mt-[10px]">{activityData.address}, {activityData.road}, {activityData.area}, {activityData.city}, {activityData.state} - {activityData.pincode}, {activityData.country}</div>
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
        {/* <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4] gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Rate</h3>
          <p className="text-black text-[18px] font-bold flex items-center justify-center gap-2">
            {activityData.currency} {activityData.rate}
          </p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4] gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Tutor</h3>
          <p className="text-black text-[18px] font-bold flex items-center justify-center gap-2">
            {activityData.tutorFirstName} {activityData.tutorLastName}
          </p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4] gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Contact</h3>
          <p className="text-black text-[18px] font-bold flex items-center justify-center gap-2">
            {activityData.tutorCountryCode} {activityData.tutorPhoneNo}
          </p>
        </Card> */}
      </div>

      {/* Additional Information Section */}
      {/* <div className="mt-8 p-6 bg-white rounded-2xl border-[1px] border-black/20">
        <h2 className="text-black text-xl font-bold mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-black font-semibold mb-2">Items to Carry</h3>
            <p className="text-gray-600">{activityData.itemCarryText}</p>
          </div>
          <div>
            <h3 className="text-black font-semibold mb-2">Tutor Introduction</h3>
            <p className="text-gray-600">{activityData.tutorIntro}</p>
          </div>
          <div>
            <h3 className="text-black font-semibold mb-2">Company Name</h3>
            <p className="text-gray-600">{activityData.companyName}</p>
          </div>
          <div>
            <h3 className="text-black font-semibold mb-2">Activity Type</h3>
            <p className="text-gray-600">{activityData.iconActivityType}</p>
          </div>
        </div>
      </div> */}
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