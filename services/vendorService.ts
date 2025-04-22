import { API_BASE_URL } from "@/lib/apiConfigs";
import axios from "axios";
import { getStoredToken } from "@/utils/localStorage";
import { VendorClassData } from "@/app/services/vendorService";

const getHeaders = () => ({
  Authorization: `Bearer ${getStoredToken()}`,
});

/**
 * Get all activities with optional filters
 * @param vendorId Optional filters to apply to the activities
 * @returns List of filtered activities
 */

export const registerVendor = async (formData: {}) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/vendor/register`, formData);
      console.log("Response:", response.data);
      return response;
    } catch (error : any) {
      console.error("Error:", error);
      return error.response;
    }
};

export const getClassList = async (id:number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/vendor-class/get-all?id=${id}`, {
      headers: getHeaders(),
    });
    console.log("Response:", response.data);
    return response;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const createClass = async (formData:VendorClassData[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vendor/vendor-class/create`,formData,{ headers: getHeaders()});
    console.log("Response:", response.data);
    return response;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const createCourse = async (formData:VendorClassData[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vendor/vendor-course/create`,formData,{ headers: getHeaders()});
    console.log("Response:", response.data);
    return response;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const getCourseList = async (id:number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/vendor-course/get-all?id=${id}`, {
      headers: getHeaders(),
    });
    console.log("Response:", response.data);
    return response;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const getImageList = async (id:number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/vendor-file/get-all?id=${id}`, {
      headers: getHeaders(),
    });
    console.log("Image List Response:", response.data);
    // Ensure the response data is an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error : any) {
    console.error("Error fetching image list:", error);
    return [];
  }
};

export const getActivity = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/activity/get-all`, {
      headers: getHeaders(),
    });
    console.log("Response:", response.data);
    return response.data;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const updateActivity = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vendor/activity/edit`,formData, {
      headers: getHeaders(),
    });
    console.log("Response:", response.data);
    return response.data;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export type { VendorClassData };
