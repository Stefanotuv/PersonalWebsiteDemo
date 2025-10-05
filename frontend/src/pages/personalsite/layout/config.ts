// src/utils/config.ts
import api from '../../../api.ts'; // Assuming you have an axios instance or similar

interface DynamicSettings {
  navbar_type?: string;
  // Add other dynamic settings here
  [key: string]: any;
}

interface ConfigResponse {
  settings: DynamicSettings;
  // Add other response data
}

export const fetchCurrentEnvSettings = async (): Promise<ConfigResponse> => {
  try {
    const response = await api.get<ConfigResponse>('/config/api/config/settings/'); // Replace with your actual backend endpoint for settings
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dynamic environment settings:", error);
    // Provide a safe fallback if the API call fails
    return {
      settings: {
        navbar_type: 'DefaultNavbar', // Fallback to a safe default
      },
    };
  }
};