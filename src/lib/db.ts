import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI undefined!");
}

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;

  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}
