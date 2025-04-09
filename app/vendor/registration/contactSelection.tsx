import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onContactSubmit: (contactData: ContactData) => void;
}

// Define the contact data structure
export interface ContactData {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
  contactType: {
    primary: boolean;
    secondary: boolean;
    billing: boolean;
  };
  experience: string;
  certifications: File | null;
  email: string;
  introduction: string;
  profilePhoto: string | null;
}

export default function ContactPopupScreen({ open, setOpen, onContactSubmit }: PopupScreenProps) {
  // State for form data
  const [formData, setFormData] = useState<ContactData>({
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    whatsappNumber: '',
    contactType: {
      primary: false,
      secondary: false,
      billing: false,
    },
    experience: '',
    certifications: null,
    email: '',
    introduction: '',
    profilePhoto: null,
  });

  // State for images
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certificationRef = useRef<HTMLInputElement>(null);
  
  // Generate unique ID when form opens
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        id: Date.now().toString()
      }));
    }
  }, [open]);

  // Handle regular input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (value: boolean, type: 'primary' | 'secondary' | 'billing') => {
    setFormData(prev => ({
      ...prev,
      contactType: {
        ...prev.contactType,
        [type]: value
      }
    }));
  };

  // Handle certification upload
  const handleCertificationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      certifications: file
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newImages = files.map((file) => URL.createObjectURL(file as Blob));
      setImages([...images, ...newImages]);
      
      // Set the first image as profile photo
      setFormData(prev => ({
        ...prev,
        profilePhoto: newImages[0]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Here you would typically validate the form data before submission
    onContactSubmit(formData);
    
    // Reset form and close dialog
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      whatsappNumber: '',
      contactType: {
        primary: false,
        secondary: false,
        billing: false,
      },
      experience: '',
      certifications: null,
      email: '',
      introduction: '',
      profilePhoto: null,
    });
    setImages([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-[#003161] opacity-50 fixed inset-0" />
      
      <DialogContent className="bg-white p-6 min-w-[90%] rounded-xl overflow-y-scroll max-h-[90%] mx-auto text-center">
        <div className="grid grid-cols-1 gap-6 items-center">
          {/* Form Section */}
          <div className="bg-white p-4 w-full">
            <div className="relative justify-start text-start text-[#05244f] text-2xl font-medium font-['Minion_Pro'] mb-4">
              Contact Details
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">First Name</Label>
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Last Name</Label>
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Phone Number</Label>
                <Input 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Phone No." 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Whatsapp Number</Label>
                <Input 
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Whatsapp Number" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="terms" className="border-black"/>
                <Label className="w-[177px] text-black text-[11.6px] font-semibold" htmlFor="terms">Please update below</Label>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="primary" 
                    className="border-black"
                    checked={formData.contactType.primary}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'primary')}
                  />
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold" htmlFor="primary">Primary</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="secondary" 
                    className="border-black"
                    checked={formData.contactType.secondary}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'secondary')}
                  />
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold" htmlFor="secondary">Secondary</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="billing" 
                    className="border-black"
                    checked={formData.contactType.billing}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'billing')}
                  />
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold" htmlFor="billing">Billing</Label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Experience</Label>
                <Input 
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Enter in years" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Certifications</Label>
                <Input 
                  ref={certificationRef}
                  type="file" 
                  onChange={handleCertificationUpload}
                  placeholder="Click to upload (.pdf, .jpg, .png)" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Email Address</Label>
                <Input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address" 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">Contact Introduction</Label>
              <Textarea 
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                placeholder="Contact Introduction" 
                rows={8} 
                className="border-[#05244f] h-[90px]" 
              />
            </div>
            <div className="mb-6 mt-[50px] w-full">
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 my-4 rounded-[10px]">
                  {images.map((src, index) => (
                    <Image key={index} src={src} alt="Uploaded" width={224} height={224} className="rounded-md" />
                  ))}
                </div>
              )}
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">Profile photo</Label>
              <div
                className="h-[222px] flex flex-col justify-between items-center py-4 my-3 rounded-[15px] border border-[#05244f] cursor-pointer p-4"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Top - Upload Icon */}
                <div className="flex justify-center">
                  <Image src="/Icons/file-upload.svg" alt="file-upload" height={45} width={59} />
                </div>

                {/* Middle - Text */}
                <div className="text-center text-[#acacac] text-[11.6px] font-medium">
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

              <div className="relative justify-center text-[#cecece] text-[11.6px] font-medium">
                Only support jpg, png and avif files
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="mt-4">
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSubmit} 
            className="bg-[#05244F] mt-4 text-white"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}