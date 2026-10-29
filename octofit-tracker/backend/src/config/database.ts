import mongoose from 'mongoose';

export function mongoUri() {
  return process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';
}

export async function connectDatabase(uri = mongoUri()) {
  mongoose.set('strictQuery', true);
  return mongoose.connect(uri);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
