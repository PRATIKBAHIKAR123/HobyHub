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
 */
const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

/**
 * Get all subcategories
 * @returns List of all subcategories
 */
export const getAllSubCategories = async (): Promise<SubCategory[]> => {
    try {
        const token = getAuthToken();
        const response = await axios.post<SubCategory[]>(`${API_BASE_URL}/sub-category/list`, {
            headers: {
                'accept': '*/*',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
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
        const response = await axios.post<Activity[]>(`${API_BASE_URL}/activities`, {
            headers: {
                'accept': '*/*',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
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
