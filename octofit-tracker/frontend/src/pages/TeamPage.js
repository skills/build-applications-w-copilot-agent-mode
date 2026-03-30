import React, { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';

function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.list();
      setTeams(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
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
      await teamAPI.create(formData);
      fetchTeams();
      setShowForm(false);
      setFormData({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await teamAPI.join(teamId);
      fetchTeams();
    } catch (error) {
      console.error('Failed to join team:', error);
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5">
      <h1>Teams</h1>
      <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Create Team'}
      </button>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-success">Create Team</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">{team.description}</p>
                <p className="text-muted">Members: {team.members_count}</p>
                <p className="text-muted">Calories: {Math.round(team.total_calories_burned)}</p>
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleJoinTeam(team.id)}>
                  Join Team
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamPage;
