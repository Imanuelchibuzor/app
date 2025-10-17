import mongoose from "mongoose";

import AppError from "../configs/error";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new AppError("MONGO_URI is not defined in environment", 500, {
      isOperational: false,
    });
  }

  try {
    await mongoose.connect(uri);
    console.log("Database Connected");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // wrapped in the library error so the caller can inspect / log consistently
    throw new AppError(`Failed to connect to MongoDB: ${msg}`, 500, {
      isOperational: false,
    });
  }
};

export default connectDB;
