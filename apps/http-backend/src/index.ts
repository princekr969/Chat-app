import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Import user routes
import userRoutes from './routes/user.routes.js';
import chatRoomRoutes from './routes/chatRoom.routes.js';

app.use('/api/user', userRoutes);
app.use('/api', chatRoomRoutes);

app.listen(PORT, () => {
    console.log(`HTTP Backend is running on port ${PORT}`);
});