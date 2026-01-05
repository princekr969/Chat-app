import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

// Import user routes
import userRoutes from './routes/user.routes.js';
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`HTTP Backend is running on port ${PORT}`);
});