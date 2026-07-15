import mongoose, { Schema, type Document, model } from 'mongoose';

export interface UserDoc extends Document {
  name: string;
  email: string;
  team: string;
}

export interface TeamDoc extends Document {
  name: string;
  captain: string;
  points: number;
}

export interface ActivityDoc extends Document {
  user: string;
  type: string;
  durationMinutes: number;
  points: number;
}

export interface LeaderboardDoc extends Document {
  name: string;
  points: number;
  rank: number;
}

export interface WorkoutDoc extends Document {
  title: string;
  focus: string;
  durationMinutes: number;
}

const userSchema = new Schema<UserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  team: { type: String, required: true }
}, { timestamps: true });

const teamSchema = new Schema<TeamDoc>({
  name: { type: String, required: true },
  captain: { type: String, required: true },
  points: { type: Number, default: 0 }
}, { timestamps: true });

const activitySchema = new Schema<ActivityDoc>({
  user: { type: String, required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  points: { type: Number, default: 0 }
}, { timestamps: true });

const leaderboardSchema = new Schema<LeaderboardDoc>({
  name: { type: String, required: true },
  points: { type: Number, required: true },
  rank: { type: Number, required: true }
}, { timestamps: true });

const workoutSchema = new Schema<WorkoutDoc>({
  title: { type: String, required: true },
  focus: { type: String, required: true },
  durationMinutes: { type: Number, required: true }
}, { timestamps: true });

export const User = mongoose.models.User || model<UserDoc>('User', userSchema);
export const Team = mongoose.models.Team || model<TeamDoc>('Team', teamSchema);
export const Activity = mongoose.models.Activity || model<ActivityDoc>('Activity', activitySchema);
export const LeaderboardEntry = mongoose.models.LeaderboardEntry || model<LeaderboardDoc>('LeaderboardEntry', leaderboardSchema);
export const Workout = mongoose.models.Workout || model<WorkoutDoc>('Workout', workoutSchema);
