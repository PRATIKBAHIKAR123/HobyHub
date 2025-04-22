"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import withAuth from "@/app/auth/withAuth";
import dynamic from 'next/dynamic';
import { Eye, Mail, Phone, Globe, MapPin, MessageSquare } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

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
}

function HobbyContactDetailsPageContent() {
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');

  useEffect(() => {
    const savedData = sessionStorage.getItem('activity');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.id === parseInt(activityId || '')) {
        setActivityData(data);
      }
    } else {
      console.warn("Activity data not found in sessionStorage");
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

  if (!activityData) {
    return <div className="p-6 text-center">Loading contact details...</div>;
  }

  const fullAddress = `${activityData.address??''}, ${activityData.road??''}, ${activityData.area??''}, ${activityData.city??''}, ${activityData.state??''} - ${activityData.pincode??''}, ${activityData.country??''}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  // Construct phone, whatsapp links safely
  const phoneUrl = `tel:${activityData.tutorCountryCode}${activityData.tutorPhoneNo}`;
  const whatsappUrl = `https://wa.me/${activityData.whatsappCountryCode}${activityData.whatsappNo}`;

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen pb-20">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
        <div className="bg-gray-200 rounded-full px-2.5 py-1 flex items-center space-x-1.5 text-xs font-medium text-gray-700 mt-1">
          <Eye size={14} className="text-gray-600" />
          <span>{activityData.viewCount} views</span>
        </div>
      </div>
      <Card className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Institute</p>
              <p className="text-lg font-semibold text-gray-900">{activityData?.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Contact Person</p>
              <p className="text-lg text-gray-800">{activityData?.tutorFirstName} {activityData?.tutorLastName}</p>
            </div>
            <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-600 mb-1">Intro</p>
                <p className="text-base text-gray-700 leading-relaxed">{activityData?.tutorIntro}</p>
            </div>
          </div>
          <div className="space-y-5">
            {activityData.website && (
              <a href={activityData?.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-base text-blue-700 hover:underline break-all">
                <Globe size={18} className="text-blue-600 flex-shrink-0" />
                <span>{activityData?.website}</span>
              </a>
            )}
            <a href={`mailto:${activityData?.tutorEmailID}`} className="flex items-center space-x-3 text-base text-blue-700 hover:underline">
              <Mail size={18} className="text-blue-600 flex-shrink-0" />
              <span>{activityData?.tutorEmailID}</span>
            </a>
            <a href={phoneUrl} className="flex items-center space-x-3 text-base text-blue-700 hover:underline">
              <Phone size={18} className="text-blue-600 flex-shrink-0" />
              <span>{activityData?.tutorCountryCode} {activityData?.tutorPhoneNo}</span>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-base text-blue-700 hover:underline">
              <MessageSquare size={18} className="text-blue-600 flex-shrink-0" />
              <span>{activityData?.whatsappCountryCode} {activityData?.whatsappNo}</span>
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

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Map Location</h2>
      <MapComponent
        lat={parseFloat(activityData?.latitute??0)}
        lng={parseFloat(activityData?.longitude??0)}
        address={fullAddress}
      />

      {/* Mobile Bottom Action Bar with Custom Images - No Text, Larger Icons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-2 flex justify-around items-center md:hidden z-50">
        {/* Phone Action */}
        <a href={phoneUrl} className="p-2 text-gray-700 hover:text-blue-600">
          <Image src="/images/phone-call.png" alt="Call" width={32} height={32} />
        </a>
        {/* WhatsApp Action */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-700 hover:text-green-600">
          <Image src="/images/whatsapp.png" alt="WhatsApp" width={32} height={32} />
        </a>
        {/* Map Action */}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-700 hover:text-red-600">
          <Image src="/images/google-maps.png" alt="Direction" width={32} height={32} />
        </a>
        {/* Share Action */}
        <button onClick={handleShare} className="p-2 text-gray-700 hover:text-black">
          <Image src="/images/share.png" alt="Share" width={32} height={32} />
        </button>
      </div>
    </div>
  );
}

export default withAuth(HobbyContactDetailsPageContent);
