import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());


// console.log("--- DEBUG ENVIRONMENT ---");
// console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
// console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 15));
// console.log("-------------------------");

// Import user routes
import userRoutes from './routes/user.routes.js';
import chatRoomRoutes from './routes/chatRoom.routes.js';

app.use('/api/user', userRoutes);
app.use('/api', chatRoomRoutes);

app.listen(PORT, () => {
    console.log(`HTTP Backend is running on port ${PORT}`);
});