import mongoose from "mongoose";

let isConnected = false;

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("✅ MongoDB is connected");
    isConnected = true;
  })
  .catch((err) => {
    console.log("MongoDB connection failed: ", err);
    process.exit(1);
  });

export { mongoose, isConnected };
