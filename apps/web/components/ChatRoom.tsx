import axios from "axios";
import ChatRoomClient from "./ChatRoomClient";

async function fetchRoomChats(roomId: string) {
    try {
        const response = await axios.get(`${process.env.BACKEND_URL}/api/chat/${roomId}`,{
            headers: {
                authorization:`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OTc1MWMwMy01Mzc0LTQwNTQtYTg2ZS0zOGQ4Mzk1NGRmY2QiLCJpYXQiOjE3Njc3MDUyNTR9.G9KmS74kjjLFO8BufBDVYogoscSgXoJHFt2S1OxiJF0`
            }
        });
        const contents = response.data.chats.map(
            (c: { content: string }) => c.content
            );

        return contents;
    } catch (error) {
        console.error("Error fetching room chats:", error);
        throw error;
    }
}

async function ChatRoom({ roomId }: { roomId: string }) {
    const chats = await fetchRoomChats(roomId);
  
    return (
        <div>
            <ChatRoomClient roomId={roomId} initialChats={chats} />
        </div>
    )
}

export default ChatRoom;