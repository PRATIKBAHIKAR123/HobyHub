"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import withAuth from "@/app/auth/withAuth";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "@/lib/apiConfigs";

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
    // Get the data from sessionStorage which was saved in hobby details page
    const savedData = sessionStorage.getItem('activityData');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.id === parseInt(activityId || '')) {
        setActivityData(data);
      }
    }
  }, [activityId]);

  if (!activityData) {
    return <div className="p-6 text-center">No Contact details available</div>;
  }

  const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "10px",
    border: "1px solid #d2dae4",
  };

  const center = { lat: parseFloat(activityData.latitute), lng: parseFloat(activityData.longitude) };

  return (
    <div className="p-6">
      <div className="justify-start text-[#1e1e1e] text-xl font-bold leading-[34px] mb-2">Contact Information</div>
      <Card className="trajan-pro rounded-2xl border-4 border-[#d2dae4] p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center justify-between">
          <div>
            <h4 className="text-black text-[12px] font-bold">Institute</h4>
            <div className="text-sm">{activityData.companyName}</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Contact</h4>
            <div className="text-sm">{activityData.tutorFirstName} {activityData.tutorLastName}</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Intro</h4>
            <div className="text-sm">{activityData.tutorIntro}</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Website</h4>
            <div className="text-sm">{activityData.website || 'Not available'}</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Email</h4>
            <div className="text-sm">{activityData.tutorEmailID}</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Phone</h4>
            <div className="text-sm">{activityData.tutorCountryCode} {activityData.tutorPhoneNo}</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Whatsapp</h4>
            <div className="text-sm">{activityData.whatsappCountryCode} {activityData.whatsappNo}</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Address</h4>
            <div className="text-sm">
              {activityData.address}, {activityData.road}, {activityData.area}, {activityData.city}, {activityData.state} - {activityData.pincode}, {activityData.country}
            </div>
          </div>
        </div>
      </Card>

      <div className="justify-start text-[#1e1e1e] text-xl font-bold leading-[34px] mb-2">Map Direction</div>
      <div>
        <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY!}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default withAuth(HobbyContactDetailsPageContent);
