import { API_BASE_URL } from "@/lib/apiConfigs";
import axios from "axios";

interface SubCategory {
    categoryId: number;
    title: string;
    imagePath: string | null;
    id: number;
}

interface Category {
    title: string;
    imagePath: string | null;
    sort: number;
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
    thumbnailImage: string;
    sessionCountFrom: number;
    sessionCountTo: number;
    ageRestrictionFrom: number;
    ageRestrictionTo: number;
    rate: number;
    currency: string;
    address: string;
    road: string;
    area: string;
    state: string;
    city: string;
    pincode: string;
    country: string;
    longitude: string;
    latitude: string;
    purchaseMaterialIds: string;
    itemCarryText: string;
    companyName: string;
    tutorFirstName: string;
    tutorLastName: string;
    tutorEmailID: string;
    tutorCountryCode: string;
    tutorPhoneNo: string;
    whatsappCountryCode: string;
    whatsappNo: string;
    tutorIntro: string;
    website: string | null;
    profileImage: string | null;
    sinceYear: string | null;
    iconActivityType: string;
    approved: string;
    approvedDateTime: string;
    isCreatedByAdmin: string;
    createdDate: string;
    viewCount: number;
}

interface ErrorResponse {
    message: string;
    error?: string;
}

interface ActivityFilters {
    latitude: string,
    longitude: string,
    catId: number;
    subCatId: number;
    mode: string;
    sortFilter: string;
    location: string;
    age: number;
    type: string;
    time: string;
    gender: string;
    priceFrom: number;
    priceTo: number;
    pageNumber: number,
    pageSize: number,
    distance: string,
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
 * Get all activities with optional filters
 * @param filters Optional filters to apply to the activities
 * @returns List of filtered activities
 */
export const getAllActivities = async (filters: Partial<ActivityFilters> = {}): Promise<Activity[]> => {
    try {
        const token = getAuthToken();
        const response = await axios.post<Activity[]>(
            `${API_BASE_URL}/activities`,
            {
                catId: filters.catId || null,
                subCatId: filters.subCatId || null,
                mode: filters.mode || "offline",
                sortFilter: filters.sortFilter || "NearMe",
                location: filters.location || null,
                latitude: filters.latitude || '18.5204',
                longitude: filters.longitude || '73.8567',
                age: filters.age || null,
                type: filters.type || null,
                time: filters.time || null,
                gender: filters.gender || null,
                priceFrom: filters.priceFrom || null,
                priceTo: filters.priceTo || null,
                pageNumber: filters.pageNumber || 0,
                pageSize: filters.pageSize || 10,
                distance:  parseInt(filters.distance ?? "10") || 10,
            },
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

/**
 * Get all categories
 * @returns List of all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const token = getAuthToken();
        const response = await axios.get<Category[]>(
            `${API_BASE_URL}/category/list`,
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
        throw err.response?.data?.message || "Failed to fetch categories";
    }
};

/**
 * Get activity details by ID
 * @param activityId The ID of the activity to fetch
 * @returns Activity details
 */
export const getActivityById = async (activityId: number): Promise<Activity> => {
    try {
        const token = getAuthToken();
        const response = await axios.get<Activity>(
            `${API_BASE_URL}/activity/get?id=${activityId}`,
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
        throw err.response?.data?.message || "Failed to fetch activity details";
    }
};

/**
 * Increase view count for an activity
 * @param activityId The ID of the activity to increase view count for
 */
export const increaseActivityViewCount = async (id: number): Promise<void> => {
    try {
        const token = getAuthToken();
        await axios.post(
            `${API_BASE_URL}/increase-view`,
            { id },
            {
                headers: {
                    'accept': '*/*',
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        const err = error as { response?: { data: ErrorResponse } };
        throw err.response?.data?.message || "Failed to increase view count";
    }
};

// Export all functions as named exports
export const hobbyService = {
    getAllSubCategories,
    getAllActivities,
    getAllCategories,
    getActivityById,
    increaseActivityViewCount
};

export default hobbyService;
