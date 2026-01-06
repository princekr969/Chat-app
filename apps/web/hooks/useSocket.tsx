import { useEffect, useState } from "react";

export default function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        console.log("ws", process.env.NEXT_PUBLIC_WS_BACKEND_URL);
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BACKEND_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OTc1MWMwMy01Mzc0LTQwNTQtYTg2ZS0zOGQ4Mzk1NGRmY2QiLCJpYXQiOjE3Njc3MDMxNzF9.P_mQrbTNMO_uFSHs_bpEc8zr8dAX9maQsIHyXyuHVXA`);

        ws.onopen = () => {
            console.log("WebSocket connection established");
            setSocket(ws);
            setLoading(false);
        };

        ws.onopen = () => {
            console.log("WebSocket connection established");
            setSocket(ws);
            setLoading(false);
        };

        ws.onclose = (event) => {
            console.log("WebSocket disconnected", event.code, event.reason);
            setSocket(null);
            setLoading(true);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // CLEANUP FUNCTION: This is crucial!
        return () => {
            console.log("Cleaning up WebSocket...");
            ws.close();
        };

    }, []);
    
    return { socket, loading };
}