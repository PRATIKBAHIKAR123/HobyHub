'use client';

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { toast } from "sonner";

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onContactSubmit: (contactData: ContactData) => Promise<void>;
}

// Define the contact data structure
export interface ContactData {
  id: string;
  tutorFirstName: string;
  tutorLastName: string;
  tutorEmailID: string;
  tutorCountryCode: string;
  tutorPhoneNo: string;
  whatsappCountryCode: string;
  thatsappNo: string;
  tutorIntro: string;
}

export default function ContactPopupScreen({ open, setOpen, onContactSubmit }: PopupScreenProps) {
  // State for form data
  const [formData, setFormData] = useState<ContactData>({
    id: '',
    tutorFirstName: '',
    tutorLastName: '',
    tutorEmailID: '',
    tutorCountryCode: '',
    tutorPhoneNo: '',
    whatsappCountryCode: '',
    thatsappNo: '',
    tutorIntro: '',
  });

  // State for validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for images
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const certificationRef = useRef<HTMLInputElement>(null);

  // Generate unique ID when form opens
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        id: Date.now().toString()
      }));
      // Reset form validation state when reopened
      setErrors({});
      setWasSubmitted(false);
      setIsSubmitting(false);
    }
  }, [open]);

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check required fields
    if (!formData.tutorFirstName.trim()) {
      newErrors.tutorFirstName = "First name is required";
    }

    if (!formData.tutorLastName.trim()) {
      newErrors.tutorLastName = "Last name is required";
    }

    if (!formData.tutorPhoneNo.trim()) {
      newErrors.tutorPhoneNo = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.tutorPhoneNo.replace(/\D/g, ''))) {
      newErrors.tutorPhoneNo = "Please enter a valid phone number";
    }

    if (!formData.tutorEmailID.trim()) {
      newErrors.tutorEmailID = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.tutorEmailID)) {
      newErrors.tutorEmailID = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle regular input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setWasSubmitted(true);
      setIsSubmitting(true);

      if (!validateForm()) {
        return; // Don't submit if validation fails
      }

      // Prepare contact data
      const contactData = {
        ...formData,
        id: Date.now().toString(),
        // Ensure all required fields are present
        tutorFirstName: formData.tutorFirstName.trim(),
        tutorLastName: formData.tutorLastName.trim(),
        tutorEmailID: formData.tutorEmailID.trim(),
        tutorCountryCode: formData.tutorCountryCode.trim() || '+91',
        tutorPhoneNo: formData.tutorPhoneNo.trim(),
        whatsappCountryCode: formData.whatsappCountryCode.trim() || '+91',
        thatsappNo: formData.thatsappNo.trim() || formData.tutorPhoneNo.trim(),
        tutorIntro: formData.tutorIntro.trim() || '',
        contactType: {
          primary: true,
          secondary: false,
          billing: false
        }
      };

      // Proceed with form submission
      await onContactSubmit(contactData);

      // Reset form and close dialog
      setFormData({
        id: '',
        tutorFirstName: '',
        tutorLastName: '',
        tutorEmailID: '',
        tutorCountryCode: '',
        tutorPhoneNo: '',
        whatsappCountryCode: '',
        thatsappNo: '',
        tutorIntro: '',
      });
      setImages([]);
      setOpen(false);
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast.error('Failed to save contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload with error handling
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
        const newImages = files.map((file) => URL.createObjectURL(file as Blob));
        setImages(prev => [...prev, ...newImages]);

        // Set the first image as profile photo
        setFormData(prev => ({
          ...prev,
          profilePhoto: newImages[0]
        }));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle error appropriately
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-[#003161] opacity-50 fixed inset-0" />

      <DialogContent className="bg-white p-6 min-w-[90%] rounded-xl overflow-y-auto max-h-[90vh] mx-auto text-center">
        <div className="grid grid-cols-1 gap-6 items-center">
          {/* Form Section */}
          <div className="bg-white p-4 w-full">
            <div className="relative justify-start text-start text-[#05244f] text-2xl font-medium font-['Minion_Pro'] mb-4">
              Contact Details
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="tutorFirstName"
                  value={formData.tutorFirstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.tutorFirstName ? 'border-red-500' : ''}`}
                />
                {wasSubmitted && errors.tutorFirstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.tutorFirstName}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="tutorLastName"
                  value={formData.tutorLastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.tutorLastName ? 'border-red-500' : ''}`}
                />
                {wasSubmitted && errors.tutorLastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.tutorLastName}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="tutorEmailID"
                  value={formData.tutorEmailID}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.tutorEmailID ? 'border-red-500' : ''}`}
                />
                {wasSubmitted && errors.tutorEmailID && (
                  <p className="text-red-500 text-sm mt-1">{errors.tutorEmailID}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    name="tutorCountryCode"
                    value={formData.tutorCountryCode}
                    onChange={handleInputChange}
                    placeholder="+91"
                    className="h-[52px] border-[#05244f] w-20"
                  />
                  <Input
                    name="tutorPhoneNo"
                    value={formData.tutorPhoneNo}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className={`h-[52px] border-[#05244f] flex-1 ${wasSubmitted && errors.tutorPhoneNo ? 'border-red-500' : ''}`}
                  />
                </div>
                {wasSubmitted && errors.tutorPhoneNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.tutorPhoneNo}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                  WhatsApp Number
                </Label>
                <div className="flex gap-2">
                  <Input
                    name="whatsappCountryCode"
                    value={formData.whatsappCountryCode}
                    onChange={handleInputChange}
                    placeholder="+91"
                    className="h-[52px] border-[#05244f] w-20"
                  />
                  <Input
                    name="thatsappNo"
                    value={formData.thatsappNo}
                    onChange={handleInputChange}
                    placeholder="WhatsApp Number"
                    className="h-[52px] border-[#05244f] flex-1"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                  Introduction
                </Label>
                <Textarea
                  name="tutorIntro"
                  value={formData.tutorIntro}
                  onChange={handleInputChange}
                  placeholder="Write a brief introduction about yourself"
                  className="h-[100px] border-[#05244f]"
                />
              </div>
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

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => setOpen(false)}
            className="bg-white text-[#05244f] border border-[#05244f] hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#05244f] text-white hover:bg-[#05244f]/90"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}