import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { connectToDatabase } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const app = express();
app.use(express.json());

connectToDatabase().catch(() => undefined);

const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

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

async function readFromDatabase<T>(fallback: T[], query: () => Promise<unknown[]>) {
  if (mongoose.connection.readyState === 1) {
    try {
      return (await query()) as T[];
    } catch (error) {
      console.warn('Falling back to sample data because the database query failed.', error);
    }
  }
  return fallback;
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', apiBaseUrl });
});

app.get('/api/users/', async (_req: Request, res: Response) => {
  const users = await readFromDatabase(sampleUsers, async () => User.find().lean());
  res.json({ items: users, count: users.length, baseUrl: apiBaseUrl });
});

app.get('/api/teams/', async (_req: Request, res: Response) => {
  const teams = await readFromDatabase(sampleTeams, async () => Team.find().lean());
  res.json({ items: teams, count: teams.length, baseUrl: apiBaseUrl });
});

app.get('/api/activities/', async (_req: Request, res: Response) => {
  const activities = await readFromDatabase(sampleActivities, async () => Activity.find().lean());
  res.json({ items: activities, count: activities.length, baseUrl: apiBaseUrl });
});

app.get('/api/leaderboard/', async (_req: Request, res: Response) => {
  const leaderboard = await readFromDatabase(sampleLeaderboard, async () => LeaderboardEntry.find().lean());
  res.json({ items: leaderboard, count: leaderboard.length, baseUrl: apiBaseUrl });
});

app.get('/api/workouts/', async (_req: Request, res: Response) => {
  const workouts = await readFromDatabase(sampleWorkouts, async () => Workout.find().lean());
  res.json({ items: workouts, count: workouts.length, baseUrl: apiBaseUrl });
});

export { app, apiBaseUrl, port };
