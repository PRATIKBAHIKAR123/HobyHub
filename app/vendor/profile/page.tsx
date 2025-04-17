"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Camera, ImageIcon, BookOpen, Users, Image as ImageIcon2, Info } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getClassList, getCourseList, getImageList } from "@/services/vendorService";
import AddClassPopup from "./addClassPopup";
import AddCoursePopup from "./addCoursePopup";

interface ProfileData {
  email: string;
  joinedDate: string;
  phoneNumber: string;
  location: string;
  name: string;
  profession: string;
  profileImage: string;
  id?: number;
  gender?: string;
  // Additional fields from registration
  instituteName?: string;
  programTitle?: string;
  gstNo?: string;
  introduction?: string;
  websiteName?: string;
  classLevel?: string;
  instagramAccount?: string;
  youtubeAccount?: string;
  // New fields for expanded sections
  classList?: ClassItem[];
  courseList?: ClassItem[];
  galleryImages?: GalleryImage[];
}

export interface ClassItem {
  vendorId: number;
  activityId: number;
  subCategoryID: string;
  timingsFrom: string;
  timingsTo: string;
  day: string;
  type: string;
  ageFrom: number;
  ageTo: number;
  sessionFrom: number;
  sessionTo: number;
  gender: string;
  price: number;
  fromPrice: number | null;
  toPrice: number | null;
  createdDate: string; // ISO date string
  modifiedDate: string; // ISO date string
  id: number;
  title: string;
}


interface GalleryImage {
  id: number;
  url: string;
  title: string;
  date: string;
}

interface DeletePopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
}

interface PhotoOptionsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

