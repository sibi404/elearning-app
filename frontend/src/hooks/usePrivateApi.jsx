import { useContext, useMemo } from "react"
import axios from "axios";
import { BASE_URL } from "../config";

import { AuthContext } from "../context/AuthContext"

import { refreshToken } from "../services/refreshToken";

export const usePrivateApi = () => {
    const { token, setToken } = useContext(AuthContext);

    const privateApi = useMemo(() => {
        const instance = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
        });

        instance.interceptors.request.use((config) => {
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newAccess = await refreshToken();
                        setToken(newAccess);
                        return axios({
                            ...originalRequest,
                            headers: {
                                ...originalRequest.headers,
                                Authorization: `Bearer ${newAccess}`,
                            },
                        });
                    } catch (err) {
                        // Refresh failed → logout
                        setToken(null);
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }, [token, setToken]);

    return privateApi;
};