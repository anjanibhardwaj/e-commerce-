import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Future backend integration module
 */
export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI;
    if (!connUri) {
      throw new Error("MONGODB_URI environment variable is missing.");
    }

    const conn = await mongoose.connect(connUri, {
      autoIndex: true,
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Database connection error: ${error.message}`);
    process.exit(1);
  }
};
