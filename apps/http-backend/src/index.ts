import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Import user routes
import userRoutes from './routes/user.routes.js';
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`HTTP Backend is running on port ${PORT}`);
});