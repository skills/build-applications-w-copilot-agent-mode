import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  fitnessGoal: String,
});

export const User = model('User', userSchema);
