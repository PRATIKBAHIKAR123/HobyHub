"use client"

import Image from "next/image";
import {  Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const hobbies = [
  { id:1, title: "Arihant Reiki Vedic Healing", img: "/images/yoga.jpeg", address: "Raviwar Peth - Pune" },
  { id:2, title: "Art & Craft Workshop", img: "/images/art-style.jpg", address: "Raviwar Peth - Pune" },
  { id:3, title: "Cooking Class", img: "/images/cooking-workshop.jpeg", address: "Raviwar Peth - Pune" },
  { id:11, title: "Cosmic Art Academy", img: "/images/cosmic.jpeg", address: "Raviwar Peth - Pune" },
  { id:4, title: "Arihant Reiki Vedic Healing", img: "/images/yoga.jpeg", address: "Raviwar Peth - Pune" },
  { id:5, title: "Art & Craft Workshop", img: "/images/yoga.jpeg", address: "Raviwar Peth - Pune" },
  { id:6, title: "Cooking Class", img: "/images/cooking-workshop.jpeg", address: "Raviwar Peth - Pune" },
  { id:12, title: "Cosmic Art Academy", img: "/images/cosmic.jpeg", address: "Raviwar Peth - Pune" },
  { id:7, title: "Arihant Reiki Vedic Healing", img: "/images/yoga.jpeg", address: "Raviwar Peth - Pune" },
  { id:8, title: "Art & Craft Workshop", img: "/images/yoga.jpeg", address: "Raviwar Peth - Pune" },
  { id:9, title: "Cooking Class", img: "/images/group-dance.png", address: "Raviwar Peth - Pune" },
  { id:10, title: "Cosmic Art Academy", img: "/images/cosmic.jpeg", address: "Raviwar Peth - Pune" },
];


export default function HobbyGrid() {
      const router = useRouter();
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6">
        {hobbies.map((hobby) => (
        <div key={hobby.id} onClick={() => router.push("hobby-list/hobby-details-page")} className="rounded-2xl border-[1px] border-black/20 w-full max-w-sm mx-auto bg-white relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
        {/* Image Section */}
        <div className="relative">
          <img key={hobby.id}
            src={hobby.img} // Replace with your image path
            alt={hobby.title} className="h-[250px] w-full rounded-tl-2xl rounded-tr-2xl object-cover"
          />
          <div className="absolute top-2 left-2  bg-[#c8daeb] bg-opacity-70 rounded-full px-[11px] py-[5px] flex items-center">
            <Eye size={16} className="mr-1" />
            <span className="text-[9px]">88</span>
          </div>
        </div>
  
        {/* Content Section */}
        <div className="p-4">
          <h2 className="text-[#212529] text-[14px] font-bold trajan-pro mb-2">{hobby.title}</h2>
  
          <div className="w-auto h-[29px] pl-[11px] pr-[9px] pt-0.5 pb-0.5 bg-[#c8daeb] rounded-[20px] justify-center items-center gap-[5px] inline-flex">
            <Image src={'/Icons/location-pin-black.svg'} height={14} width={12} alt="pin"/>
            <span  className=" text-[#212529] text-sm font-medium font-['Minion_Pro'] leading-[21px]">{hobby.address}</span>
          </div>
  
          <div className="flex justify-between items-center mt-3">
            <span className="text-[#212529] text-xs font-normal font-['Trajan_Pro'] flex gap-2 "><Image src={"/Icons/user-ic.svg"} alt="user" height={14} width={14}/><span>10 - 70 YEARS</span></span>
            <div className="flex items-center gap-2">
            <Image src={"/Icons/calender-blk.svg"} alt="user" height={14} width={14}/>
              <span className="text-[#212529] text-[11.16px] font-normal font-['Trajan_Pro'] mt-[5px]">SESSION 25</span>
            </div>
          </div>
        </div>
      </div>
      ))}
      </div>
    );
  }
