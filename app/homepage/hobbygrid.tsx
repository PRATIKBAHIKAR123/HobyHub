"use client"

import Image from "next/image";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllActivities } from "@/services/hobbyService";

interface Activity {
  id: number;
  vendorId: number;
  type: string;
  categoryId: number;
  subCategoryId: string;
  title: string;
  description: string;
}

export default function HobbyGrid() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getAllActivities();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading activities...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          onClick={() => router.push("hobby-list/hobby-details-page")} 
          className="rounded-2xl border-[1px] border-black/20 w-full max-w-sm mx-auto bg-white relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          {/* Image Section */}
          <div className="relative">
            <img
              src="/images/yoga.jpeg" // Static image for now
              alt={activity.title} 
              className="h-[250px] w-full rounded-tl-2xl rounded-tr-2xl object-cover"
            />
            <div className="absolute top-2 left-2 bg-[#c8daeb] bg-opacity-70 rounded-full px-[11px] py-[5px] flex items-center">
              <Eye size={16} className="mr-1" />
              <span className="text-[9px]">88</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            <h2 className="text-[#212529] text-[14px] font-bold trajan-pro mb-2">{activity.title}</h2>

            <div className="w-auto h-[29px] pl-[11px] pr-[9px] pt-0.5 pb-0.5 bg-[#c8daeb] rounded-[20px] justify-center items-center gap-[5px] inline-flex">
              <Image src={'/Icons/location-pin-black.svg'} height={14} width={12} alt="pin"/>
              { /* <span className="text-[#212529] text-sm font-medium font-['Minion_Pro'] leading-[21px]">
                {activity.description}
              </span>*/}
              <span className="text-[#212529] text-sm font-medium font-['Minion_Pro'] leading-[21px]">
                Reviwar Peth - Pune
              </span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-[#212529] text-xs font-normal font-['Trajan_Pro'] flex gap-2">
                <Image src={"/Icons/user-ic.svg"} alt="user" height={14} width={14}/>
                <span>10 - 70 YEARS</span>
              </span>
              <div className="flex items-center gap-2">
                <Image src={"/Icons/calender-blk.svg"} alt="user" height={14} width={14}/>
                <span className="text-[#212529] text-[11.16px] font-normal font-['Trajan_Pro'] mt-[5px]">
                  SESSION 25
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
