import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      autoIndex: true
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Database connection error: ${error.message}`);
    // In production we exit; in dev we log and let nodemon or retry handle it
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};
