import { API_BASE_URL } from "@/lib/apiConfigs";
import axios from "axios";
import { getStoredToken } from "@/utils/localStorage";

const getHeaders = () => ({
  "Content-Type": "application/json",
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

export const getClassList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/vendor-class/get-all?id=0`, {
      headers: getHeaders(),
    });
    console.log("Response:", response.data);
    return response;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export interface VendorClassData {
  id: number;
  activityId: number;
  subCategoryID: string;
  title: string;
  timingsFrom: string;
  timingsTo: string;
  day: string;
  type: string;
  ageFrom: number;
  ageTo: number;
  sessionFrom: number;
  sessionTo: number;
  gender: string;
  fromPrice: number;
  toPrice: number;
}

export const createClass = async (formData: VendorClassData[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vendor/vendor-class/create`, formData, { headers: getHeaders() });
    console.log("Response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const createCourse = async (formData: VendorClassData[]) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vendor/vendor-course/create`, formData, { headers: getHeaders() });
    console.log("Response:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const getCourseList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/vendor-course/get-all?id=0`, {
      headers: getHeaders(),
    });
    console.log("Response:", response.data);
    return response;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};

export const getImageList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendor/vendor-file/get-all?id=0`, {
      headers: getHeaders(),
    });
    console.log("Response:", response.data);
    return response;
  } catch (error : any) {
    console.error("Error:", error);
    return error.response;
  }
};