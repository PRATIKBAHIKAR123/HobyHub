import { API_BASE_URL } from "@/lib/apiConfigs";
import axios from "axios";

interface SubCategory {
  categoryId: number;
  title: string;
  imagePath: string | null;
  id: number;
}

interface Activity {
  id: number;
  vendorId: number;
  type: string;
  categoryId: number;
  subCategoryId: string;
  title: string;
  description: string;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

/**
 * Get authentication token from local storage
 * Safely handles server-side rendering by checking for window object
 */
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        try {
            return localStorage.getItem("token");
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            return null;
        }
    }
    return null;
};

/**
 * Get all subcategories
 * @returns List of all subcategories
 */
export const getAllSubCategories = async (): Promise<SubCategory[]> => {
    try {
        const token = getAuthToken();
        const response = await axios.post<SubCategory[]>(
            `${API_BASE_URL}/sub-category/list`,
            {}, // empty body
            {
                headers: {
                    'accept': '*/*',
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        const err = error as { response?: { data: ErrorResponse } };
        throw err.response?.data?.message || "Failed to fetch subcategories";
    }
};

/**
 * Get all activities
 * @returns List of all activities
 */
export const getAllActivities = async (): Promise<Activity[]> => {
    try {
        const token = getAuthToken();
        const response = await axios.post<Activity[]>(
            `${API_BASE_URL}/activities`,
            {}, // empty body
            {
                headers: {
                    'accept': '*/*',
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        const err = error as { response?: { data: ErrorResponse } };
        throw err.response?.data?.message || "Failed to fetch activities";
    }
};

// Export all functions as named exports
export const hobbyService = {
    getAllSubCategories,
    getAllActivities
};

export default hobbyService;
