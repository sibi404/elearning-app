import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, X, Check, TriangleAlert } from 'lucide-react';


import { checkAllFieldsFilled } from '../../utils/signup/fieldsCheck';

import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { checkUsername } from '../../services/signupServices';
import ErrorMessage from './ErrorMessage';


const initialFormState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false
};

const SignUp = () => {

    const [formData, setFormData] = useState(initialFormState);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [usernameCheckFailed, setUsernameCheckFailed] = useState(false);

    const navigate = useNavigate();

    // const { user, setUser } = useContext(UserContext);

    const passwordRequirements = [
        { regex: /.{8,}/, text: "At least 8 characters", met: formData.password.length >= 8 },
        { regex: /[A-Z]/, text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
        { regex: /[a-z]/, text: "One lowercase letter", met: /[a-z]/.test(formData.password) },
        { regex: /\d/, text: "One number", met: /\d/.test(formData.password) },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
    ];

    const isPasswordStrong = passwordRequirements.every(req => req.met);



    const handleFocusOut = () => {
        setPasswordMatch(checkPasswordMatch);
    };

    const checkPasswordMatch = () => {
        if (formData.password && formData.confirmPassword) {
            return formData.password === formData.confirmPassword ? true : false;
        }
    };

    const handleUsernameBlur = async (e) => {
        const username = e.target.value.trim();
        if (!username) return;

        const exists = await checkUsername(username);
        if (exists === null) {
            console.log("server error");
            setUsernameAvailable(false);
            setUsernameCheckFailed(true);
            return;
        } else {
            setUsernameCheckFailed(false);
        }

        if (exists) {
            setUsernameAvailable(false);
            e.target.focus();
        } else {
            setUsernameAvailable(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        console.log('Login attempt');
        if (checkAllFieldsFilled(formData) && usernameAvailable) {
            if (checkPasswordMatch() && isPasswordStrong) {
                console.log("Request sending...");
                axios.post(`${BASE_URL}/auth/signup/student/`, {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName
                },
                )
                    .then((response) => {
                        console.log(response);
                        if (response.status === 201) {
                            console.log(response);
                            setFormData(initialFormState);
                            navigate("/login");
                        }
                    })
                    .catch((error) => {
                        console.log(error.response)
                    })
            } else {
                setPasswordMatch(false);
            }
        } else {
            console.log("Fill all fields");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
                        <p className="text-gray-600">Enter your credentials to access your account</p>
                    </div>

                    <div className="space-y-6">

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    onBlur={handleUsernameBlur}
                                    placeholder="Enter a username"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                            </div>
                            {!usernameAvailable && !usernameCheckFailed && (
                                <ErrorMessage message={"Username already exists!"} />
                            )}

                            {usernameCheckFailed && (
                                <ErrorMessage message={"Username check failed. Please try again."} />
                            )}

                        </div>
                        <div className='flex gap-2'>
                            <div>
                                <label htmlFor="firstname" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Firstname
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                                    <input
                                        id="firstname"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Enter firstname"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastname" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Lastname
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                                    <input
                                        id="lastname"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Enter lastname"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email Id
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email ID"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password strength indicators */}
                        {formData.password && (
                            <div className="space-y-2 mt-3">
                                <div className="text-xs text-muted-foreground">Password requirements:</div>
                                {passwordRequirements.map((requirement, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-xs">
                                        {requirement.met ? (
                                            <Check className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <X className="w-3 h-3 text-red-500" />
                                        )}
                                        <span className={requirement.met ? "text-green-600" : "text-muted-foreground"}>
                                            {requirement.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 h-4 w-4" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    onBlur={handleFocusOut}
                                    placeholder="Confirm your password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>
                        {!passwordMatch && (
                            <div className="text-sm text-muted-foreground text-red-500">Password mismatch</div>
                        )}

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm  text-gray-900">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Sign In Button */}
                        <button
                            onClick={handleSubmit}
                            className="appearance-none w-full bg-blue-600 hover:bg-primary text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-4 focus:ring-blue-200 focus:outline-none cursor-pointer"
                            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                        >
                            Sign In
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">OR</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:ring-4 focus:ring-gray-200 focus:outline-none"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    {/* Support Link */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" >
                                <button className="text-blue-600 hover:text-blue-500 transition-colors">
                                    Login
                                </button>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;