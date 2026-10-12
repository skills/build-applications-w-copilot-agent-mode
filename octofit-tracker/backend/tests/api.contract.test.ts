import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { Activity, Team, User, Workout } from '../src/models/index.js';

let mongo: MongoMemoryServer;
const app = createApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
beforeEach(async () => {
  await Promise.all([Activity.deleteMany({}), Team.deleteMany({}), User.deleteMany({}), Workout.deleteMany({})]);
});

async function createUserAndTeam(name: string, email: string, mascot: string) {
  const team = await Team.create({ name: `${name} team`, mascot, members: [] });
  const user = await User.create({ name, email, team: team._id, fitnessGoal: 'endurance' });
  await Team.updateOne({ _id: team._id }, { $addToSet: { members: user._id } });
  return { user, team };
}

describe('OctoFit API contract', () => {
  it('creates and lists valid activities while rejecting invalid input', async () => {
    const { user, team } = await createUserAndTeam('Mona', 'mona@example.com', 'Mona');
    const invalid = await request(app).post('/api/activities').send({});
    expect(invalid.status).toBe(400);
    const created = await request(app).post('/api/activities').send({ userId: user._id.toString(), teamId: team._id.toString(), type: 'run', minutes: 30 });
    expect(created.status).toBe(201);
    const listed = await request(app).get('/api/activities');
    expect(listed.body.activities).toHaveLength(1);
  });
  it('creates teams and exposes members', async () => {
    const member = await User.create({ name: 'Mona', email: 'mona@example.com', fitnessGoal: 'endurance' });
    const created = await request(app).post('/api/teams').send({ name: 'Octocats', mascot: 'Mona', members: [member._id.toString()] });
    expect(created.status).toBe(201);
    const listed = await request(app).get('/api/teams');
    expect(listed.body.teams[0].members.map((id: string) => id.toString())).toContain(member._id.toString());
  });
  it('orders leaderboard entries by total points', async () => {
    const mona = await createUserAndTeam('Mona', 'mona@example.com', 'Mona');
    const hubot = await createUserAndTeam('Hubot', 'hubot@example.com', 'Hubot');
    await request(app).post('/api/activities').send({ userId: mona.user._id.toString(), teamId: mona.team._id.toString(), type: 'run', minutes: 40 });
    await request(app).post('/api/activities').send({ userId: hubot.user._id.toString(), teamId: hubot.team._id.toString(), type: 'cycle', minutes: 10 });
    const response = await request(app).get('/api/leaderboard');
    expect(response.body.leaderboard.map((entry: { teamName: string }) => entry.teamName)).toEqual(['Octocats', 'Robocats']);
  });
  it('suggests an endurance workout from a user activity pattern', async () => {
    const team = await Team.create({ name: 'Octocats', mascot: 'Mona', members: [] });
    const user = await User.create({ name: 'Mona', email: 'mona@example.com', team: team._id, fitnessGoal: 'endurance' });
    await Team.updateOne({ _id: team._id }, { $set: { members: [user._id] } });
    await Activity.create({ user: user._id, team: team._id, type: 'run', minutes: 40, points: 40, occurredAt: new Date() });
    await Workout.create([
      { title: 'Intervals', focus: 'endurance', minutes: 30, difficulty: 'moderate' },
      { title: 'Strength Circuit', focus: 'strength', minutes: 30, difficulty: 'moderate' },
    ]);

    const response = await request(app).get('/api/workouts/suggestions/mona%40example.com');
    expect(response.status).toBe(200);
    expect(response.body.suggestions[0]).toMatchObject({ title: 'Intervals', reason: expect.stringMatching(/run|endurance|activity/i) });
  });
});
