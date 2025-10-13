import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config";

const Login = () => {
    const [user, setUser] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const { setToken } = useContext(AuthContext);

    const handleSubmit = () => {
        console.log("LOGIN ATTEMPT");
        axios.post(`${BASE_URL}/auth/api/token/`, {
            username: user.username,
            password: user.password
        },
            {
                withCredentials: true
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    setToken(response.data.access);
                    localStorage.setItem("userData", JSON.stringify(
                        {
                            role: response.data.role,
                            username: response.data.username,
                            firstName: response.data.firstname,
                            lastName: response.data.lastname
                        }
                    ));

                    const role = response.data.role;
                    if (role === "STUDENT") {
                        navigate("/student");
                    } else if (role === "TEACHER") {
                        navigate("/teacher");
                    } else if (role === "MANAGEMENT") {
                        navigate("/management");
                    };
                }
            })
            .catch((error) => {
                console.log(error);
            })
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="flex flex-col items-center justify-center w-[30%]">
                <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full border p-3 rounded-md"
                    value={user.username}
                    onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
                />
                <input
                    type="password"
                    name=""
                    placeholder="Enter password"
                    className="w-full border p-3 mt-3 rounded-md"
                    value={user.password}
                    onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
                />
                <button
                    className="w-full px-3 py-2 mt-3 bg-blue-400 rounded-md font-semibold text-white cursor-pointer"
                    onClick={handleSubmit}
                >
                    Login
                </button>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" >
                            <button className="text-blue-600 hover:text-blue-500 transition-colors">
                                Signup
                            </button>
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Login;