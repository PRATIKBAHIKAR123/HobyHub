'use client';

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { toast } from "sonner";
import PhoneInput, { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onContactSubmit: (contactData: ContactData) => Promise<void>;
  profileDetails?: {
    firstName: string;
    lastName: string;
    emailId: string;
    phoneNumber: string;
  };
}

// Define the contact data structure
export interface ContactData {
  id: string;
  tutorFirstName: string;
  tutorLastName: string;
  tutorEmailID: string;
  tutorPhoneNo: string;
  tutorCountryCode: string;
  thatsappNo: string;
  whatsappCountryCode: string;
  tutorIntro: string;
}

export default function ContactPopupScreen({ open, setOpen, onContactSubmit, profileDetails }: PopupScreenProps) {
  // State for form data
  const [formData, setFormData] = useState<ContactData>({
    id: '',
    tutorFirstName: '',
    tutorLastName: '',
    tutorEmailID: '',
    tutorPhoneNo: '',
    tutorCountryCode: '+91',
    thatsappNo: '',
    whatsappCountryCode: '+91',
    tutorIntro: '',
  });

  // State for validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for images
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [useSameNumber, setUseSameNumber] = useState(false);
  const [useProfileDetails, setUseProfileDetails] = useState(false);

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

  // Add useEffect to handle auto-filling when checkbox is checked
  useEffect(() => {
    if (useProfileDetails && profileDetails) {
      setFormData(prev => ({
        ...prev,
        tutorFirstName: profileDetails.firstName,
        tutorLastName: profileDetails.lastName,
        tutorEmailID: profileDetails.emailId,
        tutorPhoneNo: profileDetails.phoneNumber,
        thatsappNo: profileDetails.phoneNumber,
        whatsappCountryCode: '+91'
      }));
    } else if (!useProfileDetails) {
      // Clear the fields when unchecked
      setFormData(prev => ({
        ...prev,
        tutorFirstName: '',
        tutorLastName: '',
        tutorEmailID: '',
        tutorPhoneNo: '',
        thatsappNo: '',
        whatsappCountryCode: '+91'
      }));
    }
  }, [useProfileDetails, profileDetails]);

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

    if (!formData.tutorPhoneNo) {
      newErrors.tutorPhoneNo = "Phone number is required";
    } else if (formData.tutorPhoneNo.length < 8) {
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

  // Handle phone number changes
  const handlePhoneChange = (value: string, name: string, countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      [name === 'tutorPhoneNo' ? 'tutorCountryCode' : 'whatsappCountryCode']: countryCode
    }));

    // If using same number, update WhatsApp when phone changes
    if (useSameNumber && name === 'tutorPhoneNo') {
      setFormData(prev => ({
        ...prev,
        thatsappNo: value,
        whatsappCountryCode: countryCode
      }));
    }
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

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setUseSameNumber(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        thatsappNo: prev.tutorPhoneNo
      }));
    }
  };

  // Add handler for checkbox change
  const handleProfileDetailsCheckbox = (checked: boolean) => {
    setUseProfileDetails(checked);
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
        tutorPhoneNo: formData.tutorPhoneNo.trim(),
        tutorCountryCode: formData.tutorCountryCode,
        thatsappNo: formData.thatsappNo.trim() || formData.tutorPhoneNo.trim(),
        whatsappCountryCode: formData.whatsappCountryCode,
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
        tutorPhoneNo: '',
        tutorCountryCode: '+91',
        thatsappNo: '',
        whatsappCountryCode: '+91',
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
            
            {/* Add checkbox for using profile details */}
            {profileDetails && (
              <div className="flex items-center gap-2 mb-4">
                <Checkbox
                  id="useProfileDetails"
                  checked={useProfileDetails}
                  onCheckedChange={handleProfileDetailsCheckbox}
                />
                <Label htmlFor="useProfileDetails" className="text-sm text-gray-600">
                  Use same details as Profile
                </Label>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6 sm:grid sm:grid-cols-2">
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
                  disabled={useProfileDetails}
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
                  disabled={useProfileDetails}
                />
                {wasSubmitted && errors.tutorLastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.tutorLastName}</p>
                )}
              </div>

              {/* Responsive row for Email, Phone, WhatsApp on mobile only */}
              <div className="flex flex-col gap-4 sm:col-span-2">
                <div className="flex flex-row gap-2 flex-wrap sm:flex-nowrap">
                  {/* Email */}
                  <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
                    <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      name="tutorEmailID"
                      value={formData.tutorEmailID}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={`h-[52px] border-[#05244f] ${wasSubmitted && errors.tutorEmailID ? 'border-red-500' : ''}`}
                      type="email"
                      disabled={useProfileDetails}
                    />
                    {wasSubmitted && errors.tutorEmailID && (
                      <p className="text-red-500 text-sm mt-1">{errors.tutorEmailID}</p>
                    )}
                  </div>
                  {/* Phone Number */}
                  <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
                    <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <PhoneInput
                      country={'in'}
                      value={formData.tutorPhoneNo}
                      onChange={(value, country: CountryData) => handlePhoneChange(value, 'tutorPhoneNo', `+${country.dialCode}`)}
                      inputClass="!h-[52px] !pl-[60px] !w-full !border !border-[#05244f] !rounded-[6px]"
                      buttonClass="!border !border-[#05244f] !rounded-[6px]"
                      containerClass="!w-full !border !border-[#05244f] !rounded-[6px]"
                      disabled={useProfileDetails}
                      inputProps={{
                        name: 'tutorPhoneNo',
                        required: true,
                      }}
                    />
                    {wasSubmitted && errors.tutorPhoneNo && (
                      <p className="text-red-500 text-sm mt-1">{errors.tutorPhoneNo}</p>
                    )}
                  </div>
                  {/* WhatsApp Number */}
                  <div className="flex flex-col gap-2 flex-1 min-w-[150px]">
                    <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                      WhatsApp Number
                    </Label>
                    <PhoneInput
                      country={'in'}
                      value={formData.thatsappNo}
                      onChange={(value, country: CountryData) => handlePhoneChange(value, 'thatsappNo', `+${country.dialCode}`)}
                      inputClass="!h-[52px] !pl-[60px] !w-full !border !border-[#05244f] !rounded-[6px]"
                      buttonClass="!border !border-[#05244f] !rounded-[6px]"
                      containerClass="!w-full !border !border-[#05244f] !rounded-[6px]"
                      disabled={useSameNumber || useProfileDetails}
                      inputProps={{
                        name: 'thatsappNo',
                      }}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Checkbox
                        id="useSameNumber"
                        checked={useSameNumber}
                        onCheckedChange={handleCheckboxChange}
                        disabled={useProfileDetails}
                      />
                      <Label htmlFor="useSameNumber" className="text-sm text-gray-600">
                        Use same number as contact number
                      </Label>
                    </div>
                  </div>
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