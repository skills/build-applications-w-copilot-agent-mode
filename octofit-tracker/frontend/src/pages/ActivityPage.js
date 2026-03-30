import React, { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';

function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: 'running',
    duration_minutes: '',
    calories_burned: '',
    distance_km: '',
    intensity: 'moderate',
    description: '',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.list();
      setActivities(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await activityAPI.create({
        ...formData,
        duration_minutes: parseInt(formData.duration_minutes),
        calories_burned: parseFloat(formData.calories_burned),
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null,
      });
      fetchActivities();
      setShowForm(false);
      setFormData({
        activity_type: 'running',
        duration_minutes: '',
        calories_burned: '',
        distance_km: '',
        intensity: 'moderate',
        description: '',
        timestamp: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5">
      <h1>Activities</h1>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Log Activity'}
      </button>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Activity Type</label>
                  <select
                    className="form-control"
                    name="activity_type"
                    value={formData.activity_type}
                    onChange={handleChange}
                  >
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="gym">Gym</option>
                    <option value="swimming">Swimming</option>
                    <option value="yoga">Yoga</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Calories Burned</label>
                  <input
                    type="number"
                    className="form-control"
                    name="calories_burned"
                    step="0.01"
                    value={formData.calories_burned}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Distance (km)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="distance_km"
                    step="0.1"
                    value={formData.distance_km}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Intensity</label>
                <select
                  className="form-control"
                  name="intensity"
                  value={formData.intensity}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="timestamp"
                  value={formData.timestamp}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Log Activity</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {activities.map((activity) => (
          <div key={activity.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{activity.activity_type.toUpperCase()}</h5>
                <p className="card-text">{activity.duration_minutes} min</p>
                <p className="card-text">{activity.calories_burned} cal</p>
                {activity.distance_km && <p className="card-text">{activity.distance_km} km</p>}
                <p className="text-muted small">{new Date(activity.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityPage;
