import React from 'react'
import axios from 'axios';
import ChatRoom from '../../../components/ChatRoom';

async function fetchRoomData(slug: string) {
    try {
        const response = await axios.get(`${process.env.BACKEND_URL}/api/room/${slug}`, {
          headers: {
            authorization:`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OTc1MWMwMy01Mzc0LTQwNTQtYTg2ZS0zOGQ4Mzk1NGRmY2QiLCJpYXQiOjE3Njc3MDUyNTR9.G9KmS74kjjLFO8BufBDVYogoscSgXoJHFt2S1OxiJF0`
          }
        });
        return response.data.room.id;
    } catch (error) {
        console.error("Error fetching room data:", error);
    }
}

async function Room({params}: {params: {slug: string}}) {
    const {slug} =  await params;
    const roomId = await fetchRoomData(slug);

  return (
    <div>
      <ChatRoom roomId={roomId} />
    </div>
  )
}

export default Room
