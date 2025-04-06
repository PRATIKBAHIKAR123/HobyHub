import { API_BASE_URL } from "@/lib/apiConfigs";
import axios from "axios";


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