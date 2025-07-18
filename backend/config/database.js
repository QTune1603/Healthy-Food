const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Fallback to default MongoDB URI if env var is not set
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/healthy-food';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 