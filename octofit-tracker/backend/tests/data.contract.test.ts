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
    const defaulted = new Team({ name: 'Robocats', mascot: 'Hubot' });
    expect(Array.isArray(defaulted.members)).toBe(true);
    expect(defaulted.members).toHaveLength(0);
    const memberId = new mongoose.Types.ObjectId();
    const withMember = new Team({ name: 'Codecats', mascot: 'Copilot', members: [memberId.toString()] });
    expect(withMember.members.map((member) => member.toString())).toEqual([memberId.toString()]);
    const missing = new Team({}).validateSync();
    expect(missing?.errors.name).toBeDefined();
    expect(missing?.errors.mascot).toBeDefined();
  });
  it('requires activities to connect users, teams, types, minutes, points, and dates', () => {
    const activity = new Activity({});
    const error = activity.validateSync();
    expect(error?.errors.type).toBeDefined();
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
      await mongoose.connect(mongo.getUri());
      const sentinelTeam = await Team.create({ name: 'Unrelated team', mascot: 'Keep', members: [] });
      const sentinelUser = await User.create({
        name: 'Unrelated user',
        email: 'unrelated@example.com',
        team: sentinelTeam._id,
        fitnessGoal: 'mobility',
      });
      await Team.updateOne({ _id: sentinelTeam._id }, { $addToSet: { members: sentinelUser._id } });
      const previousTeam = await Team.create({ name: 'Previous team', mascot: 'Mona', members: [] });
      const existingMona = await User.create({
        name: 'Mona',
        email: 'mona@example.com',
        team: previousTeam._id,
        fitnessGoal: 'endurance',
      });
      await Team.updateOne({ _id: previousTeam._id }, { $addToSet: { members: existingMona._id } });
      const sentinelActivity = await Activity.create({
        user: sentinelUser._id,
        team: sentinelTeam._id,
        type: 'walk',
        minutes: 10,
        points: 10,
        occurredAt: new Date('2026-01-01T12:00:00.000Z'),
      });
      const sentinelWorkout = await Workout.create({
        title: 'Unrelated workout',
        focus: 'mobility',
        minutes: 15,
        difficulty: 'easy',
      });
      await mongoose.disconnect();

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
      expect(first.users).toBeGreaterThanOrEqual(3);
      expect(first.teams).toBeGreaterThanOrEqual(4);
      expect(first.activities).toBeGreaterThanOrEqual(3);
      expect(first.workouts).toBeGreaterThanOrEqual(3);
      await mongoose.connect(mongo.getUri());
      const seededMona = await User.findOne({ email: 'mona@example.com' });
      const seededTeam = await Team.findOne({ name: 'Octocats' });
      const retainedPreviousTeam = await Team.findById(previousTeam._id);
      expect(seededMona).toBeTruthy();
      expect(seededTeam).toBeTruthy();
      expect(retainedPreviousTeam).toBeTruthy();
      if (!seededMona || !seededTeam || !seededMona.team || !retainedPreviousTeam) throw new Error('Seed did not create linked Octocats fixtures');
      expect(seededMona.team.toString()).toBe(seededTeam._id.toString());
      expect(seededTeam.members.map((member) => member.toString())).toContain(seededMona._id.toString());
      expect(retainedPreviousTeam.members.map((member) => member.toString())).not.toContain(seededMona._id.toString());
      expect(await Activity.exists({ user: seededMona._id, team: seededTeam._id, type: 'run' })).toBeTruthy();
      expect(await User.exists({ _id: sentinelUser._id })).toBeTruthy();
      expect(await Team.exists({ _id: sentinelTeam._id })).toBeTruthy();
      expect(await Activity.exists({ _id: sentinelActivity._id })).toBeTruthy();
      expect(await Workout.exists({ _id: sentinelWorkout._id })).toBeTruthy();
      await mongoose.disconnect();
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
