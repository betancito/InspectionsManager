import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
  
  // Add an interceptor to include the token in every request
  api.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting token', error);
    }
    return config;
  });
  
  return api;
};