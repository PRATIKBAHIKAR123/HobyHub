"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import withAuth from "../auth/withAuth";


interface ProfileData {
  email: string;
  dob: string;
  phoneNumber: string;
  name: string;
  profileImage: string;
  id?: number;
  gender: string;
}

function ProfilePage() {
      const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    email: "",
    dob: "",
    phoneNumber: "",
    name: "",
    profileImage: "/images/thumb5.png",
    gender: ""
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    dob?: string;
    gender?: string;
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
          dob: data.dob || "",
          phoneNumber: data.phoneNumber || "",
          name: data.name || "",
          profileImage: data.profileImage || "/images/thumb5.png",
          gender: data.gender || ""
        });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      const updateData = {
        id: profile.id,
        name: profile.name,
        emailId: profile.email,
        phoneNumber: profile.phoneNumber,
        gender: profile.gender,
        dob: profile.dob
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

  if (isLoading && !profile.name) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">My Profile</h1>

          {/* Profile Image */}
          <div className="mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
              <Image
                src={profile.profileImage}
                alt="Profile Picture"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="mt-2 text-center">
                <Button variant="outline" size="sm" className="text-xs">
                  Change Photo
                </Button>
              </div>
            )}
          </div>

          {/* Name (Editable in edit mode) */}
          <div className="w-full mb-6 text-center">
            {isEditing ? (
              <div>
                <Input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="text-center text-lg font-medium mb-1"
                  placeholder="Your Name"
                />
                {validationErrors.name && (
                  <div className="text-red-500 text-sm">{validationErrors.name}</div>
                )}
              </div>
            ) : (
              <h2 className="text-xl font-semibold text-gray-700">{profile.name}</h2>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <CardContent className="p-0">
          <div className="space-y-4">
            {/* Gender */}
            <div className="grid grid-cols-3 items-center">
              <label className="text-gray-600 font-medium">Gender</label>
              {isEditing ? (
                <div className="col-span-2">
                  <Select 
                    value={profile.gender} 
                    onValueChange={(value) => handleSelectChange("gender", value)}
                  >
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent defaultValue={"Male"}>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Trans">Trans</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.gender && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.gender}</div>
                  )}
                </div>
              ) : (
                <div className="col-span-2 bg-gray-50 p-3 rounded">
                  {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not specified"}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-3 items-center">
              <label className="text-gray-600 font-medium">Date of Birth</label>
              {isEditing ? (
                <div className="col-span-2">
                  <Input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleInputChange}
                    className="bg-gray-50"
                  />
                  {validationErrors.dob && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors.dob}</div>
                  )}
                </div>
              ) : (
                <div className="col-span-2 bg-gray-50 p-3 rounded">
                  {profile.dob || "Not specified"}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="grid grid-cols-3 items-center">
              <label className="text-gray-600 font-medium">Email</label>
              {isEditing ? (
                <div className="col-span-2">
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
                <div className="col-span-2 bg-gray-50 p-3 rounded">
                  {profile.email}
                </div>
              )}
            </div>

            {/* Phone Number (Read-only) */}
            <div className="grid grid-cols-3 items-center">
              <label className="text-gray-600 font-medium">Phone Number</label>
              <div className="col-span-2 bg-gray-50 p-3 rounded">
                {profile.phoneNumber || "Not provided"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => isEditing ? setIsEditing(false) : router.push('/')}
              className="px-4"
            >
              {isEditing ? "Cancel" : "Close"}
            </Button>

            <Button
              onClick={isEditing ? handleUpdateProfile : handleEditToggle}
              disabled={isLoading}
              className="px-4 text-white"
            >
              {isLoading ? "Loading..." : isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage)