import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    return cached.conn; // agar pehle se connected hai → wahi return karo
  }

  if (!cached.promise) {
    const opts = {
        bufferCommands: true, // mongoose queries ko tab tak buffer karega jab tak DB connect nahi hota
        maxPoolSize: 10, // ek time par max 10 connections open honge
    };
    mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connect);
  }
  try {
    cached.conn = await cached.promise; // connection ka result cache karo
  } catch (err) {
    cached.promise = null; // agar error aaya to promise reset kar do
    throw err;
  }
  return cached.conn; // final working connection return karo
}