function DeletePopup({ open, setOpen, onDelete }: DeletePopupProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[400px] p-6">
        <div className="flex flex-col items-center">
          {/* Delete Icon */}
          <div className="">
            <Image 
              src="/images/delete.png" 
              alt="Delete" 
              width={60} 
              height={60}
              priority
            />
          </div>

          {/* Title */}
          <h2 className="text-[24px] font-medium text-center mb-2">
            Delete Photo
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete your profile photo?
          </p>

          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-[#05244f] text-[#05244f] hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex-1 bg-[#05244f] text-white hover:bg-[#03162f]"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PhotoOptionsDialog({ open, setOpen, onDelete, setProfile }: PhotoOptionsDialogProps) {
  const handleGalleryClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        // Create a URL for the selected file
        const fileUrl = URL.createObjectURL(target.files[0]);
        // Here you would typically upload the file to your server
        // For now, we'll just update the profile image with the local URL
        setProfile((prev) => ({
          ...prev,
          profileImage: fileUrl
        }));
        setOpen(false);
      }
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[300px] p-0">
        <div className="flex flex-col">
          <button 
            onClick={handleGalleryClick}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 w-full text-left"
          >
            <ImageIcon className="h-5 w-5 text-gray-600" />
            <span>Choose from Gallery</span>
          </button>
          <button 
            onClick={handleGalleryClick}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 w-full text-left border-t"
          >
            <Camera className="h-5 w-5 text-gray-600" />
            <span>Take Photo</span>
          </button>
          <button 
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 w-full text-left border-t text-red-500"
          >
            <Trash2 className="h-5 w-5" />
            <span>Remove Photo</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    email: "",
    joinedDate: "",
    phoneNumber: "",
    location: "",
    name: "",
    profession: "",
    profileImage: "/images/thumb5.png",
    instituteName: "",
    programTitle: "",
    gstNo: "",
    introduction: "",
    websiteName: "",
    classLevel: "",
    instagramAccount: "",
    youtubeAccount: "",
    classList: [],
    courseList: [],
    galleryImages: []
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    profession?: string;
    instituteName?: string;
    programTitle?: string;
  }>({});

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPhotoOptionsOpen, setIsPhotoOptionsOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isCourseOpen, setIsCourseOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = () => {
      try {
        setIsLoading(true);
        
        // Get data from local storage
        const personalDetails = localStorage.getItem("personalDetails");
        const instituteDetails = localStorage.getItem("instituteDetails");
        const additionalInfo = localStorage.getItem("additionalInfo");
        
        let profileData: ProfileData = {
          email: "",
          joinedDate: "",
          phoneNumber: "",
          location: "",
          name: "",
          profession: "",
          profileImage: "/images/thumb5.png",
          instituteName: "",
          programTitle: "",
          gstNo: "",
          introduction: "",
          websiteName: "",
          classLevel: "",
          instagramAccount: "",
          youtubeAccount: "",
          // Mock data for classes
          // classList: [
          //   { id: 1, title: "Beginner's Yoga", ageFrom: 15, day: "Mon, Wed 5-6 PM", status: "Active" },
          //   { id: 2, title: "Advanced Meditation", students: 8, schedule: "Tue, Thu 7-8 PM", status: "Active" },
          //   { id: 3, title: "Morning Fitness", students: 12, schedule: "Mon-Fri 6-7 AM", status: "Inactive" },
          //   { id: 4, title: "Weekend Workshop", students: 20, schedule: "Sat 10-12 AM", status: "Active" }
          // ],
          // // Mock data for courses
          // courseList: [
          //   { id: 1, title: "Yoga for Beginners", duration: "8 weeks", level: "Beginner", enrollments: 25, image: "/images/course1.jpg" },
          //   { id: 2, title: "Advanced Meditation Techniques", duration: "4 weeks", level: "Advanced", enrollments: 15, image: "/images/course2.jpg" },
          //   { id: 3, title: "Fitness Fundamentals", duration: "12 weeks", level: "Intermediate", enrollments: 30, image: "/images/course3.jpg" }
          // ],
          // Mock data for gallery
          galleryImages: [
            { id: 1, url: "/images/no image available.jpg", title: "Annual Retreat", date: "May 15, 2024" },
            { id: 2, url: "/images/no image available.jpg", title: "Outdoor Class", date: "June 3, 2024" },
            { id: 3, url: "/images/no image available.jpg", title: "Community Event", date: "July 10, 2024" },
            { id: 4, url: "/images/no image available.jpg", title: "Workshop Session", date: "August 22, 2024" }
          ]
        };
        
        // Parse personal details
        if (personalDetails) {
          const data = JSON.parse(personalDetails);
          profileData = {
            ...profileData,
            id: data.id || 0,
            email: data.emailId || "",
            joinedDate: data.joinedDate || new Date().toLocaleDateString(),
            phoneNumber: data.phoneNumber || "",
            location: data.location || "Pune",
            name: data.name || "",
            profession: data.profession || "",
            profileImage: data.profileImage || "/images/thumb5.png",
            gender: data.gender || ""
          };
        }
        
        // Parse institute details
        if (instituteDetails) {
          const data = JSON.parse(instituteDetails);
          profileData = {
            ...profileData,
            programTitle: data.programTitle || "",
            instituteName: data.instituteName || "",
            gstNo: data.gstNo || "",
            introduction: data.introduction || ""
          };
        }
        
        // Parse additional info
        if (additionalInfo) {
          const data = JSON.parse(additionalInfo);
          profileData = {
            ...profileData,
            websiteName: data.websiteName || "",
            classLevel: data.classLevel || "",
            instagramAccount: data.instagramAccount || "",
            youtubeAccount: data.youtubeAccount || ""
          };
        }
        
        setProfile(profileData);
        setError(null);
      } catch (err) {
        setError("Failed to load profile data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeletePhoto = () => {
    setProfile(prev => ({
      ...prev,
      profileImage: "/images/thumb5.png"
    }));
    setIsDeleteOpen(false);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      // Split data into different sections as per registration form
      const personalData = {
        id: profile.id,
        name: profile.name,
        emailId: profile.email,
        phoneNumber: profile.phoneNumber,
        gender: profile.gender,
        location: profile.location,
        profession: profile.profession,
        profileImage: profile.profileImage
      };

      const instituteData = {
        programTitle: profile.programTitle,
        instituteName: profile.instituteName,
        gstNo: profile.gstNo,
        introduction: profile.introduction
      };

      const additionalData = {
        websiteName: profile.websiteName,
        classLevel: profile.classLevel,
        instagramAccount: profile.instagramAccount,
        youtubeAccount: profile.youtubeAccount
      };

      // Update local storage
      localStorage.setItem("personalDetails", JSON.stringify(personalData));
      localStorage.setItem("instituteDetails", JSON.stringify(instituteData));
      localStorage.setItem("additionalInfo", JSON.stringify(additionalData));
      
      // Additional data would be saved here
      // For demo purposes, we're not saving the mock class/course/gallery data
      
      setIsEditing(false);
      setError(null);
      setValidationErrors({}); // Clear validation errors on successful update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if(activeTab==='profile'){
    
    }else if(activeTab==='classes'){
      // Fetch classes data if needed
      getClasses();
    }else if(activeTab==='courses'){
      getCourses();
    }
    else if(activeTab==='gallery'){
      getImages();
    }
  },[activeTab]);

  const getClasses= async ()=>{
      const data = await getClassList();
      setProfile(prev => ({
        ...prev,
        classList: data.data
      }));
   
  }

  const getCourses= async ()=>{
    const data = await getCourseList();
    setProfile(prev => ({
      ...prev,
      courseList: data.data
    }));
 
}

