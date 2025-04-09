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



function HobbyContactDetailsPageContent() {
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');

  useEffect(() => {
    const fetchActivityData = async () => {
      if (!activityId) {
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
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchActivityData();
  }, [activityId]);


  if (!activityData) {
    return <div className="p-6 text-center">No Contact details available</div>;
  }

  // const fullAddress = `${activityData.address}, ${activityData.road}, ${activityData.area}, ${activityData.city}, ${activityData.state} - ${activityData.pincode}, ${activityData.country}`;

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
            <h4 className="text-black text-[12px] font-bold  ">Institute</h4>
            <div className="text-sm">Federation of Kangleicha Martial Arts Head Branch</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold  ">HH ID</h4>
            <div className="text-sm">HH124</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold  ">Contact</h4>
            <div className="text-sm">Dr. Sameer Shaikh</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Intro</h4>
            <div className="text-sm">Dr. Sameer Ismail Shaikh, a 7th-degree black belt and MA in Physical Education, leads the academy with 40 teachers, 5 senior instructors, and several junior instructors. Under his expert guidance, students receive top-tier martial arts training</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Website</h4>
            <div className="text-sm">https://www.fkmaindia.com/</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Email</h4>
            <div className="text-sm">samsunshooters.lucky@yahoo.co.in</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Phone</h4>
            <div className="text-sm">+91 9823186187</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Whatsapp</h4>
            <div className="text-sm">+91 9823186187</div>
          </div>
          <div>
            <h4 className="text-black text-[12px] font-bold">Address</h4>
            <div className="text-sm">Tilak ayurvedic college hostel campus, Rasta Peth, Rasta Peth, Pune - 411001, Maharashtra, India</div>
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

export default  withAuth(HobbyContactDetailsPageContent);
