import axios from 'axios';

const API_BASE_URL = 'https://api.hobyhub.com/api/1';

// Store access token
let accessToken: string | null = null;

export interface VendorRegistrationData {
  id: number;
  name: string;
  emailId: string;
  phoneNumber: string;
  gender: string;
}

export interface VendorRegistrationResponse {
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
  latitute: string;
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
  latitute: string;
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
  vendorId: number;
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
  price: number;
}

// Static vendor ID counter starting from 25
let currentVendorId = 25;

export const registerVendor = async (data: VendorRegistrationData): Promise<{ username: string; vendorId: number }> => {
  try {
    const response = await axios.post<VendorRegistrationResponse>(`${API_BASE_URL}/vendor/register`, data);
    // Get the current vendor ID and increment for next time
    const vendorId = currentVendorId++;
    return {
      username: response.data.username,
      vendorId
    };
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
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch('https://api.hobyhub.com/api/1/vendor/activity/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // Don't set Content-Type header when sending FormData
        // browser will set it automatically with the correct boundary
      },
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