import React, { useEffect, useState } from 'react';

const initialForm = { name: '' };

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
      });
  }, [apiUrl]);

  const handleShow = () => {
    setEditId(null);
    setForm(initialForm);
    setShowModal(true);
  };
  const handleEditShow = (team) => {
    setEditId(team.id);
    setForm({ name: team.name });
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    if (editId) {
      fetch(`${apiUrl}${editId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(updated => {
          setTeams(teams.map(t => t.id === editId ? updated : t));
          setSubmitting(false);
          handleClose();
        })
        .catch(() => setSubmitting(false));
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(newTeam => {
          setTeams([newTeam, ...teams]);
          setSubmitting(false);
          handleClose();
        })
        .catch(() => setSubmitting(false));
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="card-title text-info mb-0">Teams</h2>
          <button className="btn btn-info text-white" onClick={handleShow}>
            <i className="bi bi-plus-circle"></i> Add Team
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditShow(team)}>
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Edit Team' : 'Add Team'}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                    <button type="submit" className="btn btn-info text-white" disabled={submitting}>
                      {submitting ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Team')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
