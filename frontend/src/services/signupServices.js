import axios from "axios";
import { BASE_URL } from "../config";

export const checkUsername = async (username) => {
    try {
        const res = await axios.get(`${BASE_URL}/auth/check-username/`, { params: { username } });
        return res.data.exists;
    } catch (err) {
        console.error("Error checking username:", err);
        return null;
    }
};
