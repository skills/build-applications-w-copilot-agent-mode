import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

export async function connectToDatabase() {
  if (db.readyState === 1) {
    return db;
  }

  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
    return db;
  } catch (error) {
    console.warn('Unable to connect to octofit_db; API routes will fall back to sample data.', error);
    return db;
  }
}

export default db;
