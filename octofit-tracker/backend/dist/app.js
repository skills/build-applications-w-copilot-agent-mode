"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.apiBaseUrl = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./config/database");
const models_1 = require("./models");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
(0, database_1.connectToDatabase)().catch(() => undefined);
const port = Number(process.env.PORT || 8000);
exports.port = port;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
exports.apiBaseUrl = apiBaseUrl;
const sampleUsers = [
    { id: '1', name: 'Ava', email: 'ava@example.com', team: 'Blue Squad' },
    { id: '2', name: 'Liam', email: 'liam@example.com', team: 'Green Squad' }
];
const sampleTeams = [
    { id: '1', name: 'Blue Squad', captain: 'Ava', points: 240 },
    { id: '2', name: 'Green Squad', captain: 'Liam', points: 210 }
];
const sampleActivities = [
    { id: '1', user: 'Ava', type: 'run', durationMinutes: 30, points: 30 },
    { id: '2', user: 'Liam', type: 'strength', durationMinutes: 45, points: 45 }
];
const sampleLeaderboard = [
    { id: '1', name: 'Ava', points: 240, rank: 1 },
    { id: '2', name: 'Liam', points: 210, rank: 2 }
];
const sampleWorkouts = [
    { id: '1', title: 'Cardio Burst', focus: 'endurance', durationMinutes: 20 },
    { id: '2', title: 'Core Circuit', focus: 'strength', durationMinutes: 25 }
];
async function readFromDatabase(fallback, query) {
    if (mongoose_1.default.connection.readyState === 1) {
        try {
            return (await query());
        }
        catch (error) {
            console.warn('Falling back to sample data because the database query failed.', error);
        }
    }
    return fallback;
}
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', apiBaseUrl });
});
app.get('/api/users/', async (_req, res) => {
    const users = await readFromDatabase(sampleUsers, async () => models_1.User.find().lean());
    res.json({ items: users, count: users.length, baseUrl: apiBaseUrl });
});
app.get('/api/teams/', async (_req, res) => {
    const teams = await readFromDatabase(sampleTeams, async () => models_1.Team.find().lean());
    res.json({ items: teams, count: teams.length, baseUrl: apiBaseUrl });
});
app.get('/api/activities/', async (_req, res) => {
    const activities = await readFromDatabase(sampleActivities, async () => models_1.Activity.find().lean());
    res.json({ items: activities, count: activities.length, baseUrl: apiBaseUrl });
});
app.get('/api/leaderboard/', async (_req, res) => {
    const leaderboard = await readFromDatabase(sampleLeaderboard, async () => models_1.LeaderboardEntry.find().lean());
    res.json({ items: leaderboard, count: leaderboard.length, baseUrl: apiBaseUrl });
});
app.get('/api/workouts/', async (_req, res) => {
    const workouts = await readFromDatabase(sampleWorkouts, async () => models_1.Workout.find().lean());
    res.json({ items: workouts, count: workouts.length, baseUrl: apiBaseUrl });
});
