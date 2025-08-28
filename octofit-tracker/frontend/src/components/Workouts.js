import React, { useEffect, useState } from 'react';

const initialForm = { name: '', description: '' };

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
      });
  }, [apiUrl]);

  const handleShow = () => {
    setEditId(null);
    setForm(initialForm);
    setShowModal(true);
  };
  const handleEditShow = (workout) => {
    setEditId(workout.id);
    setForm({ name: workout.name, description: workout.description });
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
          setWorkouts(workouts.map(w => w.id === editId ? updated : w));
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
        .then(newWorkout => {
          setWorkouts([newWorkout, ...workouts]);
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
          <h2 className="card-title text-danger mb-0">Workouts</h2>
          <button className="btn btn-danger" onClick={handleShow}>
            <i className="bi bi-plus-circle"></i> Add Workout
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map(workout => (
                <tr key={workout.id}>
                  <td>{workout.name}</td>
                  <td>{workout.description}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditShow(workout)}>
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
                  <h5 className="modal-title">{editId ? 'Edit Workout' : 'Add Workout'}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                    <button type="submit" className="btn btn-danger" disabled={submitting}>
                      {submitting ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Workout')}
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

export default Workouts;
