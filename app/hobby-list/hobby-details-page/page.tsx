"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";

const thumbnails = [
  "/images/thumb2.png",
  "/images/thumb3.png",
  "/images/thumb4.png",
  "/images/thumb5.png",
  "/images/thumb6.png",
];


export default function ClassDetailsPage() {
  const [selectedImage, setSelectedImage] = useState("/images/main.png");

  return (
    <>
    <div className="p-6">
      

      <div className="flex:col md:flex gap-6 mt-4">
        {/* Main Image */}
        <div className="w-full md:w-[85%]">
            <Image src={selectedImage} alt="Class" width={800}
              height={600} className="w-full  max-h-128 rounded-md" />
        </div>
        {/* Thumbnail Images */}
        <div className="md:flex md:flex-col grid grid-cols-3 w-full md:w-[14%] gap-2 overflow-auto">
          {thumbnails.map((thumb, index) => (
            <img
              key={index}
              src={thumb}
              alt="Thumbnail"
              className="w-[120px] md:w-45 md:h-24 mt-[2px] rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500"
              onClick={() => setSelectedImage(thumb)}
            />
          ))}
        </div>
      </div>

      <div className="flex-col block md:flex md:flex-row justify-between items-center">
        <div>
        <h1 className="text-black text-[32.60px] font-medium font-['Minion_Pro'] mt-[21px]">Arihant Reiki Vedic Healing</h1>
        <div className="justify-center text-[#929292] text-[19px] font-medium font-['Minion_Pro'] mt-[10px]">212 Rale5e Peth Road , Raviwar Pe1h, Pune - 4l1oc2. Mahar1shtr1, indis</div>
        </div>
        <span className="px-[17px] bg-[#d4e1f2] max-h-12 rounded-[28px] border-[7px] content-center border-[#dfe8f2] inline-block mt-2">
          <div className="justify-left md:justify-center text-[#7a8491] text-md font-bold font-['Trajan_Pro']">
            Since 2001
          </div>
        </span>
        
      </div>
      <p className={`text-[#ababab] text-sm lg:text-md font-medium  md:font-bold  font-['Inter'] md:font-['Trajan_Pro'] leading-9 mt-[19px]`}>
      Welcome 1o Arilain! Re hi Vedkc Hpaing and Yoga, founded in 2ool,We spetalire in Molilic welhiess theough Reiki, Vedicbealing, and yopa offering bath horte vhits ond online sessions loikored to your needs , Qur eeperierced prechbipners guide youon o tronafcrmat ys lourzey, promatizd physical, srnotiona , and spirituel welHbeing , Wrcther vou sscs stread reket, balonce , or depar islf-waareneci, Arihazt provicoi a nurerrg o 1shonnent to help you schkw harrony in your itu.
        </p>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4] gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Age Restriction</h3>
          <p className="text-black text-[18px] font-bold font-['Trajan_Pro'] flex items-center justify-center gap-2"><Image src={'/Icons/user-details.png'} height={24} width={24} alt={''} />10 - 70 Years</p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4]  gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Session</h3>
          <p className="text-black text-[18px] font-bold flex items-center justify-center gap-2"><Image src={'/Icons/Calender-ic.png'} height={24} width={24} alt={''} />Session 25</p>
        </Card>
        <Card className="p-4 text-center bg-[#d3e1f1]/95 rounded-2xl border-4 border-[#d2dae4]  gap-0">
          <h3 className="text-black text-lg font-normal font-['Trajan_Pro']">Rate</h3>
          
            <span className="text-black text-[18px] font-bold">₹ 2,999</span>
          
        </Card>
      </div>
    </div>
    </>
    
  );
}
