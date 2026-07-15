import mongoose from 'mongoose';
import { connectToDatabase } from '../config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export function buildSeedData() {
  return {
    users: [
      { name: 'Ava Chen', email: 'ava.chen@example.com', team: 'Blue Squad' },
      { name: 'Liam Ortiz', email: 'liam.ortiz@example.com', team: 'Green Squad' },
      { name: 'Mina Patel', email: 'mina.patel@example.com', team: 'Blue Squad' }
    ],
    teams: [
      { name: 'Blue Squad', captain: 'Ava Chen', points: 240 },
      { name: 'Green Squad', captain: 'Liam Ortiz', points: 210 }
    ],
    activities: [
      { user: 'Ava Chen', type: 'run', durationMinutes: 30, points: 30 },
      { user: 'Liam Ortiz', type: 'strength', durationMinutes: 45, points: 45 },
      { user: 'Mina Patel', type: 'cycling', durationMinutes: 40, points: 35 }
    ],
    leaderboard: [
      { name: 'Ava Chen', points: 240, rank: 1 },
      { name: 'Liam Ortiz', points: 210, rank: 2 },
      { name: 'Mina Patel', points: 180, rank: 3 }
    ],
    workouts: [
      { title: 'Cardio Burst', focus: 'endurance', durationMinutes: 20 },
      { title: 'Core Circuit', focus: 'strength', durationMinutes: 25 },
      { title: 'Recovery Flow', focus: 'mobility', durationMinutes: 15 }
    ]
  };
}

/**
 * Seed the octofit_db database with test data
 */
export async function seedDatabase() {
  try {
    await connectToDatabase();
    console.log('Seed the octofit_db database with test data');

    const seedData = buildSeedData();

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const [users, teams, activities, leaderboard, workouts] = await Promise.all([
      User.create(seedData.users),
      Team.create(seedData.teams),
      Activity.create(seedData.activities),
      LeaderboardEntry.create(seedData.leaderboard),
      Workout.create(seedData.workouts)
    ]);

    console.log('Database seeding complete');
    return { users, teams, activities, leaderboard, workouts };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  seedDatabase().catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
}
