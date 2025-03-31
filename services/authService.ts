import { API_BASE_URL } from "@/lib/apiConfigs";
import axios from "axios";

export const loginWithOtp = async (username: string, loginOtp: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        loginOtp,
      });
      return response.data;
    } catch (error:any) {
      throw error.response?.data || "Login failed";
    }
  };

  export const generateOTP = async (username: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate/login-otp`, {
        username
      });
      return response.data;
    } catch (error:any) {
      throw error.response?.data || "OTP failed";
    }
  };

  export const registerCustomer = async (customerData: {}) => {
    
  
    try {
      const response = await axios.post(`${API_BASE_URL}/customer/register`, customerData);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };