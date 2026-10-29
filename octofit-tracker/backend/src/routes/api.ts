import { Router } from 'express';
import { createActivity, createTeam, getLeaderboard, listActivities, listTeams, suggestWorkouts } from '../services/octofitService.js';

export const apiRouter = Router();

apiRouter.get('/activities', async (_request, response, next) => {
  try { response.json({ activities: await listActivities() }); } catch (error) { next(error); }
});
apiRouter.post('/activities', async (request, response, next) => {
  try { response.status(201).json({ activity: await createActivity(request.body) }); } catch (error) { next(error); }
});
apiRouter.get('/teams', async (_request, response, next) => {
  try { response.json({ teams: await listTeams() }); } catch (error) { next(error); }
});
apiRouter.post('/teams', async (request, response, next) => {
  try { response.status(201).json({ team: await createTeam(request.body) }); } catch (error) { next(error); }
});
apiRouter.get('/leaderboard', async (_request, response, next) => {
  try { response.json({ leaderboard: await getLeaderboard() }); } catch (error) { next(error); }
});
apiRouter.get('/workouts/suggestions/:userEmail', async (request, response, next) => {
  try { response.json({ suggestions: await suggestWorkouts(request.params.userEmail) }); } catch (error) { next(error); }
});
