import axios from "axios";
import {store} from "../features/store";
import { refreshToken } from "../features/slicers/Auth/authSlice";

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        config => {
            const token = localStorage.getItem("access");
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },

        error => {
            return Promise.reject(error);
        }

    );
    
    axios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            // If 401 error and the request has not been retried yet
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Attempt to refresh the token
                    await store.dispatch(refreshToken()).unwrap();
                    return axios(originalRequest);
                } catch (err) {
                    console.error("Token refresh failed:", err);
                    return Promise.reject(err);
                }
            }
            return Promise.reject(error);
        }
    )
}

export default setupAxiosInterceptors;