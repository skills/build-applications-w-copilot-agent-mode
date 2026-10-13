import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: String,
  mascot: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const Team = model('Team', teamSchema);
