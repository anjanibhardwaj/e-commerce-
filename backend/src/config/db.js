import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async (maxRetries = 1) => {
  const isAtlas = config.mongoUri.includes('mongodb+srv') || config.mongoUri.includes('ssl=true');
  const primaryOpts = isAtlas
    ? { autoIndex: true, tls: true, serverSelectionTimeoutMS: 2500 }
    : { autoIndex: true, serverSelectionTimeoutMS: 2500 };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[MongoDB] Connecting to primary database (attempt ${attempt}/${maxRetries})...`);
      const conn = await mongoose.connect(config.mongoUri, primaryOpts);
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.warn(`[MongoDB] Primary connection attempt ${attempt} failed: ${error.message}`);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  // Graceful fallback to local MongoDB if Atlas has IP restriction or network throttle
  if (isAtlas) {
    try {
      console.log(`[MongoDB] Atlas unavailable, falling back to local MongoDB on port 27017...`);
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/medical-ecommerce', {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log(`[MongoDB] Connected successfully to local fallback: ${fallbackConn.connection.host}`);
      return fallbackConn;
    } catch (localErr) {
      console.error(`[MongoDB] Local fallback error: ${localErr.message}`);
    }
  }

  if (config.nodeEnv === 'production') {
    process.exit(1);
  }
};
