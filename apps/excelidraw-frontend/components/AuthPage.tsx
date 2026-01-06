'use client'
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import axios from "axios";

interface SigninUser {
    email: String,
    password: String,
}
interface SignupUser {
    email: String,
    username: String,
    password: String,
    name: String
}

interface FormData {
    name?: string;
    email?: string;
    password?: string;
    username?: string;
}

interface Errors {
    name?: string;
    email?: string;
    password?: string;
    username?: string;
}

interface AuthPageProps {
    isSignup: boolean;
}

export default function AuthPage({ isSignup }: AuthPageProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Check for system preference on component mount
    useEffect(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
    }, []);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        username: ""
    });

    const [errors, setErrors] = useState<Errors>({
        name: "",
        email: "",
        password: "",
        username: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof Errors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    }

    function validateForm() {
        const newErrors = {
            name: "",
            email: "",
            password: "",
            username: "",
        };

        // Full Name validation
        if (isSignup && formData.name && !formData.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (isSignup && formData.name && formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email) {
            if (!formData.email.trim()) {
                newErrors.email = "Email is required";
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = "Please enter a valid email address";
            }
        }

        // Password validation
        if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Username validation for signup
        if (isSignup && formData.username && formData.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).filter(key => newErrors[key as keyof Errors]).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        // Prepare data for submission
         const submitData = isSignup 
        ? {
            name: formData.name?.toUpperCase().trim() || "",
            username: formData.username?.trim() || "",
            email: formData.email?.toLowerCase().trim() || "",
            password: formData.password || ""
        }
        : {
            email: formData.email?.toLowerCase().trim() || "",
            password: formData.password || ""
        };

        try {
            const apiUrl =  `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${isSignup?"signup":"signin"}`  

            const response = axios.post(apiUrl, submitData);

            console.log("Submitting:", response);

        } catch (error) {
            console.error(`${isSignup?"Signup":"Signin"} failed:`, error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen transition-colors duration-300 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            
            <div className="relative z-10">
                <div className="max-w-2xl mx-auto w-full py-8 px-4">
                    <div className="relative backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border overflow-hidden transition-all duration-300  
                            bg-linear-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50
                          
                    ">
                        {/* Header Section with Geometric Design */}
                        <div className="relative p-6 sm:p-8 md:p-10 rounded-t-xl sm:rounded-t-2xl transition-all duration-300 
                          bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900">
                            {/* Geometric overlays */}
                            <div className="absolute inset-0 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                                <div
                                    className="absolute top-0 left-0 w-1/3 h-full bg-linear-to-r from-pink-500/20 to-transparent"
                                    style={{
                                        clipPath: "polygon(0 0, 80% 0, 60% 100%, 0 100%)",
                                    }}
                                ></div>
                                <div
                                    className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-cyan-500/20 to-transparent"
                                    style={{
                                        clipPath: "polygon(40% 0, 100% 0, 100% 100%, 20% 100%)",
                                    }}
                                ></div>
                                
                                {/* Animated geometric shapes */}
                                <div className="absolute inset-0 opacity-10 animate-pulse-slow">
                                    <div className="absolute top-6 left-6 w-8 h-8 border-2 border-white rounded-full animate-spin-slow"></div>
                                    <div className="absolute top-6 right-6 w-8 h-8 border-2 border-white rotate-45 animate-bounce"></div>
                                    <div className="absolute bottom-6 left-6 w-8 h-8 border-2 border-white animate-ping"></div>
                                    <div className="absolute bottom-6 right-6 w-8 h-8 border-2 border-white rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center">
                                    <div className="p-2 rounded-lg bg-gray-800/50">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h1 className="font-bold text-white mb-2 text-2xl sm:text-3xl lg:text-4xl">
                                            Excelidraw<span className="text-cyan-300">.</span>
                                        </h1>
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-200">
                                            {isSignup 
                                                ? "Join our creative community" 
                                                : "Welcome back to your creative space"
                                            }
                                        </p>
                                        <p className="mt-2 text-xs sm:text-sm text-gray-300/70">
                                            {isSignup 
                                                ? "Start creating, collaborating, and bringing ideas to life"
                                                : "Continue your creative journey with us"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute bottom-2 left-4 sm:left-8 w-1 h-4 sm:h-6 bg-linear-to-t from-pink-500 to-transparent"></div>
                            <div className="absolute bottom-2 right-4 sm:right-8 w-1 h-4 sm:h-6 bg-linear-to-t from-cyan-500 to-transparent"></div>
                        </div>

                        {/* Form Section */}
                        <div className="p-6 sm:p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="animate-fade-in">
                                <div className="flex flex-col gap-5 sm:gap-6">
                                    {isSignup && (<>
                                        {/* Full Name */}
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className={`block text-sm font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}
                                            >
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`block w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border transition-all duration-200 ${
                                                    errors.name
                                                        ? "border-red-500 focus:ring-red-500/30"
                                                        : isDarkMode
                                                            ? "border-gray-600 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/30"
                                                            : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30"
                                                } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base`}
                                                placeholder="Enter your full name"
                                                required={isSignup}
                                            />
                                            {errors.name && (
                                                <p className="mt-2 text-xs sm:text-sm text-red-400">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Username */}
                                        <div>
                                            <label
                                                htmlFor="username"
                                                className={`block text-sm font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}
                                            >
                                                Username <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className={`block w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border transition-all duration-200 ${
                                                    errors.username
                                                        ? "border-red-500 focus:ring-red-500/30"
                                                        : isDarkMode
                                                            ? "border-gray-600 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/30"
                                                            : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30"
                                                } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base`}
                                                placeholder="Choose a username"
                                                required={isSignup}
                                            />
                                            {errors.username && (
                                                <p className="mt-2 text-xs sm:text-sm text-red-400">
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>
                                    </>)}

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className={`block text-sm font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}
                                        >
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`block w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border transition-all duration-200 ${
                                                errors.email
                                                    ? "border-red-500 focus:ring-red-500/30"
                                                    : isDarkMode
                                                        ? "border-gray-600 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/30"
                                                        : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30"
                                            } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base`}
                                            placeholder="you@example.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-2 text-xs sm:text-sm text-red-400">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className={`block text-sm font-semibold mb-2 sm:mb-3 ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}
                                        >
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`block w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border transition-all duration-200 ${
                                                errors.password
                                                    ? "border-red-500 focus:ring-red-500/30"
                                                    : isDarkMode
                                                        ? "border-gray-600 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/30"
                                                        : "border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30"
                                            } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base`}
                                            placeholder="••••••••"
                                            required
                                        />
                                        {errors.password && (
                                            <p className="mt-2 text-xs sm:text-sm text-red-400">
                                                {errors.password}
                                            </p>
                                        )}
                                        <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                            Must be at least 6 characters
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="relative mt-8 sm:mt-10 group">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`relative w-full py-4 sm:py-5 px-6 sm:px-8 font-semibold rounded-lg shadow-lg transition-all duration-300 transform overflow-hidden ${
                                            isLoading
                                                ? isDarkMode
                                                    ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                                                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                                : isDarkMode
                                                    ? "bg-linear-to-r from-cyan-600 to-purple-700 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-95"
                                                    : "bg-linear-to-r from-blue-600 to-indigo-700 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-95"
                                        } text-sm sm:text-base`}
                                    >
                                        {/* Animated gradient overlay */}
                                        {!isLoading && (
                                            <div className="absolute inset-0 bg-linear-to-r from-pink-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:via-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                                        )}

                                        {/* Button content */}
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {isLoading ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-5 w-5 sm:h-6 sm:w-6"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    <span>{isSignup ? "Creating account..." : "Signing in..."}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{isSignup ? "Create Account" : "Sign In"}</span>
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </span>

                                        {/* Decorative elements */}
                                        {!isLoading && (
                                            <>
                                                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            </>
                                        )}

                                        {/* Loading state overlay */}
                                        {isLoading && (
                                            <div className={`absolute inset-0 animate-pulse ${
                                                isDarkMode 
                                                    ? 'bg-linear-to-r from-gray-700/30 via-gray-600/20 to-gray-700/30' 
                                                    : 'bg-linear-to-r from-slate-400/30 via-slate-300/20 to-slate-400/30'
                                            }`}></div>
                                        )}
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="relative mt-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-slate-200'}`}></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-gray-800 text-gray-400">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="mt-6">
                                    {/* Google */}
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center py-3 px-4 rounded-lg border transition-colors duration-200 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        Google
                                    </button>
                                    {/* Github */}
                                    {/* <button
                                        type="button"
                                        className="flex items-center justify-center py-3 px-4 rounded-lg border transition-colors duration-200
                                            border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-70'
                                        "
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        GitHub
                                    </button> */}
                                </div>

                                {/* Switch between Sign In/Sign Up */}
                                <div className="mt-8 text-center">
                                    <p className="text-sm text-gray-400">
                                        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                                        <a 
                                            href={isSignup ? "./signin" : "./signup"} 
                                            className="font-semibold transition-colors duration-200
                                                    text-cyan-400 hover:text-cyan-300'
                                             "
                                        >
                                            {isSignup ? "Sign in" : "Sign up"}
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                    © {new Date().getFullYear()} Excelidraw. All rights reserved.
                </p>
                <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-600' : 'text-slate-500'}`}>
                    Where creativity meets collaboration
                </p>
            </div>

        </div>
    );
}