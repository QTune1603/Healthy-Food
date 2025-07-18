const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/blog', require('../routes/blog'));
app.use('/api/address', require('../routes/address'));
app.use('/api/body-metrics', require('../routes/bodyMetrics'));
app.use('/api/food', require('../routes/food'));
app.use('/api/food-diary', require('../routes/foodDiary'));
app.use('/api/calorie', require('../routes/calorie'));
app.use('/api/meal-suggestions', require('../routes/mealSuggestion'));
app.use('/api/dashboard', require('../routes/dashboard'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 