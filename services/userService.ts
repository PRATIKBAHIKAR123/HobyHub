// services/userProfileService.ts
import { API_BASE_URL } from "@/lib/apiConfigs";
import axios from "axios";

interface UserProfile {
  id: number;
  name: string;
  emailId: string;
  phoneNumber: string;
  gender?: string;
  joinedDate?: string;
  location?: string;
  profession?: string;
  profileImage?: string;
  dob?:string;
}

interface ProfileUpdateData {
  id?: number;
  name: string;
  emailId: string;
  password?: string;
  phoneNumber: string;
  gender?: string;
  dob?: string;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

/**
 * Get authentication token from local storage
 */
const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

/**
 * Get user profile data
 * @returns User profile data
 */
export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        const token = getAuthToken();
        const response = await axios.get<UserProfile>(`${API_BASE_URL}/user-profile`, {
            headers: {
                'accept': '*/*',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        return response.data;
    } catch (error) {
        const err = error as { response?: { data: ErrorResponse } };
        throw err.response?.data?.message || "Failed to fetch user profile";
    }
};

/**
 * Update user profile data
 * @param profileData Updated profile data
 * @returns Updated user profile
 */
export const updateUserProfile = async (profileData: FormData) => {
    try {
        const token = getAuthToken();
        const response = await axios.post(`${API_BASE_URL}/update-profile`, profileData, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        return response.data;
    } catch (error) {
        const err = error as { response?: { data: ErrorResponse } };
        throw err.response?.data?.message || "Failed to update user profile";
    }
};

// Export all functions as named exports
export const userService = {
    getUserProfile,
    updateUserProfile
};

export default userService;
