'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PopupScreen from "./addInfoPopupScreen";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import LocationPopupScreen from "./locationSelection";
import ContactPopupScreen from "./contactSelection";
import { DirectoryTable } from "./directoryList";
import { SelectGroup } from "@radix-ui/react-select";

export default function RegistrationForm() {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClassFields, setShowClassFields] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((event.target as HTMLInputElement)?.files || []);
    const newImages = files.map((file) => URL.createObjectURL(file as Blob));
    setImages([...images, ...newImages]);
  };

  return (
    <>
      {/* <VendorNavbar /> */}
      <div className="mx-auto p-6">
        <h2 className="text-[#05244f] text-[30px] font-medium text-center font-['Minion_Pro']">Registration Form</h2>
        <p className="text-center text-[#a3a4a4] text-[14.90px] font-bold trajan-pro py-3">Add details about your Institute with high-quality photos and class details</p>

        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1" >
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger><div className="text-[#05244f] text-md trajan-pro font-bold mb-2">Institute Details</div></AccordionTrigger>
              <AccordionContent>
                <div  >
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Program Title</Label>
                      <Input placeholder="Program Title" className="h-[52px] border-[#05244f]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Institute Name</Label>
                      <Input placeholder="Institute Name" className="h-[52px] border-[#05244f]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Since</Label>
                      <Input placeholder="Since" className="h-[52px] border-[#05244f]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">GST No</Label>
                      <Input placeholder="GST No." className="h-[52px] border-[#05244f]" />
                    </div>
                  </div>



                  <div className="mb-6 mt-[50px]">
                    <h3 className="text-[#05244f] trajan-pro  text-md font-semibold">Photos</h3>
                    {images.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 rounded-[10px]">
                      {images.map((src, index) => (
                        <Image key={index} src={src} alt="Uploaded" width={158} height={158} className="rounded-md h-[158px] w-[158x] md:w-[224px] h-[224px]" />
                      ))}
                    </div>)}
                    <div
                      className="h-[180px] flex flex-col gap-3 justify-center items-center py-4 my-3 rounded-[15px] border border-dashed border-[#05244f] cursor-pointer p-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {/* Top - Upload Icon */}
                      <div className="flex justify-center">
                        <Image src={"/Icons/file-upload.svg"} alt="file-upload" height={45} width={59} />
                      </div>

                      {/* Middle - Text */}
                      <div className="text-center text-[#acacac] trajan-pro text-[11.6px] font-medium">
                        Drag your file(s) to start uploading
                      </div>

                      {/* Bottom - Browse Button */}
                      <div>
                        <Button variant="outline" className="">Browse File</Button>
                      </div>

                      <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                    </div>

                    <div className="relative justify-center text-[#cecece] text-[11.6px] font-medium">Only support ipg. ,png and.av9 and zip %es</div>
                  </div>

                  <Textarea placeholder="Introduction" rows={5} className="rounded-[15px] h-[120px] mb-6 border-[#05244f]" />
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>


        <div className="bg-white rounded-[15px] border border-[#05244f] py-2 px-8  my-4" >
          <div className="text-[#05244f] text-md font-bold my-4 trajan-pro">Additional information</div>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">Website Name</Label>
              <Input placeholder="Website Name" className="h-[52px] border-[#05244f]" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">Class Level</Label>
              <Input placeholder="Class Level" className="h-[52px] border-[#05244f]" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">Instagram Account</Label>
              <Input placeholder="Instagram Account" className="h-[52px] border-[#05244f]" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">YouTube Account</Label>
              <Input placeholder="YouTube Account" className="h-[52px] border-[#05244f]" />
            </div>
          </div>
        </div>
        <Button variant="outline" className="border-[#05244f] mt-4" onClick={() => setIsOpen(true)}>+ Add Class Details</Button>
        <PopupScreen open={isOpen} setOpen={setIsOpen} setShowClassFields={setShowClassFields} />
        {showClassFields && (<>

          <div className="bg-white rounded-[15px] border border-[#05244f] py-2 px-8 my-4" >
            <div className="text-[#05244f] text-md font-bold my-4 trajan-pro">Class Details</div>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Class Name</Label>
                <Input placeholder="Class Name" className="h-[52px] border-[#05244f]" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Category</Label>
                <Input placeholder="Category" className="h-[52px] border-[#05244f]" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Sub Category</Label>
                <Select>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sub Category</SelectItem>
                    <SelectItem value="light">Sub Category</SelectItem>
                    <SelectItem value="light">Sub Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Location</Label>
                <Select>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Pune</SelectItem>
                    <SelectItem value="dark">Nashik</SelectItem>
                    <SelectItem value="system">Mumbai</SelectItem>
                    <div className="p-2 border-t border-gray-200">
      <Button className="w-full" variant="outline" onClick={() => setIsLocationPopupOpen(true)}>+ Add New Location</Button>
    </div>
                  </SelectContent>
                  {/* <SelectIcon><Image src={'Icons/location-pin-black.svg'} onClick={() => setIsLocationPopupOpen(true)} height={24} alt="" width={24}/></SelectIcon> */}
                </Select>
                <LocationPopupScreen open={isLocationPopupOpen} setOpen={setIsLocationPopupOpen} />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Contact</Label>
                {/* <Input placeholder="Contact"  className="h-[52px] border-[#05244f]" /> */}
                <Select>
                  
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Contact" />
                  </SelectTrigger>
                  <SelectContent>
    <SelectGroup>
      <SelectItem value="contact1">Contact 1</SelectItem>
      <SelectItem value="contact2">Contact 2</SelectItem>
      <SelectItem value="contact3">Contact 3</SelectItem>
    </SelectGroup>
    <div className="p-2 border-t border-gray-200">
      <Button className="w-full" variant="outline" onClick={() => setIsContactPopupOpen(true)}>+ Add Contact</Button>
    </div>
  </SelectContent>
                </Select>
              </div>
              <ContactPopupScreen open={isContactPopupOpen} setOpen={setIsContactPopupOpen} />
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Time</Label>
                <Select>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Time</SelectItem>
                    <SelectItem value="dark">Time</SelectItem>
                    <SelectItem value="system">Time</SelectItem>
                  </SelectContent>
                </Select>

              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Weekday Selection</Label>
                <div className="grid grid-cols-2 gap-2 p-2 border border-[#05244f] rounded-md">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="monday" className="h-4 w-4 border-[#05244f]" />
                    <label htmlFor="monday" className="text-sm">Monday</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="tuesday" className="h-4 w-4 border-[#05244f]" />
                    <label htmlFor="tuesday" className="text-sm">Tuesday</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="wednesday" className="h-4 w-4 border-[#05244f]" />
                    <label htmlFor="wednesday" className="text-sm">Wednesday</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="thursday" className="h-4 w-4 border-[#05244f]" />
                    <label htmlFor="thursday" className="text-sm">Thursday</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="friday" className="h-4 w-4 border-[#05244f]" />
                    <label htmlFor="friday" className="text-sm">Friday</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="saturday" className="h-4 w-4 border-[#05244f]" />
                    <label htmlFor="saturday" className="text-sm">Saturday</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sunday" className="h-4 w-4 border-[#05244f]" />
                    <label htmlFor="sunday" className="text-sm">Sunday</label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">No. of Sessions</Label>
                <Input type="number" min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Cost Range</Label>
                <Select>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Select Cost Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1000">₹0 - ₹1,000</SelectItem>
                    <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                    <SelectItem value="2000-3000">₹2,000 - ₹3,000</SelectItem>
                    <SelectItem value="3000-4000">₹3,000 - ₹4,000</SelectItem>
                    <SelectItem value="4000-5000">₹4,000 - ₹5,000</SelectItem>
                    <SelectItem value="5000+">₹5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Gender</Label>
                <Select>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Male</SelectItem>
                    <SelectItem value="dark">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Age</Label>
                <Select>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">12 Years</SelectItem>
                    <SelectItem value="dark">15 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div></>
        )}

        <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
          <div className="text-[#05244f] text-md trajan-pro font-bold my-4 ">Directory</div>
          <div className="bg-[#fcfcfd] rounded-[15px] outline-1 outline-offset-[-1px] p-4 outline-black">
            <DirectoryTable />
          </div>
        </div>
        <Button className="my-4 w-20% app-bg-color text-white float-right">
          Submit
        </Button>
      </div>
    </>
  );
}
