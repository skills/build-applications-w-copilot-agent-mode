import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Activity, Team, User, Workout } from '../models/index.js';

// Seed stable demo records without clearing data owned by the application.
export async function seed() {
  await connectDatabase();
  try {
    const octocats = await Team.findOneAndUpdate(
      { name: 'Octocats' },
      { $set: { name: 'Octocats', mascot: 'Mona' } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    const robocats = await Team.findOneAndUpdate(
      { name: 'Robocats' },
      { $set: { name: 'Robocats', mascot: 'Hubot' } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    const mona = await User.findOneAndUpdate(
      { email: 'mona@example.com' },
      { $set: { name: 'Mona', email: 'mona@example.com', team: octocats._id, fitnessGoal: 'endurance' } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    const hubot = await User.findOneAndUpdate(
      { email: 'hubot@example.com' },
      { $set: { name: 'Hubot', email: 'hubot@example.com', team: robocats._id, fitnessGoal: 'strength' } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await Team.updateOne({ _id: octocats._id }, { $addToSet: { members: mona._id } });
    await Team.updateOne({ _id: robocats._id }, { $addToSet: { members: hubot._id } });

    const monaRunAt = new Date('2026-01-10T12:00:00.000Z');
    const hubotCycleAt = new Date('2026-01-11T12:00:00.000Z');
    await Activity.updateOne(
      { user: mona._id, team: octocats._id, type: 'run', occurredAt: monaRunAt },
      { $set: { user: mona._id, team: octocats._id, type: 'run', minutes: 40, points: 40, occurredAt: monaRunAt } },
      { upsert: true },
    );
    await Activity.updateOne(
      { user: hubot._id, team: robocats._id, type: 'cycle', occurredAt: hubotCycleAt },
      { $set: { user: hubot._id, team: robocats._id, type: 'cycle', minutes: 25, points: 25, occurredAt: hubotCycleAt } },
      { upsert: true },
    );
    await Workout.updateOne(
      { title: 'Intervals' },
      { $set: { title: 'Intervals', focus: 'endurance', minutes: 30, difficulty: 'moderate' } },
      { upsert: true },
    );
    await Workout.updateOne(
      { title: 'Strength Circuit' },
      { $set: { title: 'Strength Circuit', focus: 'strength', minutes: 30, difficulty: 'moderate' } },
      { upsert: true },
    );
  } finally {
    await disconnectDatabase();
  }
}

if (process.argv[1]?.endsWith('seed.ts')) {
  await seed();
}
