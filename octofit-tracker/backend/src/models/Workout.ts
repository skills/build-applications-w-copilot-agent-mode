import { Schema, model } from 'mongoose';

const workoutSchema = new Schema({
  title: String,
  focus: String,
  minutes: Number,
  difficulty: String,
});

export const Workout = model('Workout', workoutSchema);
