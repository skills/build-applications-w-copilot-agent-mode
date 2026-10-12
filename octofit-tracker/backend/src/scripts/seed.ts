import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Activity, Team, User, Workout } from '../models/index.js';

// Seed the octofit_db database with representative test data.
export async function seed() {
  await connectDatabase();
  await Activity.deleteMany({});
  await User.deleteMany({});
  await Team.deleteMany({});
  await Workout.deleteMany({});
  // Learners implement idempotent users, teams, activities, leaderboard inputs, and workout records here.
  await disconnectDatabase();
}

if (process.argv[1]?.endsWith('seed.ts')) {
  await seed();
}
