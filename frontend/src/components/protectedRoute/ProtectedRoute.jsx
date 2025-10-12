import { Outlet, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";
import { refreshToken } from "../../services/refreshToken";
import { BASE_URL } from "../../config";

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, setToken, role } = useContext(AuthContext);
    const [isValid, setIsValid] = useState(null);

    const userData = localStorage.getItem("userData");
    const userRole = userData ? JSON.parse(userData).role : null;

    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (!token) {
                    const newAccess = await refreshToken();
                    if (newAccess) {
                        setToken(newAccess);
                        setIsValid(true);
                    } else {
                        setIsValid(false);
                    }
                    return;
                }

                const res = await axios.post(`${BASE_URL}/auth/api/token/verify/`, {
                    token,
                });

                if (res.status === 200) {
                    setIsValid(true);
                }
            } catch (err) {
                console.warn("Token invalid or expired → trying refresh...");

                try {
                    const newAccess = await refreshToken();
                    if (newAccess) {
                        setToken(newAccess);
                        setIsValid(true);
                    } else {
                        setIsValid(false);
                    }
                } catch (refreshErr) {
                    console.error("Token refresh failed:", refreshErr);
                    setIsValid(false);
                }
            }
        };

        verifyToken();
    }, [token, setToken]);

    if (isValid === null) {
        return <div>Loading...</div>;
    }

    if (!isValid) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
