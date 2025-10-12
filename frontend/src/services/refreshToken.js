import axios from "axios";
import { getCookie } from "../utils/cookies";
import { BASE_URL } from "../config";

export const refreshToken = async () => {
    try {
        console.log("REQUESTING NEW TOKEN");
        const res = await axios.post(
            `${BASE_URL}/auth/api/token/refresh/`,
            null,
            {
                withCredentials: true,
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                },
            }
        );

        const newAccess = res.data.access;
        return newAccess;
    } catch (err) {
        console.error("Token refresh failed:", err);
        return null
    }
};
