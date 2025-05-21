"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import withAuth from "@/app/auth/withAuth";
import dynamic from 'next/dynamic';
import { Eye, Mail, Phone, Globe, MapPin, MessageSquare } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import React from "react";

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import('@/app/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
      Loading Map...
    </div>
  )
});

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
  latitude: string;
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
  classDetails?: Array<{
    title: string;
    subCategory: string;
    address: string;
    road: string;
    area: string;
    state: string;
    city: string;
    pincode: string;
    country: string;
    longitude: string;
    latitude: string;
    tutorFirstName: string;
    tutorLastName: string;
    tutorEmailID: string;
    tutorCountryCode: string;
    tutorPhoneNo: string;
    whatsappCountryCode: string;
    whatsappNo: string;
    tutorIntro: string;
  }>;
  courseDetails?: Array<{
    title: string;
    subCategory: string;
    address: string;
    road: string;
    area: string;
    state: string;
    city: string;
    pincode: string;
    country: string;
    longitude: string;
    latitude: string;
    tutorFirstName: string;
    tutorLastName: string;
    tutorEmailID: string;
    tutorCountryCode: string;
    tutorPhoneNo: string;
    whatsappCountryCode: string;
    whatsappNo: string;
    tutorIntro: string;
  }>;
}

interface HobbyContactDetailsPageContentProps {
  blurred?: boolean;
}

