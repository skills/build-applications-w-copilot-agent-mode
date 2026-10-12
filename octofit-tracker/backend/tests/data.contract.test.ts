import { describe, expect, it } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { seed } from '../src/scripts/seed.js';
import { Activity, Team, User, Workout } from '../src/models/index.js';

describe('OctoFit data contract', () => {
  it('requires meaningful user identity and goals', async () => {
    const user = new User({});
    const error = user.validateSync();
    expect(error?.errors.name).toBeDefined();
    expect(error?.errors.email).toBeDefined();
    expect(error?.errors.fitnessGoal).toBeDefined();
  });
  it('requires teams to have a name, mascot, and members array', () => {
    const team = new Team({ name: 'Octocats', mascot: 'Mona', members: [] });
    expect(team.validateSync()).toBeUndefined();
    const missing = new Team({}).validateSync();
    expect(missing?.errors.name).toBeDefined();
    expect(missing?.errors.mascot).toBeDefined();
  });
  it('requires activities to connect users, teams, minutes, points, and dates', () => {
    const activity = new Activity({ type: 'run' });
    const error = activity.validateSync();
    expect(error?.errors.user).toBeDefined();
    expect(error?.errors.team).toBeDefined();
    expect(error?.errors.minutes).toBeDefined();
    expect(error?.errors.points).toBeDefined();
    expect(error?.errors.occurredAt).toBeDefined();
  });
  it('defines workout suggestions with focus, duration, and difficulty', () => {
    const workout = new Workout({ title: 'Intervals' });
    const error = workout.validateSync();
    expect(error?.errors.focus).toBeDefined();
    expect(error?.errors.minutes).toBeDefined();
    expect(error?.errors.difficulty).toBeDefined();
  });

  it('seeds representative data for all four capabilities idempotently', async () => {
    const mongo = await MongoMemoryServer.create();
    const previousUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = mongo.getUri();
    try {
      const counts = async () => {
        await mongoose.connect(mongo.getUri());
        const result = {
          users: await User.countDocuments(),
          teams: await Team.countDocuments(),
          activities: await Activity.countDocuments(),
          workouts: await Workout.countDocuments(),
        };
        await mongoose.disconnect();
        return result;
      };
      await seed();
      const first = await counts();
      expect(first.users).toBeGreaterThanOrEqual(2);
      expect(first.teams).toBeGreaterThanOrEqual(2);
      expect(first.activities).toBeGreaterThanOrEqual(2);
      expect(first.workouts).toBeGreaterThanOrEqual(2);
      await seed();
      expect(await counts()).toEqual(first);
    } finally {
      if (previousUri === undefined) delete process.env.MONGODB_URI;
      else process.env.MONGODB_URI = previousUri;
      await mongoose.disconnect();
      await mongo.stop();
    }
  }, 60_000);
});
