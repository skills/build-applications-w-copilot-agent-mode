import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';

function LeaderboardPage() {
  const [type, setType] = useState('individual');
  const [metric, setMetric] = useState('calories');
  const [period, setPeriod] = useState('weekly');
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [type, metric, period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = type === 'individual'
        ? await leaderboardAPI.getIndividual(metric, period)
        : await leaderboardAPI.getTeam(metric, period);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Leaderboards</h1>

      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Type</label>
          <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Metric</label>
          <select className="form-control" value={metric} onChange={(e) => setMetric(e.target.value)}>
            <option value="calories">Calories Burned</option>
            <option value="activities">Total Activities</option>
            <option value="consistency">Consistency</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Period</label>
          <select className="form-control" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all_time">All Time</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {leaderboard && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.entries && leaderboard.entries.map((entry) => (
              <tr key={entry.entity_id}>
                <td>#{entry.rank}</td>
                <td>{entry.entity_name}</td>
                <td>{typeof entry.score === 'number' ? (Number.isInteger(entry.score) ? entry.score : entry.score.toFixed(2)) : entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LeaderboardPage;
