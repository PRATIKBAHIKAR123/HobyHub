"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { getUserProfile, updateUserProfile } from "@/services/userService";

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
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    email: "",
    joinedDate: "",
    phoneNumber: "",
    location: "",
    name: "",
    profession: "",
    profileImage: ""
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phoneNumber?: string;
    location?: string;
    profession?: string;
  }>({});

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();

        // Map API response to our state structure
        setProfile({
          id: data.id,
          email: data.emailId || "",
          joinedDate: data.joinedDate || "",
          phoneNumber: data.phoneNumber || "",
          location: data.location || "",
          name: data.name || "",
          profession: data.profession || "",
          profileImage: data.profileImage || "/images/thumb5.png",
          gender: data.gender || ""
        });

        setError(null);
      } catch (err) {
        setError("Failed to load profile data. Please try again later.");
        console.error(err);

        // For development/testing - use mock data when API fails
        // setProfile({
        //   id: 1,
        //   email: "mayank354@gmail.com",
        //   joinedDate: "12-01-2025",
        //   phoneNumber: "+914254875267",
        //   location: "M245, New York, USA",
        //   name: "Mayank Kukreti",
        //   profession: "UI/UX Designer",
        //   profileImage: "/images/thumb5.png",
        //   gender: ""
        // });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      const updateData = {
        id: profile.id,
        name: profile.name,
        emailId: profile.email,
        phoneNumber: profile.phoneNumber,
        password: "", // You can decide if password should be updated as well
        gender: profile.gender,
        location: profile.location,
      };

      await updateUserProfile(updateData);
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
    <div className="flex justify-center min-h-screen mt-[28px]">
      <div className="w-full max-w-6xl bg-white px-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="justify-center text-[#636363] mb-[25px] text-3xl font-semibold">My Profile</div>

          {/* Profile Image */}
          <div className="w-[140px] h-[140px] rounded-full overflow-hidden">
            <Image
              src={profile.profileImage}
              alt="Profile Picture"
              width={140}
              height={140}
              className="w-[140px] h-[140px]"
            />
          </div>

          {isEditing ? (
            <>
              <Input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="text-center text-neutral-500 text-[21.30px] font-semibold mt-3 border-b"
              // Check if there's an error for this field
              />
              {validationErrors.name && (
                <div className="text-red-500 text-sm mt-1">{validationErrors.name}</div>
              )}
              <Input
                type="text"
                name="profession"
                value={profile.profession}
                onChange={handleInputChange}
                className="text-center text-[#bbbbbb] text-[16.90px] font-semibold mt-3 border-b"
              />
            </>
          ) : (
            <>
              <h2 className="text-neutral-500 text-[21.30px] font-semibold mt-3">{profile.name}</h2>
              <p className="text-[#bbbbbb] text-[16.90px] font-semibold mt-3">{profile.profession}</p>
            </>
          )}
        </div>

        <hr className="my-4 h-[3px] bg-[#F5F5F5]" />

        {/* Profile Details */}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[#8e8e8e] text-base font-semibold mb-[16px]">User Email</p>
              <Input
                type="text"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full h-[60] px-3 py-2 bg-[#ebebed] rounded-md border border-[#e4e6ea]"
              />
              {validationErrors.email && (
                <div className="text-red-500 text-sm mt-1">{validationErrors.email}</div>
              )}
            </div>
            <div>
              <p className="text-[#8e8e8e] text-base font-semibold mb-[16px]">Joined Date</p>
              <Input
                type="text"
                name="joinedDate"
                value={profile.joinedDate}
                onChange={handleInputChange}
                disabled={true} // Joined date should not be editable
                className="w-full h-[60] px-3 py-2 bg-[#ebebed] rounded-md border border-[#e4e6ea]"
              />
            </div>
            <div>
              <p className="text-[#8e8e8e] text-base font-semibold mb-[16px]">Phone Number</p>
              <Input
                type="text"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full h-[60] px-3 py-2 bg-[#ebebed] rounded-md border border-[#e4e6ea]"
              />
              {validationErrors.phoneNumber && (
                <div className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</div>
              )}
            </div>
            <div>
              <p className="text-[#8e8e8e] text-base font-semibold mb-[16px]">Location</p>
              <Input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full h-[60] px-3 py-2 bg-[#ebebed] rounded-md border border-[#e4e6ea]"
              />
              {validationErrors.location && (
                <div className="text-red-500 text-sm mt-1">{validationErrors.location}</div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="bg-[#fefefe] rounded-[7px] border-[3px] border-[#505053] text-[#969696] text-base font-semibold"
              onClick={() => isEditing ? setIsEditing(false) : null}
            >
              {isEditing ? "Cancel" : "Close"}
            </Button>

            <Button
              className="app-bg-color rounded border border-[#57708e]"
              onClick={isEditing ? handleUpdateProfile : handleEditToggle}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isEditing ? "Update Profile" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
}