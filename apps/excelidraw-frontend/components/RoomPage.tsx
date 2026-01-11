'use client'
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type RoomPageProps = {
    mode: 'create' | 'join';
};

export default function RoomPage({ mode }: RoomPageProps) {
    const router = useRouter();
    const [roomIdentifier, setRoomIdentifier] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem('authToken');

    const isCreateMode = mode === 'create';

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (!roomIdentifier.trim()) {
            setError(isCreateMode ? "Room name is required" : "Room ID or name is required");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            if (isCreateMode) {

                const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-room`;
                const response = await axios.post(apiUrl, { roomName: roomIdentifier },{
                    headers:{
                        Authorization:token
                    }
                });
                const { slug } = response.data.room;
                router.push(`/canvas/${slug}`);
            } else {
                const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/join?${token}`;
                const response = await axios.post(apiUrl, { identifier: roomIdentifier });
                const { roomId } = response.data;
                router.push(`/canvas/${roomId}`);
            }

        } catch (error: any) {
            console.error(`Error ${isCreateMode ? 'creating' : 'joining'} room:`, error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const getHeaderInfo = () => {
        if (isCreateMode) {
            return {
                title: "Create Room",
                subtitle: "Start a new collaborative drawing session",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Check circle
                placeholder: "Enter room name (e.g., Design Session)",
                buttonText: "Create Room",
                loadingText: "Creating Room..."
            };
        } else {
            return {
                title: "Join Room",
                subtitle: "Enter an existing room ID or name",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", // User group
                placeholder: "Enter room ID or name",
                buttonText: "Join Room",
                loadingText: "Joining Room..."
            };
        }
    };

    const getFeatures = () => {
        const commonFeatures = [
            "Real-time collaboration",
            "Unlimited participants",
            "Drawing tools & shapes",
            "Export capabilities"
        ];

        if (isCreateMode) {
            return [
                ...commonFeatures,
                "Customizable room settings",
                "Room owner controls"
            ];
        } else {
            return [
                ...commonFeatures,
                "Instant collaboration",
                "No registration required"
            ];
        }
    };

    const headerInfo = getHeaderInfo();
    const features = getFeatures();

    return (
        <div className="min-h-screen transition-colors duration-300 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            
            <div className="relative z-10">
                <div className="max-w-2xl mx-auto w-full py-8 px-4">
                    <div className="relative backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border overflow-hidden transition-all duration-300  
                            bg-linear-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50">
                        
                        {/* Header Section */}
                        <div className={`relative p-6 sm:p-8 md:p-10 rounded-t-xl sm:rounded-t-2xl transition-all duration-300 
                          bg-linear-to-r ${isCreateMode ? 'from-indigo-900 via-purple-900 to-blue-900' : 'from-emerald-900 via-teal-900 to-cyan-900'}`}>
                            
                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center">
                                    <div className="p-2 rounded-lg bg-gray-800/50">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={headerInfo.icon} />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h1 className="font-bold text-white mb-2 text-2xl sm:text-3xl lg:text-4xl">
                                            {headerInfo.title}<span className={isCreateMode ? "text-cyan-300" : "text-emerald-300"}>.</span>
                                        </h1>
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-200">
                                            {headerInfo.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className={`absolute bottom-2 left-4 sm:left-8 w-1 h-4 sm:h-6 bg-linear-to-t ${isCreateMode ? 'from-pink-500' : 'from-green-500'} to-transparent`}></div>
                            <div className={`absolute bottom-2 right-4 sm:right-8 w-1 h-4 sm:h-6 bg-linear-to-t ${isCreateMode ? 'from-cyan-500' : 'from-teal-500'} to-transparent`}></div>
                        </div>

                        {/* Form Section */}
                        <div className="p-6 sm:p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="animate-fade-in">
                                <div className="flex flex-col gap-5 sm:gap-6">
                                    <div>
                                        <label
                                            htmlFor="roomIdentifier"
                                            className="block text-sm font-semibold mb-2 sm:mb-3 text-gray-200"
                                        >
                                            {isCreateMode ? "Room Name" : "Room ID/Name"} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="roomIdentifier"
                                            name="roomIdentifier"
                                            type="text"
                                            value={roomIdentifier}
                                            onChange={(e) => {
                                                setRoomIdentifier(e.target.value);
                                                setError("");
                                            }}
                                            className={`block w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg border transition-all duration-200 
                                                ${error 
                                                    ? "border-red-500 focus:ring-red-500/30" 
                                                    : "border-gray-600 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/30"
                                                } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base`}
                                            placeholder={headerInfo.placeholder}
                                            disabled={isLoading}
                                        />
                                        {error && (
                                            <p className="mt-2 text-xs sm:text-sm text-red-400">
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    {/* Features List */}
                                    <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                        <h3 className={`text-sm font-semibold ${isCreateMode ? 'text-cyan-300' : 'text-emerald-300'} mb-2`}>
                                            {isCreateMode ? "Features included:" : "What you'll get:"}
                                        </h3>
                                        <ul className="text-sm text-gray-300 space-y-1">
                                            {features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="relative mt-8 sm:mt-10 group">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`relative w-full py-4 sm:py-5 px-6 sm:px-8 font-semibold rounded-lg shadow-lg transition-all duration-300 transform overflow-hidden 
                                            ${isLoading
                                                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                                                : `bg-linear-to-r ${isCreateMode ? 'from-cyan-600 to-purple-700' : 'from-emerald-600 to-teal-700'} text-white hover:shadow-2xl hover:scale-[1.02] active:scale-95`
                                            } text-sm sm:text-base`}
                                    >
                                        {/* Animated gradient overlay */}
                                        {!isLoading && (
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/0 to-transparent group-hover:via-white/10 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
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
                                                    <span>{headerInfo.loadingText}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{headerInfo.buttonText}</span>
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </span>

                                        {/* Decorative elements */}
                                        {!isLoading && (
                                            <>
                                                <div className={`absolute top-0 left-0 w-1 h-full bg-linear-to-b ${isCreateMode ? 'from-pink-500' : 'from-green-500'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                                <div className={`absolute top-0 right-0 w-1 h-full bg-linear-to-b ${isCreateMode ? 'from-cyan-500' : 'from-teal-500'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Switch mode option */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-400">
                                        {isCreateMode 
                                            ? "Want to join an existing room?" 
                                            : "Want to create a new room?"}{" "}
                                        <button
                                            type="button"
                                            onClick={() => router.push(isCreateMode ? '/join' : '/create')}
                                            className={`font-semibold transition-colors duration-200 ${
                                                isCreateMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-cyan-400 hover:text-cyan-300'
                                            }`}
                                        >
                                            {isCreateMode ? "Join Room" : "Create Room"}
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Excelidraw. All rights reserved.
                </p>
                <p className="mt-1 text-xs text-gray-600">
                    Where creativity meets collaboration
                </p>
            </div>
        </div>
    );
}