const getImages= async ()=>{
  const data = await getImageList();
  setProfile(prev => ({
    ...prev,
    galleryImages: data.data
  }));

}

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Email */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Email</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                        />
                        {validationErrors.email && (
                          <div className="text-red-500 text-sm mt-1">{validationErrors.email}</div>
                        )}
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.email}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Mobile</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                        />
                        {validationErrors.phoneNumber && (
                          <div className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</div>
                        )}
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.phoneNumber}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Location</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="location"
                          value={profile.location}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                        />
                        {validationErrors.location && (
                          <div className="text-red-500 text-sm mt-1">{validationErrors.location}</div>
                        )}
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Joined Date */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Joined Date</label>
                    <div className="col-span-3 bg-gray-50 p-3 rounded">
                      {profile.joinedDate}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Gender</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Select 
                          value={profile.gender || ""} 
                          onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                          <SelectTrigger className="w-full bg-gray-50">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Trans">Trans</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.gender || "Not specified"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Institute Information Section */}
            <div>
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Institute Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Institute Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Institute Name</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="instituteName"
                          value={profile.instituteName}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                        />
                        {validationErrors.instituteName && (
                          <div className="text-red-500 text-sm mt-1">{validationErrors.instituteName}</div>
                        )}
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.instituteName || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Program Title */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Program Title</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="programTitle"
                          value={profile.programTitle}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                        />
                        {validationErrors.programTitle && (
                          <div className="text-red-500 text-sm mt-1">{validationErrors.programTitle}</div>
                        )}
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.programTitle || "Not specified"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* GST Number */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">GST Number</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="gstNo"
                          value={profile.gstNo}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                        />
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.gstNo || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Introduction */}
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label className="text-gray-600 font-medium pt-3">Introduction</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Textarea
                          name="introduction"
                          value={profile.introduction}
                          onChange={handleInputChange}
                          className="bg-gray-50 min-h-[100px]"
                          placeholder="Tell us about your institute..."
                        />
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded min-h-[100px]">
                        {profile.introduction || "No introduction provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div>
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Additional Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Website */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Website</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="websiteName"
                          value={profile.websiteName}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                          placeholder="https://example.com"
                        />
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.websiteName || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Class Level */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Class Level</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="classLevel"
                          value={profile.classLevel}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                        />
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.classLevel || "Not specified"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Social Media */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">Instagram</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="instagramAccount"
                          value={profile.instagramAccount}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                          placeholder="@username"
                        />
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.instagramAccount || "Not specified"}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-gray-600 font-medium">YouTube</label>
                    {isEditing ? (
                      <div className="col-span-3">
                        <Input
                          type="text"
                          name="youtubeAccount"
                          value={profile.youtubeAccount}
                          onChange={handleInputChange}
                          className="bg-gray-50"
                          placeholder="Channel name"
                        />
                      </div>
                    ) : (
                      <div className="col-span-3 bg-gray-50 p-3 rounded">
                        {profile.youtubeAccount || "Not specified"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "classes":
        return (
          <div className="w-250">
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-700">My Classes</h3>
            </div>
            
            {profile.classList && profile.classList.length > 0 ? (
              <div className="overflow-x-scroll overflow-y-scroll h-110">
                <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {profile.classList.map((classItem) => (
                      <tr key={classItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classItem.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classItem.ageFrom} - {classItem.ageTo} years</td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.day}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.timingsFrom} - {classItem.timingsTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.fromPrice} - {classItem.toPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.subCategoryID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            classItem.type === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {classItem.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800 mr-2">
                            View
                          </Button> */}
                          <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No classes found. Add your first class to get started.
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button variant={'default'} className=" hover:bg-blue-700 text-white"
              onClick={() => setIsClassOpen(true)}>
                Add New Class
              </Button>
            </div>
            <AddClassPopup open={isClassOpen} setOpen={setIsClassOpen} onSubmit={()=>{getClasses()}}/>
          </div>
        );
      case "courses":
        return (
          <div>
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-700">My Courses</h3>
            </div>
            
            {profile.courseList && profile.courseList.length > 0 ? (
              // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              //   {profile.courseList.map((course) => (
              //     <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              //       <div className="h-48 w-full relative">
              //         <Image
              //           src={course.image || "/api/placeholder/400/320"}
              //           alt={course.title}
              //           layout="fill"
              //           objectFit="cover"
              //         />
              //       </div>
              //       <div className="p-4">
              //         <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
              //         <h4 className="text-lg font-semibold mb-2">{course.title}</h4>
              //         <div className="flex justify-between text-sm text-gray-600 mb-2">
              //           <span>Duration: {course.duration}</span>
              //           <span>Level: {course.level}</span>
              //         </div>
              //         <div className="text-sm text-gray-600 mb-4">
              //           <span>Enrollments: {course.enrollments} students</span>
              //         </div>
              //         <div className="flex space-x-2">
              //           <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
              //             View Details
              //           </Button>
              //           <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800">
              //             Edit
              //           </Button>
              //         </div>
              //       </div>
              //     </div>
              //   ))}
              // </div>
              <div className="overflow-x-scroll">
                <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {profile.courseList.map((classItem) => (
                      <tr key={classItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classItem.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classItem.ageFrom} - {classItem.ageTo} years</td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.day}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.timingsFrom} - {classItem.timingsTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.fromPrice} - {classItem.toPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.subCategoryID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            classItem.type === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {classItem.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800 mr-2">
                            View
                          </Button> */}
                          <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No courses found. Add your first course to get started.
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button className="hover:bg-blue-700 text-white" onClick={() => setIsCourseOpen(true)}>
                Add New Course
              </Button>
            </div>
            <AddCoursePopup open={isCourseOpen} setOpen={setIsCourseOpen} onSubmit={()=>{getCourses()}}/>
          </div>
        );
      case "gallery":
        return (
          <div>
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Gallery</h3>
            </div>
            
            {profile.galleryImages && profile.galleryImages.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {profile.galleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                        <Image
                          src={image.url || "/images/no image available.jpg"}
                          alt={image.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-end justify-start p-3">
                          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="font-semibold">{image.title}</p>
                            <p className="text-sm">{image.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add image tile */}
                  {/* <div className="aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center text-gray-500">
                      <ImageIcon2 className="w-10 h-10 mb-2" />
                      <span>Add Image</span>
                    </div>
                  </div> */}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No images found. Add your first image to get started.
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center p-8 border-b">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">My Profile</h1>

          {/* Profile Image */}
          <div className="mb-6">
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                <Image
                  src={profile.profileImage}
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                className="absolute -bottom-1.5 -right-1.5 cursor-pointer bg-emerald-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors border-2 border-white"
                onClick={() => setIsPhotoOptionsOpen(true)}
              >
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* Name and Profession */}
          <div className="w-full mb-2 text-center">
            {isEditing ? (
              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="text-center text-lg font-medium mb-2"
                  placeholder="Your Name"
                />
                {validationErrors.name && (
                  <div className="text-red-500 text-sm">{validationErrors.name}</div>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-700">{profile.name}</h2>
                <p className="text-gray-500">{profile.profession}</p>
              </>
            )}
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="flex">
          {/* Vertical Tabs */}
          <div className="w-48 border-r min-h-[600px] bg-gray-50">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                      activeTab === "profile"
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("classes")}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                      activeTab === "classes"
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Classes</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                      activeTab === "courses"
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Courses</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md",
                      activeTab === "gallery"
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <ImageIcon2 className="mr-2 h-4 w-4" />
                    <span>Gallery</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-grow p-6">
            {renderTabContent()}
            
            {/* Action Buttons - only show for profile tab */}
            {activeTab === "profile" && (
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => isEditing ? setIsEditing(false) : null}
                  className="px-6"
                >
                  {isEditing ? "Cancel" : "Close"}
                </Button>

                <Button
                  onClick={isEditing ? handleUpdateProfile : handleEditToggle}
                  disabled={isLoading}
                  className="px-6 text-white"
                >
                  {isLoading ? "Loading..." : isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Photo Options Dialog */}
        <PhotoOptionsDialog 
          open={isPhotoOptionsOpen}
          setOpen={setIsPhotoOptionsOpen}
          onDelete={handleDeletePhoto}
          setProfile={setProfile}
        />

        {/* Delete Photo Dialog */}
        <DeletePopup 
          open={isDeleteOpen} 
          setOpen={setIsDeleteOpen} 
          onDelete={handleDeletePhoto} 
        />
      </div>
    </div>
  );
}