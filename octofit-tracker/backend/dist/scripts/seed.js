"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSeedData = buildSeedData;
exports.seedDatabase = seedDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const models_1 = require("../models");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
function buildSeedData() {
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
async function seedDatabase() {
    try {
        await (0, database_1.connectToDatabase)();
        console.log('Seed the octofit_db database with test data');
        const seedData = buildSeedData();
        await Promise.all([
            models_1.User.deleteMany({}),
            models_1.Team.deleteMany({}),
            models_1.Activity.deleteMany({}),
            models_1.LeaderboardEntry.deleteMany({}),
            models_1.Workout.deleteMany({})
        ]);
        const [users, teams, activities, leaderboard, workouts] = await Promise.all([
            models_1.User.create(seedData.users),
            models_1.Team.create(seedData.teams),
            models_1.Activity.create(seedData.activities),
            models_1.LeaderboardEntry.create(seedData.leaderboard),
            models_1.Workout.create(seedData.workouts)
        ]);
        console.log('Database seeding complete');
        return { users, teams, activities, leaderboard, workouts };
    }
    catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
if (require.main === module) {
    seedDatabase().catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    });
}
