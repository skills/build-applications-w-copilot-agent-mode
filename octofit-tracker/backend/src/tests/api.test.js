const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../app');
const { buildSeedData } = require('../scripts/seed');

test('buildSeedData returns realistic documents for each collection', () => {
  const seedData = buildSeedData();

  assert.equal(seedData.users.length, 3);
  assert.equal(seedData.teams.length, 2);
  assert.equal(seedData.activities.length, 3);
  assert.equal(seedData.leaderboard.length, 3);
  assert.equal(seedData.workouts.length, 3);

  assert.ok(seedData.users.every((user) => user.email.includes('@')));
  assert.ok(seedData.activities.every((activity) => activity.points > 0));
  assert.ok(seedData.workouts.every((workout) => workout.durationMinutes > 0));
});

test('health endpoint and data routes return payloads', async () => {
  const server = app.listen(0);

  try {
    const port = await new Promise((resolve) => server.once('listening', () => resolve(server.address().port)));
    const baseUrl = `http://127.0.0.1:${port}`;

    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    const healthJson = await health.json();
    assert.equal(healthJson.status, 'ok');

    const users = await fetch(`${baseUrl}/api/users/`);
    assert.equal(users.status, 200);
    const usersJson = await users.json();
    assert.ok(Array.isArray(usersJson.items));
    assert.equal(usersJson.count, usersJson.items.length);

    const teams = await fetch(`${baseUrl}/api/teams/`);
    assert.equal(teams.status, 200);
    const teamsJson = await teams.json();
    assert.ok(Array.isArray(teamsJson.items));

    const activities = await fetch(`${baseUrl}/api/activities/`);
    assert.equal(activities.status, 200);
    const activitiesJson = await activities.json();
    assert.ok(Array.isArray(activitiesJson.items));

    const leaderboard = await fetch(`${baseUrl}/api/leaderboard/`);
    assert.equal(leaderboard.status, 200);
    const leaderboardJson = await leaderboard.json();
    assert.ok(Array.isArray(leaderboardJson.items));

    const workouts = await fetch(`${baseUrl}/api/workouts/`);
    assert.equal(workouts.status, 200);
    const workoutsJson = await workouts.json();
    assert.ok(Array.isArray(workoutsJson.items));
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
