'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PopupScreen from "./addInfoPopupScreen";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LocationPopupScreen from "./locationSelection";
import ContactPopupScreen from "./contactSelection";
import { DirectoryTable } from "./directoryList";
import { SelectGroup } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerVendor } from "@/services/vendorService";
import { Check, CircleCheckBig } from "lucide-react";
import * as yup from "yup";

// Personal details form schema
const personalDetailsSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required("Confirm password is required"),
  gender: yup.string().required("Gender is required"),
});

// Institute details form schema
const instituteDetailsSchema = yup.object().shape({
  programTitle: yup.string().required("Program title is required"),
  instituteName: yup.string().required("Institute name is required"),
  since: yup.string(),
  gstNo: yup.string(),
  introduction: yup.string(),
});

// Additional info form schema
const additionalInfoSchema = yup.object().shape({
  websiteName: yup.string(),
  classLevel: yup.string(),
  instagramAccount: yup.string(),
  youtubeAccount: yup.string(),
});

// Class details form schema
const classDetailsSchema = yup.object().shape({
  className: yup.string().required("Class name is required"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string(),
  location: yup.string().required("Location is required"),
  contact: yup.string().required("Contact is required"),
  time: yup.string().required("Time is required"),
  gender: yup.string(),
  age: yup.string(),
  classSize: yup.string(), // Added classSize to the schema
  instituteName: yup.string(), // Added instituteName to the schema
  experienceLevel: yup.string(), // Added experienceLevel to the schema
});

export default function RegistrationForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClassFields, setShowClassFields] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("item-0");
  const [completedSections, setCompletedSections] = useState({
    personalDetails: false,
    instituteDetails: false,
    additionalInfo: false,
    classDetails: false
  });

  // Form for personal details
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    setValue: setValuePersonal,
    watch: watchPersonal,
    formState: { errors: errorsPersonal },
    reset: resetPersonal,
  } = useForm({
    resolver: yupResolver(personalDetailsSchema),
    mode: "onChange",
  });

  // Form for institute details
  const {
    register: registerInstitute,
    handleSubmit: handleSubmitInstitute,
    setValue: setValueInstitute,
    formState: { errors: errorsInstitute },
    reset: resetInstitute,
  } = useForm({
    resolver: yupResolver(instituteDetailsSchema),
    mode: "onChange",
  });

  // Form for additional info
  const {
    register: registerAdditional,
    handleSubmit: handleSubmitAdditional,
    setValue: setValueAdditional,
    formState: { errors: errorsAdditional },
    reset: resetAdditional,
  } = useForm({
    resolver: yupResolver(additionalInfoSchema),
    mode: "onChange",
  });

  // Form for class details
  const {
    register: registerClass,
    handleSubmit: handleSubmitClass,
    setValue: setValueClass,
    formState: { errors: errorsClass },
    reset: resetClass,
  } = useForm({
    resolver: yupResolver(classDetailsSchema),
    mode: "onChange",
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    // Load personal details
    const savedPersonalDetails = localStorage.getItem('personalDetails');
    if (savedPersonalDetails) {
      const personalData = JSON.parse(savedPersonalDetails);
      Object.keys(personalData).forEach((key) => {
        setValuePersonal(key as keyof typeof personalDetailsSchema.fields, personalData[key]);
      });
      setCompletedSections(prev => ({...prev, personalDetails: true}));
    }

    // Load institute details
    const savedInstituteDetails = localStorage.getItem('instituteDetails');
    if (savedInstituteDetails) {
      const instituteData = JSON.parse(savedInstituteDetails);
      Object.keys(instituteData).forEach((key) => {
        setValueInstitute(key as keyof typeof instituteDetailsSchema.fields, instituteData[key]);
      });
      setCompletedSections(prev => ({...prev, instituteDetails: true}));
    }

    // Load additional info
    const savedAdditionalInfo = localStorage.getItem('additionalInfo');
    if (savedAdditionalInfo) {
      const additionalData = JSON.parse(savedAdditionalInfo);
      Object.keys(additionalData).forEach((key) => {
        setValueAdditional(key as keyof typeof additionalInfoSchema.fields, additionalData[key]);
      });
      setCompletedSections(prev => ({...prev, additionalInfo: true}));
    }

    // Load class details
    const savedClassDetails = localStorage.getItem('classDetails');
    if (savedClassDetails) {
      const classData = JSON.parse(savedClassDetails);
      Object.keys(classData).forEach((key) => {
        setValueClass(key as keyof typeof classDetailsSchema.fields, classData[key]);
      });
      setShowClassFields(true);
      setCompletedSections(prev => ({...prev, classDetails: true}));
    }

    // Load saved images
    const savedImages = localStorage.getItem('images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, [setValuePersonal, setValueInstitute, setValueAdditional, setValueClass]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((event.target as HTMLInputElement)?.files || []);
    const newImages = files.map((file) => URL.createObjectURL(file as Blob));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    
    // Save images to localStorage
    localStorage.setItem('images', JSON.stringify(updatedImages));
  };

  // Save personal details to localStorage and proceed to the next section
  const savePersonalDetails = (data: any) => {
    localStorage.setItem('personalDetails', JSON.stringify(data));
    setCompletedSections(prev => ({...prev, personalDetails: true}));
    setActiveAccordion("item-1");
    toast.success("Personal details saved successfully!");
  };

  // Save institute details to localStorage and proceed to the next section
  const saveInstituteDetails = (data: any) => {
    // Save images data with institute details
    const instituteData = {
      ...data,
      images: images
    };
    localStorage.setItem('instituteDetails', JSON.stringify(instituteData));
    setCompletedSections(prev => ({...prev, instituteDetails: true}));
    toast.success("Institute details saved successfully!");
  };

  // Save additional info to localStorage
  const saveAdditionalInfo = (data: any) => {
    localStorage.setItem('additionalInfo', JSON.stringify(data));
    setCompletedSections(prev => ({...prev, additionalInfo: true}));
    toast.success("Additional information saved successfully!");
  };

  // Save class details to localStorage
  const saveClassDetails = (data: any) => {
    localStorage.setItem('classDetails', JSON.stringify(data));
    setCompletedSections(prev => ({...prev, classDetails: true}));
    toast.success("Class details saved successfully!");
  };

  // Final form submission - gather all data and submit to API
  const handleFinalSubmit = async () => {
    setIsLoading(true);

    try {
      // Get all data from localStorage
      const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
      const instituteDetails = JSON.parse(localStorage.getItem('instituteDetails') || '{}');
      const additionalInfo = JSON.parse(localStorage.getItem('additionalInfo') || '{}');
      const classDetails = JSON.parse(localStorage.getItem('classDetails') || '{}');

      // Combine all data
      const formData = {
        ...personalDetails,
        ...instituteDetails,
        ...additionalInfo,
        ...(showClassFields ? classDetails : {})
      };

      // Submit to API
      const response = await registerVendor(formData);

      if (response.status === 200) {
        toast.success("Registration successful!");
        
        // Clear localStorage after successful submission
        localStorage.removeItem('personalDetails');
        localStorage.removeItem('instituteDetails');
        localStorage.removeItem('additionalInfo');
        localStorage.removeItem('classDetails');
        localStorage.removeItem('images');
        
        // Redirect to login page
        router.push("/auth/login");
      } else {
        toast.error(String(response.data));
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto p-6">
        <h2 className="text-[#05244f] text-[30px] font-medium text-center font-['Minion_Pro']">Registration Form</h2>
        <p className="text-center text-[#a3a4a4] text-[14.90px] font-bold trajan-pro py-3">
          Add details about your Institute with high-quality photos and class details
          <span className="text-red-500 text-sm mt-1 float-right">* Required Fields</span>
        </p>
        
        <Accordion 
          type="single" 
          value={activeAccordion} 
          onValueChange={setActiveAccordion} 
          collapsible
        >
          {/* Personal Details Section */}
          <AccordionItem value="item-0">
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger>
                <div className="text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center">
                  Personal Details
                  {completedSections.personalDetails && <CircleCheckBig className="text-[#46a758] ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form onSubmit={handleSubmitPersonal(savePersonalDetails)}>
                  <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Full Name<span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="Full Name" 
                        {...registerPersonal("name")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                      {errorsPersonal.name && (
                        <p className="text-red-500 text-xs">{errorsPersonal.name.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Mobile<span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="Mobile" 
                        maxLength={10} 
                        {...registerPersonal("phoneNumber")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                      {errorsPersonal.phoneNumber && (
                        <p className="text-red-500 text-xs">{errorsPersonal.phoneNumber.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="Email" 
                        {...registerPersonal("emailId")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                      {errorsPersonal.emailId && (
                        <p className="text-red-500 text-xs">{errorsPersonal.emailId.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Password<span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        type="password"
                        placeholder="Password" 
                        {...registerPersonal("password")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                      {errorsPersonal.password && (
                        <p className="text-red-500 text-xs">{errorsPersonal.password.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Confirm Password<span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        type="password"
                        placeholder="Confirm Password" 
                        {...registerPersonal("confirmPassword")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                      {errorsPersonal.confirmPassword && (
                        <p className="text-red-500 text-xs">{errorsPersonal.confirmPassword.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Gender<span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        onValueChange={(value) => setValuePersonal("gender", value)} 
                        defaultValue={watchPersonal("gender")}
                      >
                        <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errorsPersonal.gender && (
                        <p className="text-red-500 text-xs">{errorsPersonal.gender.message}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="my-4 w-20% app-bg-color text-white float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Next"}
                  </Button>
                </form>
              </AccordionContent>
            </div>
          </AccordionItem>

          {/* Institute Details Section */}
          <AccordionItem value="item-1">
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger>
                <div className="text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center">
                  Institute Details
                  {completedSections.instituteDetails && <CircleCheckBig className="text-[#46a758] ml-2"/>}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form onSubmit={handleSubmitInstitute(saveInstituteDetails)}>
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Program Title<span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="Program Title" 
                        {...registerInstitute("programTitle")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                      {errorsInstitute.programTitle && (
                        <p className="text-red-500 text-xs">{errorsInstitute.programTitle.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Institute Name<span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="Institute Name" 
                        {...registerInstitute("instituteName")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                      {errorsInstitute.instituteName && (
                        <p className="text-red-500 text-xs">{errorsInstitute.instituteName.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Since</Label>
                      <Input 
                        placeholder="Since" 
                        {...registerInstitute("since")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">GST No</Label>
                      <Input 
                        placeholder="GST No." 
                        {...registerInstitute("gstNo")} 
                        className="h-[52px] border-[#05244f]" 
                      />
                    </div>
                  </div>

                  <div className="mb-6 mt-[50px]">
                    <h3 className="text-[#05244f] trajan-pro text-md font-semibold">Photos</h3>
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 rounded-[10px]">
                        {images.map((src, index) => (
                          <Image 
                            key={index} 
                            src={src} 
                            alt="Uploaded" 
                            width={158} 
                            height={158} 
                            className="rounded-md h-[158px] w-[158px]" 
                          />
                        ))}
                      </div>
                    )}
                    <div
                      className="h-[180px] flex flex-col gap-3 justify-center items-center py-4 my-3 rounded-[15px] border border-dashed border-[#05244f] cursor-pointer p-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex justify-center">
                        <Image src={"/Icons/file-upload.svg"} alt="file-upload" height={45} width={59} />
                      </div>
                      <div className="text-center text-[#acacac] trajan-pro text-[11.6px] font-medium">
                        Drag your file(s) to start uploading
                      </div>
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

                  <div className="flex flex-col gap-2 mb-6">
                    <Label className="w-[177px] text-black text-[11.6px] font-semibold">Introduction</Label>
                    <Textarea 
                      placeholder="Introduction" 
                      rows={5} 
                      {...registerInstitute("introduction")} 
                      className="rounded-[15px] h-[120px] border-[#05244f]" 
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    {/* <Button 
                      type="button" 
                      onClick={() => setActiveAccordion("item-0")} 
                      className="border-[#05244f] text-[#05244f]"
                      variant="outline"
                    >
                      Clear
                    </Button> */}
                    <Button 
                      type="submit" 
                      className="app-bg-color text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save and Continue"}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </div>
          </AccordionItem>
        

        {/* Additional Information Section */}
        <AccordionItem value="item-2">
        <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
        <AccordionTrigger>
          <div className="text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center">
            Additional information
            {completedSections.additionalInfo && <CircleCheckBig className="text-[#46a758] ml-2"/>}
          </div>
          </AccordionTrigger>
          <AccordionContent>
          <form onSubmit={handleSubmitAdditional(saveAdditionalInfo)}>
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Website Name</Label>
                <Input 
                  placeholder="Website Name" 
                  {...registerAdditional("websiteName")} 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Class Level</Label>
                <Input 
                  placeholder="Class Level" 
                  {...registerAdditional("classLevel")} 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Instagram Account</Label>
                <Input 
                  placeholder="Instagram Account" 
                  {...registerAdditional("instagramAccount")} 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">YouTube Account</Label>
                <Input 
                  placeholder="YouTube Account" 
                  {...registerAdditional("youtubeAccount")} 
                  className="h-[52px] border-[#05244f]" 
                />
              </div>
              
            </div>
            <Button 
              type="submit" 
              className="my-4 app-bg-color text-white float-right"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Additional Info"}
            </Button>
          </form>
          </AccordionContent>
        </div>
        </AccordionItem>
        </Accordion>
        {/* Class Details Button */}
        <Button 
          variant="outline" 
          className="border-[#05244f] mt-4" 
          onClick={() => setIsOpen(true)}
        >
          + Add Class Details
        </Button>
        
        <PopupScreen 
          open={isOpen} 
          setOpen={setIsOpen} 
          setShowClassFields={setShowClassFields} 
        />
        
        {/* Class Details Section */}
        {showClassFields && (
          <div className="bg-white rounded-[15px] border border-[#05244f] py-2 px-8 my-4">
            <div className="text-[#05244f] text-md font-bold my-4 trajan-pro flex items-center">
              Class Details
              {completedSections.classDetails && <CircleCheckBig className="text-[#46a758] ml-2"/>}
            </div>
            <form onSubmit={handleSubmitClass(saveClassDetails)}>
              <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Class Name<span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    placeholder="Class Name" 
                    {...registerClass("className")} 
                    className="h-[52px] border-[#05244f]" 
                  />
                  {errorsClass.className && (
                    <p className="text-red-500 text-xs">{errorsClass.className.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Category<span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    placeholder="Category" 
                    {...registerClass("category")} 
                    className="h-[52px] border-[#05244f]" 
                  />
                  {errorsClass.category && (
                    <p className="text-red-500 text-xs">{errorsClass.category.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">Sub Category</Label>
                  <Select onValueChange={(value) => setValueClass("subCategory", value)}>
                    <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                      <SelectValue placeholder="Sub Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subCategory1">Sub Category 1</SelectItem>
                      <SelectItem value="subCategory2">Sub Category 2</SelectItem>
                      <SelectItem value="subCategory3">Sub Category 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Location<span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => setValueClass("location", value)}>
                    <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Nashik">Nashik</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <div className="p-2 border-t border-gray-200">
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          onClick={() => setIsLocationPopupOpen(true)}
                        >
                          + Add New Location
                        </Button>
                      </div>
                    </SelectContent>
                  </Select>
                  {errorsClass.location && (
                    <p className="text-red-500 text-xs">{errorsClass.location.message}</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Contact<span className="text-red-500">*
                    </span>
                  </Label>
                  <Select onValueChange={(value) => setValueClass("contact", value)}>
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
                        <Button 
                          className="w-full" 
                          variant="outline" 
                          onClick={() => setIsContactPopupOpen(true)}
                        >
                          + Add Contact
                        </Button>
                      </div>
                    </SelectContent>
                  </Select>
                  {errorsClass.contact && (
                    <p className="text-red-500 text-xs">{errorsClass.contact.message}</p>
                  )}
                </div>
                
                <LocationPopupScreen open={isLocationPopupOpen} setOpen={setIsLocationPopupOpen} />
                <ContactPopupScreen open={isContactPopupOpen} setOpen={setIsContactPopupOpen} />

                
              
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

                
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                    Time<span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => setValueClass("time", value)}>
                    <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorsClass.time && (
                    <p className="text-red-500 text-xs">{errorsClass.time.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 border border-[#05244f] rounded-md">
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
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">Class Size</Label>
                  <Select onValueChange={(value) => setValueClass("classSize", value)}>
                    <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                      <SelectValue placeholder="Class Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-5)</SelectItem>
                      <SelectItem value="medium">Medium (6-15)</SelectItem>
                      <SelectItem value="large">Large (16+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 p-2 border border-[#05244f] rounded-md">
              <div className="text-[#05244f] text-md font-bold my-4 trajan-pro flex items-center">
              Course criteria 
            </div>
              <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">Gender</Label>
                  <Select onValueChange={(value) => setValueClass("gender", value)}>
                    <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">Age</Label>
                  <Select onValueChange={(value) => setValueClass("age", value)}>
                    <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                      <SelectValue placeholder="Age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Years</SelectItem>
                      <SelectItem value="15">15 Years</SelectItem>
                      <SelectItem value="18">18+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="w-[177px] text-black text-[11.6px] font-semibold">Prior Knowledge</Label>
                  <Select onValueChange={(value) => setValueClass("experienceLevel", value)}>
                    <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                      <SelectValue placeholder="Prior Knowledge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                </div>
                
              </div>
              
              <Button 
                type="submit" 
                className="my-4 app-bg-color text-white flex justify-end"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Class Details"}
              </Button>
            </form>
          </div>
        )}

        {/* Directory Section */}
        <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
          <div className="text-[#05244f] text-md trajan-pro font-bold my-4">Directory</div>
          <div className="bg-[#fcfcfd] rounded-[15px] outline-1 outline-offset-[-1px] p-4 outline-black">
            <DirectoryTable />
          </div>
        </div>

        {/* Final Submit Button */}
        <Button 
          onClick={handleFinalSubmit} 
          className="my-4 w-20% app-bg-color text-white float-right"
          disabled={isLoading || !completedSections.personalDetails}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </>
  );
}

// Types
interface FormData {
  name: string;
  emailId: string;
  phoneNumber: string;
  gender?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
  programTitle?: string;
  instituteName?: string;
  since?: string;
  gstNo?: string;
  introduction?: string;
  websiteName?: string;
  classLevel?: string;
  instagramAccount?: string;
  youtubeAccount?: string;
  className?: string;
  category?: string;
  subCategory?: string;
  location?: string;
  contact?: string;
  time?: string;
  experienceLevel?: string;
  classSize?: string;
  age?: string;
}