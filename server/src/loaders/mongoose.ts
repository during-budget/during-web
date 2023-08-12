import mongoose from "mongoose";
import { exit } from "src/utils/process";

export default async (config: { DB_URL: string }) => {
  try {
    await mongoose.connect(config.DB_URL);
    console.log("✅ MongoDB is connected");
  } catch (err) {
    exit("Failed to connect MongoDB");
  }
};