function HobbyContactDetailsPageContent({ blurred = false }: HobbyContactDetailsPageContentProps) {
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');

  useEffect(() => {
    const savedData = localStorage.getItem('activity');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.id === parseInt(activityId || '')) {
        setActivityData(data);
      }
    } else {
      console.warn("Activity data not found in Localstorage");
    }
  }, [activityId]);

  // Share function
  const handleShare = async () => {
    if (navigator.share && activityData) {
      try {
        await navigator.share({
          title: activityData.title,
          text: `Check out ${activityData.title} on HobyHub!`, 
          url: window.location.href, // Share the current page URL
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      // Fallback for browsers/devices that don't support Web Share API
      alert('Web Share API is not supported in your browser. You can manually copy the link.');
    }
  };

  // Helper: create a unique key for grouping (contact + location)
  const getGroupKey = (item: any) => {
    return [
      item.tutorFirstName,
      item.tutorLastName,
      item.tutorEmailID,
      item.tutorPhoneNo,
      item.address,
      item.road,
      item.area,
      item.city,
      item.state,
      item.pincode,
      item.country
    ].join("|");
  };

  // Combine and tag all details
  const allDetails: Array<any & { type: string }> = [
    ...(activityData?.classDetails?.map((c: any) => ({ ...c, type: "Class" })) || []),
    ...(activityData?.courseDetails?.map((c: any) => ({ ...c, type: "Course" })) || [])
  ];

  // Group by contact/location
  const grouped: { [key: string]: { items: any[]; data: any } } = {};
  allDetails.forEach((item) => {
    const key = getGroupKey(item);
    if (!grouped[key]) {
      grouped[key] = { items: [], data: item };
    }
    grouped[key].items.push(item);
  });

  // Update renderContactCard to accept a list of items
  const renderContactCard = (groupItems: any[], data: any) => {
    const fullAddress = `${data.address??''}, ${data.road??''}, ${data.area??''}, ${data.city??''}, ${data.state??''} - ${data.pincode??''}, ${data.country??''}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    const phoneUrl = `tel:${data.tutorCountryCode}${data.tutorPhoneNo}`;
    const whatsappUrl = `https://wa.me/${data.whatsappCountryCode}${data.whatsappNo}`;
    // Compose label
    const label = groupItems.map(i => `${i.type}: ${i.title}`).join(", ");
    const categories = groupItems.map(i => i.subCategory).filter(Boolean).join(", ");
    return (
      <Card key={label} className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">For: {label}</h3>
          {categories && <p className="text-sm text-gray-600 mt-1">Category: {categories}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Institute</p>
              <p className="text-lg font-semibold text-gray-900">{data?.companyName || activityData?.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Contact Person</p>
              <p className="text-lg text-gray-800">{data?.tutorFirstName} {data?.tutorLastName}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600 mb-1">Intro</p>
              <p className="text-base text-gray-700 leading-relaxed">{data?.tutorIntro}</p>
            </div>
          </div>
          <div className="space-y-5">
            {data.website && (
              <a href={data?.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-base text-blue-700 hover:underline break-all">
                <Globe size={18} className="text-blue-600 flex-shrink-0" />
                <span>{data?.website}</span>
              </a>
            )}
            <a href={`mailto:${data?.tutorEmailID}`} className="flex items-center space-x-3 text-base text-blue-700 hover:underline">
              <Mail size={18} className="text-blue-600 flex-shrink-0" />
              <span>{data?.tutorEmailID}</span>
            </a>
            <a href={phoneUrl} className="flex items-center space-x-3 text-base text-blue-700 hover:underline">
              <Phone size={18} className="text-blue-600 flex-shrink-0" />
              <span>{data?.tutorCountryCode} {data?.tutorPhoneNo}</span>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-base text-blue-700 hover:underline">
              <MessageSquare size={18} className="text-blue-600 flex-shrink-0" />
              <span>{data?.whatsappCountryCode} {data?.whatsappNo}</span>
            </a>
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-base text-gray-800 leading-relaxed">
                  {fullAddress}
                </p>
                <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-700 hover:underline mt-1 inline-block">
                  Get Direction
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderMapSection = (groupItems: any[], data: any) => {
    const fullAddress = `${data.address??''}, ${data.road??''}, ${data.area??''}, ${data.city??''}, ${data.state??''} - ${data.pincode??''}, ${data.country??''}`;
    const label = groupItems.map(i => `${i.type}: ${i.title}`).join(", ");
    const categories = groupItems.map(i => i.subCategory).filter(Boolean).join(", ");
    return (
      <div key={label + "-map"} className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Location for: {label}</h2>
          {categories && <p className="text-sm text-gray-600 mt-1">Category: {categories}</p>}
        </div>
        <MapComponent
          lat={parseFloat(data?.latitude??0)}
          lng={parseFloat(data?.longitude??0)}
          address={fullAddress}
        />
      </div>
    );
  };

  if (!activityData) {
    return <div className="p-6 text-center">Loading contact details...</div>;
  }

  const fullAddress = `${activityData.address??''}, ${activityData.road??''}, ${activityData.area??''}, ${activityData.city??''}, ${activityData.state??''} - ${activityData.pincode??''}, ${activityData.country??''}`;

  return (
    <div
      className={`relative p-6 bg-gray-100/60 min-h-screen pb-20 ${blurred ? 'pointer-events-none select-none transition-all duration-300' : 'transition-all duration-300'
        }`}
      style={blurred ? { filter: 'blur(1px)' } : {}}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
        <div className="bg-gray-200 rounded-full px-2.5 py-1 flex items-center space-x-1.5 text-xs font-medium text-gray-700 mt-1">
          <Eye size={14} className="text-gray-600" />
          <span>{activityData.viewCount} views</span>
        </div>
      </div>

      {/* Render grouped contact cards */}
      {Object.values(grouped).length > 0 ? (
        Object.values(grouped).map((group, idx) => (
          <React.Fragment key={idx}>
            {renderContactCard(group.items, group.data)}
            {renderMapSection(group.items, group.data)}
          </React.Fragment>
        ))
      ) : (
        <>
          {renderContactCard([activityData], activityData)}
          {renderMapSection([activityData], activityData)}
        </>
      )}

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-2 flex justify-around items-center md:hidden z-50">
        <a href={`tel:${activityData.tutorCountryCode}${activityData.tutorPhoneNo}`} className="p-2 text-gray-700 hover:text-blue-600">
          <Image src="/images/phone-call.png" alt="Call" width={32} height={32} />
        </a>
        <a href={`https://wa.me/${activityData.whatsappCountryCode}${activityData.whatsappNo}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-700 hover:text-green-600">
          <Image src="/images/whatsapp.png" alt="WhatsApp" width={32} height={32} />
        </a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-700 hover:text-red-600">
          <Image src="/images/google-maps.png" alt="Direction" width={32} height={32} />
        </a>
        <button onClick={handleShare} className="p-2 text-gray-700 hover:text-black">
          <Image src="/images/share.png" alt="Share" width={32} height={32} />
        </button>
      </div>
    </div>
  );
}

export default withAuth(function Page() {
  return <HobbyContactDetailsPageContent />;
});
