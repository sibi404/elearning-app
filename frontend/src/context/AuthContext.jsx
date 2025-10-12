import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(() => JSON.parse(localStorage.getItem("userData") || "{}")?.role || null);

    return (
        <AuthContext.Provider value={{ token, setToken, role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};