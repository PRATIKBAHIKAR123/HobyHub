"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Trash2, Camera, ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    youtubeAccount: ""
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
          youtubeAccount: ""
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

  return (
    <div className="flex justify-center mt-8">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center">
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

        {/* Profile Details */}
        <CardContent className="p-0">
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

          {/* Action Buttons */}
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
        </CardContent>

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