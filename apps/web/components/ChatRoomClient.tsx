"use client"
import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatRoomClient({ roomId, initialChats }: { roomId: string, initialChats: Array<String> }) {
    const { socket, loading } = useSocket();
    const [messages, setMessages] = useState<Array<String>>(initialChats);
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if (!loading && socket && socket.readyState === WebSocket.OPEN) {
            console.log("socket", socket);
            socket.send(JSON.stringify({ type: "join-room", roomId }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
        
                if(parsedData.roomId === roomId && parsedData.type === "new-message") {
                    setMessages(prevMessages => [...prevMessages, parsedData.message]);
                }
            };
        }

    }, [socket, loading, roomId]);

    return (
        <div>
            <h2>Chat Room: {roomId}</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>

            <div>
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button onClick={() => {
                    if(socket && currentMessage.trim() !== "") {
                        socket.send(JSON.stringify({
                            type: "send-message",
                            roomId,
                            content: currentMessage
                        }));
                        setMessages(prev => [...prev, currentMessage]);
                        setCurrentMessage("");
                    }
                }}>Send</button>
            </div>
            
        </div>
    );
}