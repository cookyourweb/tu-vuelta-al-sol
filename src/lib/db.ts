//src/lib/db.ts
import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof global & { mongoose: MongooseCache };
let cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = (global as typeof globalWithMongoose).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Validar MONGODB_URI solo cuando se llama a la función, no al importar
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Por favor define la variable de entorno MONGODB_URI');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;