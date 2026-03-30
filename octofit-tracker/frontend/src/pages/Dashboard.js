import React, { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await activityAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5">
      <h1>Welcome back, {user.first_name || user.username}!</h1>
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Activities</h5>
              <p className="card-text display-4">{stats?.all_time?.total_activities || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Calories Burned</h5>
              <p className="card-text display-4">{Math.round(stats?.all_time?.total_calories || 0)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Distance</h5>
              <p className="card-text display-4">{(stats?.all_time?.total_distance || 0).toFixed(1)} km</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Current Streak</h5>
              <p className="card-text display-4">{user.current_streak || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Weekly Stats</h5>
              <p>Activities: {stats?.weekly?.total_activities || 0}</p>
              <p>Calories: {Math.round(stats?.weekly?.total_calories || 0)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Monthly Stats</h5>
              <p>Activities: {stats?.monthly?.total_activities || 0}</p>
              <p>Calories: {Math.round(stats?.monthly?.total_calories || 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
