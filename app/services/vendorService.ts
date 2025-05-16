// import { API_BASE_URL_1 } from '@/lib/apiConfigs';
import { API_BASE_URL } from '@/lib/apiConfigs';
import axios from 'axios';

// const API_BASE_URL = 'https://api.hobyhub.com/api/1';

// Store access token
let accessToken: string | null = null;

export interface VendorRegistrationData {
  name: string;
  emailId: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  profileImageFile?: File;
  activity: {
    type: string;
    categoryId: number;
    title: string;
    companyName: string;
    description: string;
    sinceYear: string;
    gstNo: string;
    thumbnailImageFile?: File;
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
    tutorFirstName: string;
    tutorLastName: string;
    tutorEmailID: string;
    tutorCountryCode: string;
    tutorPhoneNo: string;
    whatsappCountryCode: string;
    whatsappNo: string;
    tutorIntro: string;
    website: string;
    classLevel: string;
    instagramAcc: string;
    youtubeAcc: string;
    images: File[];
    classDetails: {
      sessionFrom: number;
      gender: string;
      timingsTo: string;
      ageFrom: number;
      activityId: number;
      toPrice: number;
      sessionTo: number;
      timingsFrom: string;
      title: string;
      subCategoryID: string;
      type: string;
      ageTo: number;
      id: number;
      day: string;
      fromPrice: number;
    }[];
    courseDetails: {
      sessionFrom: number;
      gender: string;
      timingsTo: string;
      ageFrom: number;
      endDate: string;
      toPrice: number;
      startDate: string;
      sessionTo: number;
      timingsFrom: string;
      title: string;
      subCategoryID: string;
      type: string;
      ageTo: number;
      id: number;
      day: string;
      fromPrice: number;
    }[];
    id: number;
  };
}

export interface VendorRegistrationResponse {
  id: number;
  username: string;
}

export interface LoginResponse {
  Name: string;
  UserName: string;
  ProfileImage: string | null;
  Role: string;
  AccessToken: string;
  RefreshToken: string;
  ForcePwdChange: boolean;
}

export interface VendorActivityData {
  vendorId: number;
  type: string;
  categoryId: number;
  title: string;
  companyName: string;
  description: string;
  sinceYear: string;
  gstNo: string;
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
  tutorFirstName: string;
  tutorLastName: string;
  tutorEmailID: string;
  tutorCountryCode: string;
  tutorPhoneNo: string;
  whatsappCountryCode: string;
  whatsappNo: string;
  tutorIntro: string;
  website: string;
  classLevel: string;
  instagramAcc: string;
  youtubeAcc: string;
}

export interface VendorActivityResponse {
  id: number;
  vendorId: number;
  type: string;
  categoryId: number;
  title: string;
  companyName: string;
  description: string;
  sinceYear: string;
  gstNo: string;
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
  tutorFirstName: string;
  tutorLastName: string;
  tutorEmailID: string;
  tutorCountryCode: string;
  tutorPhoneNo: string;
  whatsappCountryCode: string;
  whatsappNo: string;
  tutorIntro: string;
  website: string;
  classLevel: string;
  instagramAcc: string;
  youtubeAcc: string;
}

export interface VendorClassData {
  id: number;
  vendorId?: number;
  activityId?: number;
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
  price?: number;
  fromPrice: number;
  toPrice: number;
}

export interface VendorCourseData {
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
  startDate: string;
  endDate: string;
}

export const registerVendor = async (data: FormData): Promise<VendorRegistrationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vendor/register`, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register vendor');
      } else {
        // Handle text response
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to register vendor');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
};

export const generateLoginOtp = async (username: string) => {
  try {
    await axios.post(`${API_BASE_URL}/generate/login-otp`, { username });
  } catch (error) {
    console.error('Error generating login OTP:', error);
    throw error;
  }
};

export const login = async (username: string, loginOtp: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, {
      username,
      loginOtp
    });
    accessToken = response.data.AccessToken;
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const createVendorActivity = async (data: FormData) => {
  try {

    const response = await fetch('https://api.hobyhub.com/api/1/vendor/activity/create', {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create vendor activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating vendor activity:', error);
    throw error;
  }
};

export const createVendorClass = async (data: VendorClassData[]) => {
  try {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await axios.post(`${API_BASE_URL}/vendor/vendor-class/create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating vendor class:', error);
    throw error;
  }
};

export const createVendorCourse = async (data: VendorCourseData[]) => {
  try {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await axios.post(`${API_BASE_URL}/vendor/vendor-course/create`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating vendor course:', error);
    throw error;
  }
}; 