import { Activity, Team, User, Workout } from '../models/index.js';

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(_input: unknown) {
  throw Object.assign(new Error('A validação de atividades ainda não foi implementada'), { status: 501 });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(_input: unknown) {
  throw Object.assign(new Error('A validação de equipes ainda não foi implementada'), { status: 501 });
}

export async function getLeaderboard() {
  return [];
}

export async function suggestWorkouts(_userEmail: string) {
  return Workout.find().limit(1).lean();
}

export { User };
