import React, { useEffect, useState } from 'react';

const initialForm = { type: '', duration: '', calories: '' };


const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
      });
  }, [apiUrl]);


  const handleShow = () => {
    setEditId(null);
    setForm(initialForm);
    setShowModal(true);
  };
  const handleEditShow = (activity) => {
    setEditId(activity.id);
    setForm({
      type: activity.type,
      duration: activity.duration,
      calories: activity.calories
    });
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
      // Edit existing activity
      fetch(`${apiUrl}${editId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(updated => {
          setActivities(activities.map(a => a.id === editId ? updated : a));
          setSubmitting(false);
          handleClose();
        })
        .catch(() => setSubmitting(false));
    } else {
      // Add new activity
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(newActivity => {
          setActivities([newActivity, ...activities]);
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
          <h2 className="card-title text-primary mb-0">Activities</h2>
          <button className="btn btn-primary" onClick={handleShow}>
            <i className="bi bi-plus-circle"></i> Add Activity
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Type</th>
                <th>Duration (min)</th>
                <th>Calories</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.type}</td>
                  <td>{activity.duration}</td>
                  <td>{activity.calories}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditShow(activity)}>
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
                  <h5 className="modal-title">{editId ? 'Edit Activity' : 'Add Activity'}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <input type="text" className="form-control" name="type" value={form.type} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Duration (min)</label>
                      <input type="number" className="form-control" name="duration" value={form.duration} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Calories</label>
                      <input type="number" className="form-control" name="calories" value={form.calories} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Activity')}
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

export default Activities;
