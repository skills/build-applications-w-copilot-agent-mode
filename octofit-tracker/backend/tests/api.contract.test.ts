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
}, 60_000);
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
beforeEach(async () => {
  await Promise.all([Activity.deleteMany({}), Team.deleteMany({}), User.deleteMany({}), Workout.deleteMany({})]);
});

async function createUserAndTeam(name: string, email: string, mascot: string, teamName = `${name} team`) {
  const team = await Team.create({ name: teamName, mascot, members: [] });
  const user = await User.create({ name, email, team: team._id, fitnessGoal: 'endurance' });
  await Team.updateOne({ _id: team._id }, { $addToSet: { members: user._id } });
  return { user, team };
}

describe('OctoFit API contract', () => {
  it('creates and lists valid activities while rejecting invalid input', async () => {
    const { user, team } = await createUserAndTeam('Mona', 'mona@example.com', 'Mona');
    const invalid = await request(app).post('/api/activities').send({});
    expect(invalid.status).toBe(400);
    const missingReferences = await request(app).post('/api/activities').send({ userId: new mongoose.Types.ObjectId().toString(), teamId: new mongoose.Types.ObjectId().toString(), type: 'run', minutes: 30 });
    expect(missingReferences.status).toBeGreaterThanOrEqual(400);
    expect(missingReferences.status).toBeLessThan(500);
    for (const malformed of [{ userId: 'not-an-id', teamId: team._id.toString() }, { userId: user._id.toString(), teamId: 'not-an-id' }]) {
      const response = await request(app).post('/api/activities').send({ ...malformed, type: 'run', minutes: 30 });
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    }
    expect(await Activity.countDocuments()).toBe(0);
    const created = await request(app).post('/api/activities').send({ userId: user._id.toString(), teamId: team._id.toString(), type: 'run', minutes: 30 });
    expect(created.status).toBe(201);
    const listed = await request(app).get('/api/activities');
    expect(listed.body.activities).toHaveLength(1);
    for (const activity of [created.body.activity, listed.body.activities[0]]) {
      expect(activity).toMatchObject({ user: user._id.toString(), team: team._id.toString(), type: 'run', minutes: 30 });
      expect(activity.points).toBeGreaterThan(0);
      expect(Number.isNaN(Date.parse(activity.occurredAt))).toBe(false);
    }
  });
  it('creates teams and exposes members', async () => {
    const member = await User.create({ name: 'Mona', email: 'mona@example.com', fitnessGoal: 'endurance' });
    const invalid = await request(app).post('/api/teams').send({ mascot: 'Mona' });
    expect(invalid.status).toBe(400);
    const created = await request(app).post('/api/teams').send({ name: 'Octocats', mascot: 'Mona', members: [member._id.toString()] });
    expect(created.status).toBe(201);
    expect(created.body.team).toMatchObject({ name: 'Octocats', mascot: 'Mona' });
    const listed = await request(app).get('/api/teams');
    expect(listed.body.teams).toHaveLength(1);
    expect(listed.body.teams[0]).toMatchObject({ name: 'Octocats', mascot: 'Mona' });
    expect(listed.body.teams[0].members.map((id: string) => id.toString())).toContain(member._id.toString());
  });
  it('orders leaderboard entries by total points', async () => {
    const mona = await createUserAndTeam('Mona', 'mona@example.com', 'Mona', 'Octocats');
    const hubot = await createUserAndTeam('Hubot', 'hubot@example.com', 'Hubot', 'Robocats');
    await Activity.create([
      { user: mona.user._id, team: mona.team._id, type: 'run', minutes: 25, points: 25, occurredAt: new Date() },
      { user: hubot.user._id, team: hubot.team._id, type: 'cycle', minutes: 20, points: 20, occurredAt: new Date() },
      { user: hubot.user._id, team: hubot.team._id, type: 'strength', minutes: 15, points: 15, occurredAt: new Date() },
    ]);
    const response = await request(app).get('/api/leaderboard');
    expect(response.status).toBe(200);
    expect(response.body.leaderboard.map(({ teamName, totalPoints, rank }: { teamName: string; totalPoints: number; rank: number }) => ({ teamName, totalPoints, rank }))).toEqual([
      { teamName: 'Robocats', totalPoints: 35, rank: 1 },
      { teamName: 'Octocats', totalPoints: 25, rank: 2 },
    ]);
  });
  it('suggests workouts that match each user activity pattern', async () => {
    const mona = await createUserAndTeam('Mona', 'mona@example.com', 'Mona', 'Octocats');
    const hubot = await createUserAndTeam('Hubot', 'hubot@example.com', 'Hubot', 'Robocats');
    await User.updateOne({ _id: hubot.user._id }, { $set: { fitnessGoal: 'strength' } });
    await Activity.create([
      { user: mona.user._id, team: mona.team._id, type: 'run', minutes: 40, points: 40, occurredAt: new Date() },
      { user: hubot.user._id, team: hubot.team._id, type: 'strength', minutes: 20, points: 20, occurredAt: new Date() },
    ]);
    await Workout.create([
      { title: 'Intervals', focus: 'endurance', minutes: 30, difficulty: 'moderate' },
      { title: 'Strength Circuit', focus: 'strength', minutes: 30, difficulty: 'moderate' },
    ]);

    const monaResponse = await request(app).get('/api/workouts/suggestions/mona%40example.com');
    expect(monaResponse.status).toBe(200);
    expect(monaResponse.body.suggestions[0]).toMatchObject({ title: 'Intervals', focus: 'endurance', reason: expect.stringMatching(/run|endurance|activity/i) });

    const hubotResponse = await request(app).get('/api/workouts/suggestions/hubot%40example.com');
    expect(hubotResponse.status).toBe(200);
    expect(hubotResponse.body.suggestions[0]).toMatchObject({ title: 'Strength Circuit', focus: 'strength', reason: expect.stringMatching(/strength|activity/i) });

    const unknownResponse = await request(app).get('/api/workouts/suggestions/nobody%40example.com');
    expect(unknownResponse.status).toBeGreaterThanOrEqual(400);
    expect(unknownResponse.status).toBeLessThan(500);
  });
});
