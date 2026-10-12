import { Schema, model } from 'mongoose';

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  type: String,
  minutes: Number,
  points: Number,
  occurredAt: Date,
});

export const Activity = model('Activity', activitySchema);
